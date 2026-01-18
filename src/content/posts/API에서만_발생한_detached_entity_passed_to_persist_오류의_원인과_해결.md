---
title: "API에서만 발생한 detached entity passed to persist 오류의 원인과 해결"
description: "Spring Boot + JPA 환경에서 Scheduler에서는 정상인데 API 호출 시에만 Detached Entity 예외가 발생한 이유와 실무적 해결책을 정리합니다."
date: 2025-11-11
category: backend
tags:
  - spring-boot
  - jpa
  - hibernate
draft: false
featured: true
author: 박용준
---

Spring Boot + JPA 환경에서 동일한 로직인데도 Scheduler에서는 정상 동작하고, API 호출 시에만 `detached entity passed to persist` 예외가 발생하는 상황을 경험했습니다. 이번 글에서는 그 원인과 해결 방법을 정리해보겠습니다.


## **1. 문제 상황**

현재 서비스는 다음과 같은 구조로 설계되어 있습니다.

![class architecture](/images/2025-11-11/class-chart.png)

- CollectionBatch의 `@Scheduled` 메서드와 CollectionController 모두 **같은 Facade 메서드**를 호출
- CollectionFacade의 메서드에는 `@Transactional`이 없고, 내부의 일부 Service만 `@Transactional` 선언
- `@Transactional` 호출 순서
    - 먼저 `CollectionService.saveCollectGroup()`으로 Collect 단위를 생성
    - 이후 `CollectionService.batchSaveGroups()`를 사용해 JdbcTemplate으로 Bulk INSERT/UPDATE 진행

문제는 **API에서는 `detached entity passed to persist` 예외가 발생**하지만, **Scheduler에서는 정상 동작**한다는 점이었습니다.


## **2. 원인 분석**

### **2.1 OSIV(Open EntityManager In View) 차이**

Spring Boot는 기본적으로 `spring.jpa.open-in-view=true`로 설정되어 있습니다. 이로 인해 API 요청과 Scheduler 간에 동작 차이가 발생합니다.

**API 요청 시:**
- 요청 전체에 걸쳐 `EntityManager`가 열려 있습니다.
- `@Transactional`이 끝난 뒤에도 동일 스레드에서 **준영속(Detached) 상태의 엔티티를 참조**할 수 있습니다.

**Scheduler 스레드:**
- OSIV 필터가 적용되지 않습니다.
- 각 `@Transactional` 블록마다 **독립된 영속성 컨텍스트(PC)**가 생성되고 종료됩니다.

결과적으로 API에서는 OSIV가 유지한 `EntityManager`가 트랜잭션 종료 후에도 열려 있고, 이후 `JdbcTemplate` 실행 시 JPA의 `flush()`가 개입하면서 Detached 상태 엔티티가 다시 `persist`로 전이되어 예외가 발생합니다.

### **2.2 Detached Entity 예외 발생 메커니즘**

Hibernate는 엔티티 상태를 다음과 같이 관리합니다.

| 상태 | 설명 |
|------|------|
| Transient | 아직 DB에 없는 새로운 객체 (id 없음) |
| Managed | 트랜잭션 내에서 EntityManager가 관리 중인 객체 |
| Detached | 트랜잭션이 끝나서 EntityManager가 더 이상 추적하지 않는 객체 |

`persist()`는 **오직 Transient 상태만** 허용합니다. 따라서 다음 경우에 예외가 발생합니다:

- 이미 id가 존재하는 엔티티 (Detached 상태)
- Cascade PERSIST를 통해 Detached된 객체를 전이하려고 시도


## **3. 해결 방안**

### **3.1 Entity → DTO 변환**

JPA 트랜잭션 경계 내에서는 오직 JPA만 사용하고, JDBC 연산은 **별도의 DTO 객체로 수행**합니다. 이렇게 하면 JPA가 flush 대상 그래프를 추적하지 않게 됩니다.

```java
@Transactional
public void batchSaveAllWithProductOrderForCollection(List<ReturnsOrder> orders) {
    List<ReturnsOrderUpsertRow> rows = orders.stream()
        .map(r -> new ReturnsOrderUpsertRow(
            r.getId(), r.getCollectGroup().getId()))
        .toList();

    returnsOrderJdbcRepository.batchUpsert(rows);
}
```

| 구분 | 내용 |
|------|------|
| 장점 | flush 충돌 완전 차단, 트랜잭션 경계 명확, 엔티티 상태 관리 단순 |
| 단점 | JPA ↔ JDBC 간 DTO 매핑 필요, 코드 중복 증가 가능 |

### **3.2 OSIV 정책 조정**

`spring.jpa.open-in-view=false`로 설정하면, **트랜잭션이 종료되면 EntityManager가 바로 닫힙니다.**

```yaml
spring:
  jpa:
    open-in-view: false
```

이렇게 설정하면 다음과 같이 동작이 변경됩니다:

- API 요청마다 서비스 계층 내에서만 EntityManager가 활성화됩니다.
- 트랜잭션 외부에서는 JPA 세션이 완전히 닫혀 Detached 관리가 명확해집니다.
- Flush 타이밍이 예측 가능하고, OSIV로 인한 비의도적 flush가 제거됩니다.

| 구분 | 내용 |
|------|------|
| 장점 | EntityManager 생명주기 명확, OSIV로 인한 예외 방지, 대규모 트래픽 서비스 권장 설정 |
| 단점 | Controller/View에서 Lazy Loading 불가, DTO 변환 필수 |


## **4. 정리**

API와 Scheduler 간 환경 차이로 인한 `detached entity passed to persist` 예외를 해결하기 위한 방법을 정리하면 다음과 같습니다:

1. **Facade 단위에서 `@Transactional`로 경계 단일화**
2. **Entity 대신 DTO 사용으로 JPA/JDBC 간 충돌 방지**
3. **OSIV 비활성화로 EntityManager 생명주기 명확화**

이 조합을 통해 API/Scheduler 간 환경 차이에 의한 예외를 근본적으로 차단할 수 있습니다. 특히 OSIV는 편리하지만 예상치 못한 문제를 야기할 수 있으므로, 대규모 트래픽을 처리하는 서비스에서는 비활성화를 권장합니다.

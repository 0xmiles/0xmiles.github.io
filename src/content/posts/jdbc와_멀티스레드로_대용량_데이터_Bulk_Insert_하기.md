---
title: "JDBC와 멀티 스레드로 대용량 데이터 Bulk Insert 하기"
description: "JPA saveAll의 한계와 JDBC batchUpdate + 멀티스레드를 활용한 대용량 데이터 Bulk Insert 성능 최적화 방법을 알아봅니다."
date: 2025-09-02
category: backend
tags:
  - spring-boot
  - jdbc
  - jpa
draft: false
featured: true
author: 박용준
---

SQL 혹은 QueryDSL 로 작성한 Repository 메소드를 테스트하기 위해서 대용량 데이터를 사용하는 경우가 있습니다. 이때, 테스트 코드를 통해 데이터를 삽입해야 한다면 대용량 데이터를 저장하는데 소요되는 시간을 최소화할 필요가 있습니다. 그 과정에서 JPA의 saveAll 메소드와 JdbcTemplate의 BatchUpdate와 멀티 스레드를 사용한 방법에서 어떤 방법이 더욱 성능이 좋은지 테스트해보겠습니다.

## **0. 들어가며**

해당 테스트는 다음과 같은 환경에서 진행됐습니다. 테스트 환경이 다르면 성능 결과가 다르게 나올 수도 있기 때문에 공유드리겠습니다.

> Java 17
> Spring Boot 3.4.2

---

## **1. Entity**

이번 테스트는 제가 토이 프로젝트 중에 진행한 테스트로 다음과 같은 Entity에서 진행되었습니다.

![ERD](/images/2025-09-02/erd.png)

위 테이블을 제외하고 다른 테이블도 존재하지만, 해당 테스트에서는 위 5개의 테이블만 사용하겠습니다.

---

## **2. JPA의 saveAll**

### **2.1 save vs saveAll**

JPA의 save와 saveAll은 모두 JpaRepository를 상속하여 정의된 Repository 내의 메소드들입니다. 그리고 두 메소드 모두 `@Transactional`로 감싸져있다는 것까지는 동일합니다. 

두 메소드의 핵심 차이점은 **트랜잭션 범위**에 있습니다:

- **개별 save 호출 (외부 @Transactional 없음)**: 각 save 호출마다 새로운 트랜잭션이 생성되고 커밋됩니다. N개의 엔티티를 저장하면 N번의 트랜잭션 생성/커밋 오버헤드가 발생합니다.
- **개별 save 호출 (외부 @Transactional 있음)**: 외부 트랜잭션에 참여하여 하나의 트랜잭션 내에서 실행됩니다. 트랜잭션 오버헤드는 줄어들지만, 각 save 호출마다 프록시 객체를 통해 호출되므로 약간의 오버헤드가 존재합니다.
- **saveAll 호출**: 하나의 트랜잭션 내에서 내부적으로 save를 **직접** 호출합니다(프록시를 거치지 않음). 따라서 트랜잭션 오버헤드와 프록시 호출 오버헤드 모두 최소화됩니다.

이 때문에 여러 엔티티를 저장할 때는 개별 save 반복보다 saveAll의 실행속도가 더 빠릅니다.


### **2.2 saveAll 문제**

하지만 saveAll에서도 문제는 발생합니다. 이제부터 그 문제는 무엇이며 그로 인한 결과는 어떤지를 확인해보도록 하겠습니다.

#### **ID 생성 전략과 Batch Insert**

JPA에서 Bulk Insert가 어려운 **가장 핵심적인 원인**은 ID 생성 전략에 있습니다.

- **`@GeneratedValue(strategy = GenerationType.IDENTITY)`**: MySQL의 AUTO_INCREMENT처럼 DB가 ID를 생성하는 방식입니다. 이 경우 Hibernate는 INSERT 후에야 ID를 알 수 있으므로 **Batch Insert가 불가능**합니다.
- **`@GeneratedValue(strategy = GenerationType.SEQUENCE)`**: DB 시퀀스를 통해 미리 ID를 할당받으므로 **Batch Insert가 가능**합니다.

MySQL은 Sequence를 지원하지 않기 때문에, 일반적으로 IDENTITY 전략을 사용하게 되고 이로 인해 JPA의 Batch Insert 기능을 활용할 수 없습니다.

> 💡 **참고**: PostgreSQL이나 Oracle 같이 Sequence를 지원하는 DB를 사용하고, `hibernate.jdbc.batch_size` 설정을 추가하면 JPA에서도 Batch Insert가 가능합니다.

```java
  @Test
  @DisplayName("푸드 트럭 저장 테스트")
  @Sql(value = "classpath:sql/delete-food-truck.sql",
      executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
  void saveFoodTrucks() {

    List<FoodTruck> data = new ArrayList<>();
    LargeRegion largeRegion = LargeRegion.builder().name("large Region").build();
    SmallRegion smallRegion = SmallRegion.builder().name("small Region").build();
    Category category = Category.builder().name("category").build();

    for (int i = 0; i < TOTAL_COUNT; i++) {
      FoodTruckRegion foodTruckRegion = FoodTruckRegion.builder().smallRegion(smallRegion).lat("28")
          .lng("12").name("food truck region").build();

      List<FoodTruckCategory> categories = new ArrayList<>();

      categories.add(FoodTruckCategory.builder().category(category).build());

      FoodTruck foodTruck = FoodTruck.builder().openAt(10).closeAt(22).region(foodTruckRegion)
          .name("Food Truck " + i).categories(categories).build();
      data.add(foodTruck);
    }

    foodTruckRepository.saveAll(data);
    System.out.println("FoodTrucks : " + foodTruckRepository.count());

  }
```

자, 위와 같은 코드가 있다고 가정해보겠습니다. 해당 코드는 최종적으로 TOTAL_COUNT 만큼의 FoodTruck을 생성하는 코드입니다. 해당 코드를 실행하면 아래와 같은 로그가 출력됩니다.

> o.s.orm.jpa.JpaTransactionManager : Creating new transaction with name

보시면 아시겠지만 food_truck_category, food_truck_regoin, food_truck 3가지 테이블에 대해서 insert문이 한 묶음으로 계속 반복됨을 알 수 있습니다.

분명

`List<FoodTruck> data = new ArrayList<>();`

와 같이 List로 data를 만들어준 다음에 saveAll(data) 를 실행해주었음에도 말입니다. 그 이유는 앞서 말씀드린대로 saveAll은 내부적으로 save를 호출하고 있기 때문인데요. saveAll로 들어온 List를 하나씩 save를 호출하면서 insert를 진행하기 때문입니다. 따라서 N개의 데이터를 저장하고자 한다면 최소 N번의 SQL Query를 보내주어야 한다는 단점이 있고, 그 때문에 Bulk Insert에는 어울리지 않습니다.

### **2.3 saveAll 결과**

이론상으로는 saveAll의 Bulk Insert 성능이 그다지 좋지 않을 것이라고 예상은 되지만, 한번 확인을 할 필요는 있어보입니다. 이후 JDBC를 사용한 방법과 비교를 하기 위해서 말이죠. 그래서 이번에는 위와 동일한 코드를 기준으로 TOTAL_COUNT를 10만개로 설정하고 실행을 해보도록 하겠습니다.

![saveAll result](/images/2025-09-02/save-all-result.png)

테스트 결과 2분 48초가 소요가 되었습니다. 환경에 따라 조금씩 다를 수는 있겠지만 10만건 데이터 삽입에 2분 후반대의 성능은 결코 우수하다고 볼 수 없겠습니다.

---

## **3. JDBC Bulk Insert & Multi Thread**

따라서 이번에는 JDBC를 사용해서 Bulk Insert를 구현해보도록 하겠습니다.

### **3.1 jdbcTemplate.batchUpdate**

JDBC의 JdbcTemplate에는 batchUpdate라는 메소드가 있습니다. JPA의 saveAll과 달리 batchUpdate는 batch insert를 지원합니다. 즉 다음과 같은 연산이 가능하다는 뜻입니다.

> INSERT INTO food_truck_region (lat, lng, name, small_region_id) VALUES (?, ?, ?, ?), (?, ?, ?, ?), ...

JPA의 saveAll이 개별 INSERT를 실행하는 모습과 달리 한번에 데이터를 삽입하고 있습니다. 이를 통해 한눈으로 봐도 효율적으로 데이터를 삽입하고 있음을 알 수 있습니다.

> ⚠️ **MySQL 사용 시 주의**: MySQL에서 실제로 Batch Insert가 동작하려면 JDBC URL에 `rewriteBatchedStatements=true` 옵션을 추가해야 합니다.
> 
> ```properties
> spring.datasource.url=jdbc:mysql://localhost:3306/db?rewriteBatchedStatements=true
> ```
> 
> 이 옵션이 없으면 내부적으로 개별 INSERT가 실행되어 성능 이점이 없습니다.

저는 food_truck, food_truck_region, food_truck_category 3개의 테이블에 Bulk Insert를 수행할 예정이기 때문에 다음과 같은 Class를 3개 구현하여 사용했습니다.

```java
@Repository
@RequiredArgsConstructor
public class FoodTruckRegionBatchRepository implements BatchRepository<FoodTruckRegionBatchDto> {

  private final JdbcTemplate jdbcTemplate;

  @Override
  public void batchInsert(List<FoodTruckRegionBatchDto> foodTruckRegions) {
    jdbcTemplate.batchUpdate(
        "INSERT INTO food_truck_region (lat, lng, name, small_region_id) VALUES (?, ?, ?, ?)",
        foodTruckRegions, foodTruckRegions.size(), (ps, data) -> {
          ps.setString(1, data.getLat());
          ps.setString(2, data.getLng());
          ps.setString(3, data.getName());
          ps.setLong(4, data.getSmallRegionId());
        });
  }
}
```

이를 통해 batchInsert 메서드를 통해 들어온 데이터를 한번에 삽입할 수 있었습니다.

하지만, 역시나 10만개의 데이터를 삽입하기에는 만족스러운 결과를 얻을 수는 없었습니다. 따라서 저는 Multi Thread를 사용해 이를 해결하고자 했습니다.

### **3.2 Bulk Insert With Multi Thread**

멀티 쓰레드를 사용하면 쓰레드의 개수를 늘려 동시에 여러 batchUpdate 가 가능합니다. 물론 그 과정에서 JdbcTemplate이 Thread-safe하며 멀티 쓰레드 간의 데이터를 적절하게 나누어줘야 함이 보장돼야 합니다.

```java
@Component
public class MultiThreadExecutor {

  @Value("${multi-thread.thread-count}")
  private int NUM_THREAD;

  public <T> void executeBatch(List<T> dataList, int totalCount, BatchRepository<T> batchRepository)
      throws ExecutionException, InterruptedException {
    ExecutorService executorService = Executors.newFixedThreadPool(NUM_THREAD);
    List<Future<?>> futures = new ArrayList<>();
    int batchSize = (int) Math.ceil((double) totalCount / NUM_THREAD);

    for (int i = 0; i < NUM_THREAD; i++) {
      int start = i * batchSize;
      int end = Math.min(start + batchSize, totalCount);

      if (start >= end) {
        break;
      }

      List<T> subList = new ArrayList<>(dataList.subList(start, end));

      futures.add(executorService.submit(() -> {
        try {
          batchRepository.batchInsert(subList);
        } catch (Exception e) {
          System.err.println("Batch Execution Error : " + e.getMessage());
          throw new RuntimeException(e);
        }
      }));
    }

    for (Future<?> future : futures) {
      future.get();
    }

    executorService.shutdown();
  }
}
```

멀티 쓰레드를 효과적으로 사용하기 위해 MultiThreadExecutor 클래스를 구현했습니다. 해당 클래스의 executeBatch는 받아온 데이터를 쓰레드 개수와 전체 데이터의 개수를 기반으로 데이터를 분리하여 쓰레드에 뿌려줍니다. 그 과정에서 BatchRepository를 구현한 Class를 사용해 전략 패턴으로서 코드를 설계했습니다.

이를 사용한 전체 코드를 보면 다음과 같습니다.

```java
  private void insertFoodTruckRegions() throws Exception {

    List<Long> smallRegionIds = jdbcTemplate.queryForList("SELECT id FROM small_region",
        Long.class);

    List<FoodTruckRegionBatchDto> dataList = new ArrayList<>();
    for (int i = 0; i < TOTAL_COUNT; i++) {
      dataList.add(FoodTruckRegionBatchDto.builder().lat(String.valueOf(36.00001 + i * 0.00001))
          .lng(String.valueOf(40 + i * 0.00001)).name("서울 특별시 어쩌구 저쩌구")
          .smallRegionId(smallRegionIds.get(i % smallRegionIds.size())).build());
    }

    multiThreadExecutor.executeBatch(dataList, TOTAL_COUNT,
        foodTruckRegionBatchRepository);
  }
```

> 💡 **트랜잭션 관리 팁**: 위 예제에서 `jdbcTemplate.execute("COMMIT")`을 직접 호출하는 것보다는 Spring의 `@Transactional` 어노테이션을 사용하거나 `TransactionTemplate`을 활용하는 것이 권장됩니다. 직접 COMMIT을 호출하면 Spring의 트랜잭션 관리와 충돌할 수 있습니다.

위 코드는 food_truck_region을 생성하는 메소드이며, 같은 방식으로 food_truck 과 food_truck_category를 생성하는 메소드를 작성해서 테스트를 진행해보겠습니다.

### **3.3 성능 비교 결과**

| 방식 | 10만 건 삽입 시간 |
|------|------------------|
| JPA saveAll | 약 2분 48초 |
| JDBC batchUpdate + 멀티스레드 | 약 3초 |

2분 후반대가 걸리던 로직이 단 3초로 줄어들었음을 확인할 수 있습니다. 저처럼 관계된 테이블의 데이터를 생성하는 로직을 작성하지 않고 단일 테이블에 대해서만 Bulk Insert를 구현한다면 더욱 짧은 시간 내에 생성이 가능할 것 같습니다.

---

## **4. 정리**

| 항목 | JPA saveAll | JDBC batchUpdate |
|------|-------------|------------------|
| 사용 편의성 | 높음 | 낮음 (직접 SQL 작성) |
| Batch Insert 지원 | IDENTITY 전략 시 불가 | 가능 |
| 멀티스레드 적용 | 복잡함 | 용이함 |
| 대용량 데이터 성능 | 느림 | 빠름 |

대용량 데이터를 빠르게 삽입해야 하는 경우, 특히 테스트 데이터 생성이나 마이그레이션 작업에서는 JDBC의 batchUpdate와 멀티스레드를 조합하는 것이 효과적입니다. 다만, 일반적인 비즈니스 로직에서는 JPA의 편의성과 영속성 컨텍스트 관리 이점이 있으므로 상황에 맞게 선택하시기 바랍니다.
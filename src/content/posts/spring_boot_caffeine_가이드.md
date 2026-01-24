---
title: "Spring Boot Caffeine 캐시 가디으 - 설정부터 Window TinyLfu까지"
description: "Spring Boot 환경에서 Caffeine 캐시를 도입하는 방법부터 제거 전략, Window TinyLfu 알고리즘의 동작 원리, 그리고 실전 무효화 패턴까지 단계별로 정리합니다."
date: 2026-01-03
category: backend
tags:
  - spring-boot
  - caffeine
  - cache
  - window-tinylfu
  - in-memory-cache
  - performance
draft: false
featured: true
author: 박용준
---

> 해당 글은 AI를 활용하여 작성되었습니다.

개발하다 보면 한 번쯤 이런 경험 있으실 겁니다. API 응답 속도를 개선하려고 캐시를 도입했는데, 막상 프로덕션에 배포하고 나니 메모리는 메모리대로 차오르고, 정작 필요한 데이터는 캐시에서 밀려나 있더라는. 특히 트래픽이 급증하는 순간, 어떤 데이터를 캐시에 남기고 어떤 걸 제거해야 할지 결정하는 게 생각보다 까다롭죠.

Spring Boot 환경에서 **Caffeine 캐시**는 이런 고민을 해결해주는 강력한 선택지입니다. 단순히 "빠른 인메모리 캐시"를 넘어서, Window TinyLfu라는 정교한 알고리즘으로 진짜 필요한 데이터를 똑똑하게 유지합니다. 하지만 제대로 활용하려면 제거 전략부터 무효화 패턴까지 전체 그림을 이해해야 합니다.

이 글에서는 Caffeine을 Spring Boot에 통합하는 설정부터 시작해, 각 캐시 제거 전략의 실제 동작 원리, Window TinyLfu 알고리즘의 작동 방식, 그리고 프로덕션에서 바로 적용 가능한 실전 패턴까지 단계별로 살펴보겠습니다. 이론보다는 "언제, 왜 이 방식을 선택해야 하는가"에 초점을 맞춰 진행합니다.

## Spring Boot에서 Caffeine 캐시가 필요한 이유

### 실제 비즈니스 사례: 반복 조회로 인한 성능 및 비용 문제

개발하다 보면 한 번쯤 이런 경험 있으실 겁니다. 상품 상세 페이지나 사용자 프로필처럼 자주 조회되는 데이터를 매번 DB에서 가져오다 보니, RDS 비용이 예상보다 훨씬 많이 나오는 상황 말이죠. 특히 AWS 환경에서 운영하다 보면 EC2와 RDS로 쏟아지는 반복적인 요청들이 단순히 성능 문제를 넘어 실제 비용 증가로 직결됩니다.

예를 들어, 하루에 수만 번 조회되는 카테고리 정보와 같은 데이터는 자주 변경되지 않는데도 매번 DB 쿼리를 날리는 건 리소스 낭비입니다.

### 인메모리 캐시 솔루션 비교

그렇다면 어떤 캐시 솔루션을 선택해야 할까요? 주요 옵션들을 간단히 비교해 보겠습니다.

- **Redis**: 분산 환경에 강하지만 네트워크 I/O 비용이 발생하고, 단순 로컬 캐싱에는 오버스펙
- **EhCache**: 오래된 안정성은 있지만 성능과 메모리 효율성이 상대적으로 떨어짐
- **Guava Cache**: 구글이 만든 검증된 라이브러리지만, 이미 유지보수 모드
- **Caffeine**: Guava Cache의 후속 버전으로, Java 8+ 환경에 최적화된 고성능 캐시

Caffeine이 주목받는 이유는 단순합니다. Java 8 기반의 고성능 오픈소스 라이브러리이며 Window TinyLfu 알고리즘으로 높은 히트율을 유지하면서도, 동시성 처리가 뛰어나 멀티스레드 환경에서도 안정적이기 때문입니다. 또한 ConcurrentLinkedHashMap과 Guava 캐시의 후속 버전으로 개발되어 높은 히트율과 우수한 동시성을 제공합니다.

## Spring Boot와 Caffeine 통합 설정

Spring Boot에서 Caffeine을 사용하기 위한 설정은 생각보다 간단합니다. 복잡한 구성 없이도 빠르게 캐싱 기능을 적용할 수 있는데요, 단계별로 살펴보겠습니다.

### 의존성 설정

먼저 필요한 라이브러리를 추가해야 합니다. Spring Boot에서는 두 가지 의존성이 필요합니다.

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-cache'
    implementation 'com.github.ben-manes.caffeine:caffeine'
}
```

Maven을 사용하신다면

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```


### Auto-configuration 활성화


```java
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

이제 Spring의 캐시 추상화 레이어가 활성화되어, 어노테이션 기반으로 캐싱을 적용할 수 있습니다. 별도 설정 없이도 기본 캐시 매니저가 동작하지만, 실무에서는 보통 세밀한 제어를 위해 직접 설정하는 편입니다.

### 캐시 매니저 구성

프로덕션 환경에서는 캐시별로 다른 정책을 적용해야 하는 경우가 많습니다. 예를 들어, 사용자 정보는 10분간 유지하고, 상품 카테고리는 1시간 동안 캐시하고 싶다면

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();

        CaffeineCache userCache = new CaffeineCache(
            "USER",
            Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(10_000)
                .recordStats()
                .build()
        );

        CaffeineCache categoryCache = new CaffeineCache(
            "CATEGORY",
            Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(5_000)
                .recordStats()
                .build()
        );

        cacheManager.setCaches(List.of(userCache, categoryCache));
        return cacheManager;
    }
}
```

와 같이 설정할 수 있습니다. 물론, 실무에선 각 캐시 Key를 분리할 수 있는 다른 전략을 사용하는 방법이 필요합니다.

## Caffeine 캐시 제거 전략 심층 분석

캐시를 도입하면 바로 마주하게 되는 질문이 있습니다. "언제, 어떤 데이터를 캐시에서 지워야 할까?" 무한정 데이터를 쌓아둘 수는 없기 때문입니다. Caffeine은 이 문제를 세 가지 핵심 전략으로 해결합니다. 실무에서 어떤 상황에 어떤 전략을 선택해야 하는지 함께 살펴보겠습니다.

### 크기 기반 제거 (Size-based Eviction)

메모리를 얼마나 쓸 수 있는지가 명확할 때 가장 먼저 고려하는 방식입니다.

```java
Cache<String, User> cache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .build();
```

캐시 항목이 10,000개를 넘어가면 가장 최근에 사용되지 않은 항목부터 자동으로 제거됩니다. AWS EC2 인스턴스의 메모리가 제한적이거나, 특정 API 엔드포인트에 할당할 수 있는 메모리 용량이 정해져 있을 때 유용합니다.

### 시간 기반 제거 (Time-based Eviction)

하루에 1~5번 정도만 데이터가 변경되는 경우라면? 시간 기반 제거가 훨씬 효율적입니다.

```java
// expireAfterWrite: 작성 후 일정 시간이 지나면 무조건 제거
Cache<String, Product> cache = Caffeine.newBuilder()
    .expireAfterWrite(1, TimeUnit.HOURS)
    .build();

// expireAfterAccess: 마지막 접근 후 일정 시간 동안 사용되지 않으면 제거
Cache<String, Product> cache = Caffeine.newBuilder()
    .expireAfterAccess(30, TimeUnit.MINUTES)
    .build();
```

**두 방식의 차이**

- `expireAfterWrite`: 캐시에 저장된 시점부터 카운트. 데이터 신선도가 중요할 때 사용
- `expireAfterAccess`: 마지막 조회 시점부터 카운트. 자주 쓰는 데이터를 오래 유지하고 싶을 때 사용

실무에서는 보통 두 전략을 조합합니다. 예를 들어, 상품 정보는 최대 1시간까지만 유지하되, 30분간 조회가 없으면 미리 제거하는 식이죠:

```java
Cache<String, Product> cache = Caffeine.newBuilder()
    .expireAfterWrite(1, TimeUnit.HOURS)
    .expireAfterAccess(30, TimeUnit.MINUTES)
    .build();
```

### 참조 기반 제거 (Reference-based Eviction)

메모리 압박이 심한 환경에서 JVM의 GC와 협력하는 방식입니다. Weak Reference나 Soft Reference를 사용해 메모리가 부족하면 캐시를 자동으로 비웁니다.

```java
Cache<String, HeavyObject> cache = Caffeine.newBuilder()
    .weakKeys()
    .softValues()
    .build();
```


## Window TinyLfu 알고리즘 이해하기

캐시를 다루다 보면 "어떤 데이터를 버릴까?"라는 고민을 한 번쯤 하게 됩니다. Caffeine이 높은 성능을 자랑하는 비결, 바로 Window TinyLfu 알고리즘에 있습니다.

### LRU와 LFU의 한계점과 Window TinyLfu의 등장 배경

전통적인 캐시 제거 정책인 LRU(Least Recently Used)는 구현이 간단하지만 치명적인 약점이 있습니다. 최근에 한 번만 접근된 데이터가 자주 쓰이는 데이터를 밀어낼 수 있다는 점이죠. 반대로 LFU(Least Frequently Used)는 접근 빈도를 추적하지만, 과거 인기 데이터가 더 이상 필요 없어져도 계속 캐시에 남는 문제가 있습니다.

개발하다 보면 이런 상황 자주 마주치실 겁니다. 배치 작업으로 일시적으로 대량 조회가 발생했을 때, LRU 캐시가 순식간에 무용지물이 되는 경험 말이죠. Window TinyLfu는 바로 이런 한계를 극복하기 위해 설계되었습니다.

### Window Cache와 Main Cache의 역할 분담

Window TinyLfu는 캐시를 두 개의 공간으로 나눕니다.

**Window Cache (1%)**
- 새로 들어오는 항목을 일시적으로 보관하는 공간
- LRU 방식으로 동작
- 일시적인 트래픽 스파이크로부터 Main Cache를 보호

**Main Cache (99%)**
- 실제로 자주 쓰이는 데이터가 머무는 공간
- Probationary(20%)와 Protected(80%) 세그먼트로 다시 나뉨
- 빈도 기반으로 중요도를 판단

이 구조가 실제로 어떻게 동작할까요? 예를 들어 설명해보겠습니다.

### 실제 동작 시나리오

새로운 데이터가 요청되면:

1. **첫 진입**: Window Cache에 임시 저장
2. **재요청 발생**: 빈도가 증가하며 Main Cache 진입 후보가 됨
3. **Admission Policy 판단**: 현재 Main Cache의 victim(제거 대상)보다 빈도가 높으면 진입 허용
4. **Main Cache 내부 이동**: 자주 쓰이면 Protected 영역으로 승격

이 방식의 핵심은 "한 번만 쓰이는 데이터"가 "자주 쓰이는 데이터"를 밀어내지 못하게 막는다는 점입니다. 배치 작업으로 일시적으로 대량 조회가 발생해도, 정작 중요한 사용자 데이터는 안전하게 캐시에 남아있는 것이죠.

### TinyLfu의 Count-Min Sketch

빈도를 추적하는 방식의 경우 모든 키의 접근 횟수를 정확히 저장하는 대신, **Count-Min Sketch**라는 확률적 자료구조를 사용해 메모리를 극도로 절약합니다.

```java
// Caffeine 내부적으로 이렇게 동작
// 실제 구현 코드를 직접 작성할 필요는 없습니다
Cache<String, User> cache = Caffeine.newBuilder()
    .maximumSize(10_000)  // Window TinyLfu가 자동으로 적용됨
    .build();
```

개발자는 단순히 `maximumSize`만 지정하면, Caffeine이 알아서 Window TinyLfu를 적용해줍니다. 별도 설정이 필요 없다는 게 가장 큰 장점입니다.

## 실전 구현 패턴

이제는 실제 프로젝트에 어떻게 적용하는지 살펴보겠습니다. Spring Boot에서 자주 마주치는 상황별로 정리했습니다.

### 기본 애노테이션 활용

가장 기본적인 방법은 Spring의 캐시 애노테이션을 사용하는 것입니다.

```java
@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        // DB 조회
        return productRepository.findById(id)
            .orElseThrow();
    }

    @CacheEvict(value = "products", key = "#id")
    public void updateProduct(Long id, Product product) {
        productRepository.save(product);
    }

    @CacheEvict(value = "products", allEntries = true)
    public void refreshAllProducts() {
        // 전체 캐시 무효화
    }
}
```

이 방식은 간단하지만, 복잡한 키 생성 로직이나 조건부 캐싱이 필요하면 한계가 있습니다.

### 프로그래밍 방식 캐시 제어

좀 더 세밀한 제어가 필요할 때는 직접 Cache 객체를 주입받아 사용합니다.

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final CacheManager cacheManager;
    private final UserRepository userRepository;

    public User getUser(Long userId) {
        Cache cache = cacheManager.getCache("users");
        if (cache == null) {
            return loadFromDatabase(userId);
        }

        User cachedUser = cache.get(userId, User.class);
        if (cachedUser != null) {
            return cachedUser;
        }

        User user = loadFromDatabase(userId);
        cache.put(userId, user);
        return user;
    }

    public void updateUser(Long userId, User user) {
        userRepository.save(user);

        Cache cache = cacheManager.getCache("users");
        if (cache != null) {
            cache.evict(userId);
        }
    }

    private User loadFromDatabase(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
```

이 방식은 코드가 길어지지만, 캐시 미스 시 로직을 자유롭게 제어할 수 있습니다.

### 조건부 캐싱 패턴

모든 데이터를 캐시에 넣는 게 항상 좋은 건 아닙니다. 예를 들어, VIP 사용자 정보만 캐시하고 싶다면?

```java
@Service
public class UserService {

    @Cacheable(value = "vipUsers", key = "#userId",
               condition = "#result != null && #result.vip == true")
    public User getUser(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }
}
```

`condition` 속성으로 캐시 저장 여부를 동적으로 결정할 수 있습니다. 반대로 `unless`를 쓰면 특정 조건에서 캐시를 건너뛸 수도 있죠.

### 다중 캐시 키 조합

실무에서는 단일 파라미터가 아니라 여러 조건을 조합해야 하는 경우가 많습니다.

```java
@Service
public class ProductService {

    @Cacheable(value = "productSearch",
               key = "#category + ':' + #minPrice + ':' + #maxPrice")
    public List<Product> searchProducts(String category,
                                       BigDecimal minPrice,
                                       BigDecimal maxPrice) {
        return productRepository.findByCategoryAndPriceBetween(
            category, minPrice, maxPrice
        );
    }
}
```

복잡한 키 조합이 필요하면 별도 `KeyGenerator`를 구현하는 것도 방법입니다.

```java
@Component
public class CustomKeyGenerator implements KeyGenerator {
    @Override
    public Object generate(Object target, Method method, Object... params) {
        return Arrays.stream(params)
            .map(Object::toString)
            .collect(Collectors.joining(":"));
    }
}

// 사용
@Cacheable(value = "products", keyGenerator = "customKeyGenerator")
public List<Product> searchProducts(...) {
    // ...
}
```

## 캐시 무효화 전략

캐시를 도입하면 꼭 따라오는 고민이 있습니다. "언제 캐시를 비워야 할까?" 잘못 설계하면 사용자가 오래된 데이터를 보게 되거나, 반대로 너무 자주 비워서 캐시의 의미가 없어지는 상황이 발생합니다.

### Write-Through 패턴

데이터를 업데이트할 때 캐시도 함께 갱신하는 방식입니다.

```java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CacheManager cacheManager;

    @Transactional
    public Product updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow();

        product.updateInfo(request);
        Product saved = productRepository.save(product);

        // 캐시 갱신
        Cache cache = cacheManager.getCache("products");
        if (cache != null) {
            cache.put(id, saved);
        }

        return saved;
    }
}
```

장점은 즉시 최신 데이터가 반영된다는 것, 단점은 쓰기 작업마다 캐시 갱신 오버헤드가 발생한다는 점입니다.

### Write-Invalidate 패턴

업데이트 시 캐시를 아예 제거하고, 다음 조회 때 다시 로딩하는 방식입니다.

```java
@Service
public class ProductService {

    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public Product updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow();

        product.updateInfo(request);
        return productRepository.save(product);
    }
}
```

구현이 간단하고, 쓰기 성능에 영향이 적습니다. 대신 다음 조회 시 캐시 미스가 발생하므로 첫 조회는 느릴 수 있습니다.

### 연관 캐시 무효화

하나의 데이터가 여러 캐시에 영향을 주는 경우도 있습니다. 예를 들어, 카테고리 정보를 변경하면 그 카테고리에 속한 상품 목록 캐시도 무효화해야 합니다.

```java
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CacheManager cacheManager;

    @CacheEvict(value = "categories", key = "#id")
    @Transactional
    public Category updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow();

        category.update(request);
        Category saved = categoryRepository.save(category);

        // 연관된 상품 목록 캐시도 무효화
        Cache productCache = cacheManager.getCache("products");
        if (productCache != null) {
            productCache.clear();  // 전체 삭제
            // 또는 카테고리별 삭제: productCache.evict("category:" + id);
        }

        return saved;
    }
}
```

이런 경우 Spring의 `@Caching` 애노테이션으로 여러 캐시를 한 번에 제어할 수도 있습니다.

```java
@Caching(evict = {
    @CacheEvict(value = "categories", key = "#id"),
    @CacheEvict(value = "categoryProducts", key = "#id")
})
public Category updateCategory(Long id, CategoryUpdateRequest request) {
    // ...
}
```

### 스케줄 기반 전체 캐시 갱신

변경이 거의 없지만, 주기적으로 전체를 갱신해야 하는 데이터도 있습니다. 메뉴 구조나 공통 코드 같은 것들이죠.

```java
@Component
@RequiredArgsConstructor
public class CacheRefreshScheduler {

    private final CacheManager cacheManager;

    @Scheduled(cron = "0 0 3 * * ?")  // 매일 새벽 3시
    public void refreshCommonCodes() {
        Cache cache = cacheManager.getCache("commonCodes");
        if (cache != null) {
            cache.clear();
        }

        log.info("Common code cache cleared at {}", LocalDateTime.now());
    }
}
```

## 성능 모니터링과 튜닝

캐시를 적용하고 나면, 정말 효과가 있는지 확인해야 합니다. Caffeine은 이를 위한 통계 기능을 제공합니다.

### 통계 수집 활성화

먼저 캐시 빌더에서 통계 수집을 활성화합니다.

```java
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(1, TimeUnit.HOURS)
            .recordStats()  // 통계 활성화
        );
        return cacheManager;
    }
}
```

### 캐시 통계 조회

애플리케이션 실행 중에 통계를 확인할 수 있습니다.

```java
@RestController
@RequiredArgsConstructor
public class CacheStatsController {

    private final CacheManager cacheManager;

    @GetMapping("/admin/cache/stats")
    public Map<String, CacheStats> getCacheStats() {
        Map<String, CacheStats> stats = new HashMap<>();

        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache instanceof CaffeineCache) {
                com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache =
                    ((CaffeineCache) cache).getNativeCache();

                CacheStats cacheStats = nativeCache.stats();
                stats.put(cacheName, cacheStats);
            }
        });

        return stats;
    }
}
```

반환되는 통계 항목은 다음과 같습니다:

- **hitRate**: 캐시 히트율 (높을수록 좋음, 0.8 이상이면 양호)
- **missRate**: 캐시 미스율
- **loadCount**: 데이터 로딩 횟수
- **evictionCount**: 제거된 항목 수

### 실전 모니터링 팁

실무에서는 이 통계를 Prometheus나 Micrometer로 수집해 Grafana 대시보드로 시각화하는 게 일반적입니다.

```java
@Configuration
public class CacheMetricsConfig {

    @Bean
    public MeterBinder caffeineMetrics(CacheManager cacheManager) {
        return binder -> cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache instanceof CaffeineCache) {
                CaffeineCacheMetrics.monitor(
                    binder,
                    ((CaffeineCache) cache).getNativeCache(),
                    cacheName
                );
            }
        });
    }
}
```

히트율이 60% 이하로 떨어지면, 캐시 크기를 늘리거나 TTL을 조정하는 것을 고려해야 합니다.

## 주의사항과 베스트 프랙티스

마지막으로, 실무에서 Caffeine 캐시를 운영하며 자주 마주치는 함정들을 정리해봤습니다.

### 1. 캐시 키 설계는 신중하게

잘못된 키 설계는 캐시 효율을 급격히 떨어뜨립니다.

```java
// ❌ 나쁜 예: toString()이 매번 다른 값 반환
@Cacheable(key = "#request.toString()")
public List<Product> search(SearchRequest request) { }

// ⭕ 좋은 예: 명확한 필드 조합
@Cacheable(key = "#request.category + ':' + #request.keyword")
public List<Product> search(SearchRequest request) { }
```

### 2. Null 값 처리

기본적으로 Spring Cache는 null을 캐시하지 않습니다. 하지만 "존재하지 않는 값도"도 캐시하고 싶다면

```java
// null도 캐시
@Cacheable(value = "users", key = "#id", unless = "false")
public User findUser(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

또는 Optional을 사용하는 방법도 있습니다.

```java
@Cacheable(value = "users", key = "#id")
public Optional<User> findUser(Long id) {
    return userRepository.findById(id);
}
```

### 3. 직렬화 가능한 객체 사용

Caffeine은 인메모리 캐시라 직렬화가 필수는 아니지만, 향후 Redis로 마이그레이션할 가능성을 고려하면 Serializable을 구현해두는 게 좋습니다.

```java
@Entity
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;
    // ...
}
```

### 4. 캐시 크기 산정

"얼마나 큰 캐시가 필요할까?"라는 질문도 중요합니다.

- **Small (< 1,000)**: 공통 코드, 설정값
- **Medium (1,000 ~ 10,000)**: 카테고리, 메뉴 구조
- **Large (10,000 ~ 100,000)**: 상품, 사용자 정보
- **Very Large (> 100,000)**: Redis 검토 권장

Java 객체는 생각보다 메모리를 많이 차지합니다. 10만 개의 객체를 캐시하면 수백 MB가 순식간에 사라질 수 있으니, 실제 운영 전 메모리 사용량을 모니터링하세요.

### 5. 프로덕션 체크리스트

실제 배포 전 확인할 사항들입니다.

- [ ] 캐시별로 적절한 maximumSize 설정
- [ ] TTL이 비즈니스 요구사항과 일치하는지 확인
- [ ] recordStats() 활성화 및 모니터링 대시보드 구성
- [ ] 캐시 무효화 로직이 데이터 정합성을 해치지 않는지 검증
- [ ] 메모리 사용량 프로파일링
- [ ] 동시성 테스트 (멀티스레드 환경에서 안전한지)

---

여기까지 Spring Boot에서 Caffeine 캐시를 도입하고 운영하는 전체 과정을 살펴봤습니다. Window TinyLfu 알고리즘이라는 정교한 내부 메커니즘부터, 실제 프로젝트에 적용할 수 있는 패턴들까지 함께 정리했습니다.

캐시는 단순히 "빠르게 만들려고" 도입하는 게 아니라, **언제 무효화할지, 얼마나 유지할지, 어떻게 모니터링할지**까지 함께 고민해야 제대로 효과를 볼 수 있습니다. 처음에는 간단한 `@Cacheable` 애노테이션으로 시작하되, 점차 캐시 전략을 정교하게 다듬어가는 접근이 현실적입니다.


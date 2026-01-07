---
title: "Building Production-Ready Spring Boot Applications with Kotlin"
description: "Learn how to design maintainable and performant Spring Boot services using Kotlin, covering architecture, testing, and deployment best practices."
date: 2026-01-06
category: backend
tags:
  - spring-boot
  - kotlin
  - architecture
  - best-practices
draft: false
featured: true
author: 0xmiles
---

# Building Production-Ready Spring Boot Applications with Kotlin

Spring Boot and Kotlin make an excellent combination for building modern backend services. In this comprehensive guide, I'll share the patterns and practices I use when building production systems.

## Why Kotlin for Spring Boot?

Before diving into the details, let's quickly cover why Kotlin is a great choice:

1. **Null Safety**: Compile-time null safety eliminates NPEs
2. **Conciseness**: Less boilerplate compared to Java
3. **Coroutines**: First-class support for asynchronous programming
4. **Data Classes**: Perfect for DTOs and entities
5. **Extension Functions**: Clean, readable code organization

## Project Setup

### build.gradle.kts

```kotlin
plugins {
    id("org.springframework.boot") version "3.4.0"
    id("io.spring.dependency-management") version "1.1.4"
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
    kotlin("plugin.jpa") version "1.9.22"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    
    runtimeOnly("org.postgresql:postgresql")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.kotest:kotest-runner-junit5:5.8.0")
}
```

## Architecture Pattern

I follow a clean architecture approach with these layers:

```
├── controller/     # HTTP endpoints
├── service/        # Business logic
├── repository/     # Data access
├── domain/         # Entities and value objects
├── dto/            # Data transfer objects
└── config/         # Configuration classes
```

## Domain Model Example

```kotlin
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(nullable = false, unique = true)
    val email: String,
    
    @Column(nullable = false)
    val name: String,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
```

## Repository Layer

```kotlin
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
    
    @Query("SELECT u FROM User u WHERE u.createdAt > :since")
    fun findRecentUsers(@Param("since") since: LocalDateTime): List<User>
}
```

## Service Layer with Business Logic

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val emailService: EmailService
) {
    @Transactional(readOnly = true)
    fun findUser(id: Long): UserDto {
        val user = userRepository.findById(id)
            .orElseThrow { NotFoundException("User not found: $id") }
        return user.toDto()
    }
    
    @Transactional
    fun createUser(request: CreateUserRequest): UserDto {
        // Validation
        if (userRepository.findByEmail(request.email) != null) {
            throw ConflictException("Email already exists")
        }
        
        // Create entity
        val user = User(
            email = request.email,
            name = request.name
        )
        
        // Save to database
        val savedUser = userRepository.save(user)
        
        // Send welcome email (async)
        emailService.sendWelcomeEmail(savedUser.email)
        
        return savedUser.toDto()
    }
}

// Extension function for mapping
private fun User.toDto() = UserDto(
    id = id!!,
    email = email,
    name = name,
    createdAt = createdAt
)
```

## Controller Layer

```kotlin
@RestController
@RequestMapping("/api/v1/users")
class UserController(
    private val userService: UserService
) {
    @GetMapping("/{id}")
    fun getUser(@PathVariable id: Long): ResponseEntity<UserDto> {
        val user = userService.findUser(id)
        return ResponseEntity.ok(user)
    }
    
    @PostMapping
    fun createUser(
        @Valid @RequestBody request: CreateUserRequest
    ): ResponseEntity<UserDto> {
        val user = userService.createUser(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(user)
    }
}
```

## DTOs with Validation

```kotlin
data class CreateUserRequest(
    @field:Email(message = "Invalid email format")
    @field:NotBlank(message = "Email is required")
    val email: String,
    
    @field:NotBlank(message = "Name is required")
    @field:Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    val name: String
)

data class UserDto(
    val id: Long,
    val email: String,
    val name: String,
    val createdAt: LocalDateTime
)
```

## Error Handling

```kotlin
@RestControllerAdvice
class GlobalExceptionHandler {
    
    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(
                message = ex.message ?: "Resource not found",
                timestamp = LocalDateTime.now()
            ))
    }
    
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationErrors(
        ex: MethodArgumentNotValidException
    ): ResponseEntity<ValidationErrorResponse> {
        val errors = ex.bindingResult.fieldErrors.associate { 
            it.field to (it.defaultMessage ?: "Invalid value")
        }
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ValidationErrorResponse(
                message = "Validation failed",
                errors = errors,
                timestamp = LocalDateTime.now()
            ))
    }
}

data class ErrorResponse(
    val message: String,
    val timestamp: LocalDateTime
)

data class ValidationErrorResponse(
    val message: String,
    val errors: Map<String, String>,
    val timestamp: LocalDateTime
)
```

## Testing with JUnit 5 and Kotest

```kotlin
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    
    @Autowired
    private lateinit var mockMvc: MockMvc
    
    @Autowired
    private lateinit var userRepository: UserRepository
    
    @Autowired
    private lateinit var objectMapper: ObjectMapper
    
    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
    }
    
    @Test
    fun `사용자 생성 API는 유효한 요청으로 201을 반환해야 한다`() {
        // Given
        val request = CreateUserRequest(
            email = "test@example.com",
            name = "Test User"
        )
        
        // When & Then
        mockMvc.perform(
            post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.id").exists())
    }
    
    @Test
    fun `사용자 생성 API는 중복된 이메일로 409를 반환해야 한다`() {
        // Given
        userRepository.save(User(
            email = "test@example.com",
            name = "Existing User"
        ))
        
        val request = CreateUserRequest(
            email = "test@example.com",
            name = "New User"
        )
        
        // When & Then
        mockMvc.perform(
            post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isConflict)
    }
}
```

## Performance Considerations

### 1. Use Appropriate Fetch Strategies

```kotlin
@Entity
class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @OneToMany(
        mappedBy = "order",
        fetch = FetchType.LAZY,  // Lazy by default
        cascade = [CascadeType.ALL]
    )
    val items: MutableList<OrderItem> = mutableListOf()
)
```

### 2. Use Projections for Read Operations

```kotlin
interface UserProjection {
    val id: Long
    val email: String
    val name: String
}

interface UserRepository : JpaRepository<User, Long> {
    fun findProjectedById(id: Long): UserProjection?
}
```

### 3. Batch Operations

```kotlin
@Transactional
fun createUsers(requests: List<CreateUserRequest>): List<UserDto> {
    val users = requests.map { request ->
        User(email = request.email, name = request.name)
    }
    
    return userRepository.saveAll(users).map { it.toDto() }
}
```

## Configuration

```kotlin
@Configuration
class DatabaseConfig {
    
    @Bean
    fun objectMapper(): ObjectMapper {
        return Jackson2ObjectMapperBuilder()
            .modules(KotlinModule.Builder().build())
            .featuresToDisable(
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
            )
            .build()
    }
}
```

## Key Takeaways

1. **Leverage Kotlin features**: Use data classes, null safety, and extension functions
2. **Follow clean architecture**: Separate concerns across layers
3. **Write comprehensive tests**: Cover all edge cases and scenarios
4. **Handle errors gracefully**: Provide meaningful error messages
5. **Optimize performance**: Use projections, lazy loading, and batch operations
6. **Validate input**: Use Bean Validation annotations
7. **Use transactions wisely**: Mark read-only operations appropriately

## Next Steps

In the next post, I'll cover:
- Implementing asynchronous processing with Kotlin Coroutines
- API versioning strategies
- Monitoring and observability with Micrometer
- Deployment to Kubernetes

Stay tuned!


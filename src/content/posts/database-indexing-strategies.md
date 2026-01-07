---
title: "PostgreSQL Indexing Strategies for High-Performance Applications"
description: "A comprehensive guide to understanding and implementing effective database indexing strategies in PostgreSQL for optimal query performance."
date: 2026-01-05
category: database
tags:
  - postgresql
  - database
  - performance
  - indexing
draft: false
featured: true
author: 0xmiles
---

# PostgreSQL Indexing Strategies

Proper indexing is one of the most effective ways to improve database performance. In this article, I'll share practical indexing strategies I've used in production systems.

## Understanding Index Types

PostgreSQL supports several index types. Choosing the right one is crucial for performance.

### 1. B-Tree Indexes (Default)

Best for equality and range queries:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

Use cases:
- Primary keys
- Foreign keys
- Columns used in WHERE, ORDER BY, JOIN

### 2. Hash Indexes

Optimized for equality comparisons:

```sql
CREATE INDEX idx_users_email_hash ON users USING HASH(email);
```

**Note**: Generally, B-Tree indexes are preferred as they're more versatile.

### 3. GIN Indexes (Generalized Inverted Index)

Perfect for full-text search and array operations:

```sql
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_articles_content ON articles USING GIN(to_tsvector('english', content));
```

### 4. GiST Indexes (Generalized Search Tree)

For geometric data and full-text search:

```sql
CREATE INDEX idx_locations_point ON locations USING GIST(coordinates);
```

## Composite Indexes

When queries filter on multiple columns, composite indexes are powerful:

```sql
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

**Column order matters!** The most selective column should come first.

### Example Query

```sql
-- This query benefits from the composite index
SELECT * FROM orders 
WHERE user_id = 123 AND status = 'pending';

-- This query only uses the first column of the index
SELECT * FROM orders WHERE user_id = 123;

-- This query CANNOT use the index efficiently
SELECT * FROM orders WHERE status = 'pending';
```

## Partial Indexes

Index only the rows you need:

```sql
-- Only index active users
CREATE INDEX idx_active_users ON users(email) 
WHERE status = 'active';

-- Only index recent orders
CREATE INDEX idx_recent_orders ON orders(created_at) 
WHERE created_at > '2025-01-01';
```

**Benefits**:
- Smaller index size
- Faster index updates
- Better cache hit ratio

## Covering Indexes

Include additional columns to avoid table lookups:

```sql
CREATE INDEX idx_orders_user_covering ON orders(user_id) 
INCLUDE (created_at, total_amount, status);
```

Query that benefits:

```sql
-- No table lookup needed - all data is in the index
SELECT order_id, created_at, total_amount, status 
FROM orders 
WHERE user_id = 123;
```

## Index Maintenance

### Monitor Index Usage

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Find Unused Indexes

```sql
SELECT 
    schemaname || '.' || tablename AS table,
    indexname AS index,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Reindex When Needed

```sql
REINDEX INDEX idx_users_email;
REINDEX TABLE users;
```

## Real-World Examples

### Example 1: E-commerce Order Search

**Query**:
```sql
SELECT * FROM orders 
WHERE user_id = ? 
    AND status = 'pending' 
    AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

**Optimal Index**:
```sql
CREATE INDEX idx_orders_search ON orders(user_id, status, created_at DESC)
WHERE status = 'pending' AND created_at > NOW() - INTERVAL '90 days';
```

### Example 2: Full-Text Search

**Query**:
```sql
SELECT * FROM articles 
WHERE to_tsvector('english', title || ' ' || content) 
    @@ to_tsquery('english', 'postgresql & performance');
```

**Optimal Index**:
```sql
-- Add a generated column
ALTER TABLE articles 
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || content)
) STORED;

-- Index it
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);
```

## Performance Tips

### 1. Don't Over-Index

❌ **Bad**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_email_name ON users(email, name);
```

✅ **Good**:
```sql
CREATE INDEX idx_users_email_name ON users(email, name);
-- This serves both single-column and composite queries
```

### 2. Consider Write Performance

Every index slows down INSERT, UPDATE, DELETE operations. Balance read vs. write performance.

### 3. Use EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 123;
```

Look for:
- Seq Scan → needs index
- Index Scan → good
- Bitmap Index Scan → consider better index

### 4. Fill Factor for High-Update Tables

```sql
CREATE INDEX idx_orders_user ON orders(user_id)
WITH (fillfactor = 70);
```

Leaves space for updates, reducing page splits.

## Common Mistakes to Avoid

### Mistake 1: Function-Based Columns Without Expression Index

❌ **Bad**:
```sql
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
-- Index on 'email' won't be used
```

✅ **Good**:
```sql
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
```

### Mistake 2: Leading Wildcards in LIKE

❌ **Bad**:
```sql
SELECT * FROM users WHERE email LIKE '%@gmail.com';
-- Index cannot be used
```

✅ **Good**:
```sql
SELECT * FROM users WHERE email LIKE 'john%';
-- Index can be used
```

### Mistake 3: Implicit Type Conversions

❌ **Bad**:
```sql
SELECT * FROM orders WHERE user_id = '123';
-- If user_id is integer, index may not be used efficiently
```

✅ **Good**:
```sql
SELECT * FROM orders WHERE user_id = 123;
```

## Monitoring Query Performance

### Find Slow Queries

```sql
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Check Index Bloat

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Conclusion

Effective indexing is both an art and a science:

1. **Understand your queries** - analyze actual usage patterns
2. **Choose the right index type** - B-Tree for most cases, GIN for arrays/full-text
3. **Use composite indexes wisely** - order columns by selectivity
4. **Consider partial indexes** - for frequently filtered subsets
5. **Monitor and maintain** - remove unused indexes, reindex when needed
6. **Balance read vs. write** - every index has a cost

Remember: **Measure, don't guess!** Always use EXPLAIN ANALYZE to verify your indexing decisions.

Happy querying! 🚀


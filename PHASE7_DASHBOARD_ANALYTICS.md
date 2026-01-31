# Phase 7: Dashboard & Analytics - COMPLETED ✅

Dashboard dan analytics system untuk monitoring platform dan tenant performance.

---

## Components Created

### 1. Analytics Collection (`analytics`)

**Location:** `src/collections/analytics/Analytics/index.ts`
**Group:** Analytics

Event tracking collection untuk monitoring user activity.

**Fields:**

- `tenant` - Relationship to tenants
- `event` - Event type (page_view, document_download, service_access, news_view, search, contact_submit)
- `metadata` - Event metadata (path, referrer, userAgent, ip, resourceId, searchQuery)
- `sessionId` - Session identifier

**Access:**

- Create: Public (auto-created by system)
- Read: Super Admin only
- Update: Disabled
- Delete: Super Admin only

**Use Case:** Track user behavior, popular content, search queries

---

### 2. SuperAdminDashboard Global

**Location:** `src/globals/SuperAdminDashboard.ts`
**Group:** Analytics

Platform-wide statistics untuk super admin.

**Real-time Stats:**

- `totalTenants` - Total registered tenants
- `activeTenants` - Active tenants (active/trial status)
- `totalRevenue` - All-time revenue
- `monthlyRevenue` - Current month revenue

**Analytics:**

- `tenantsByType` - Breakdown by tenant type (provinsi, kabupaten, opd, dpr, desa)
- `subscriptionStats` - Subscription plan distribution & revenue
- `recentActivity` - Recent platform activity

**Features:**

- Auto-calculated via `beforeRead` hook
- No manual updates needed
- Real-time data

---

### 3. TenantDashboard Global

**Location:** `src/globals/TenantDashboard.ts`
**Group:** Analytics

Per-tenant website statistics.

**Website Stats:**

- `totalPageViews` - All-time page views
- `monthlyPageViews` - Current month page views
- `totalNews` - Total news articles
- `totalServices` - Total services
- `totalDocuments` - Total documents

**Subscription Info:**

- `plan` - Current subscription plan
- `status` - Subscription status
- `nextBillingDate` - Next billing date
- `daysRemaining` - Days until renewal

**Analytics:**

- `popularContent` - Most viewed content
- `recentActivity` - Recent content updates

**Features:**

- Tenant-specific data only
- Auto-calculated per user's tenant
- Subscription tracking

---

## Utilities

### Analytics Utilities (`src/utilities/analytics.ts`)

#### `trackEvent(event: AnalyticsEvent)`

Track analytics event.

```typescript
await trackEvent({
  tenant: tenantId,
  event: 'page_view',
  metadata: {
    path: '/berita/article-1',
    referrer: 'https://google.com',
  },
  sessionId: 'session-123',
})
```

#### `getTenantAnalytics(tenantId, startDate?, endDate?)`

Get analytics for specific tenant with optional date range.

#### `getPopularContent(tenantId, limit)`

Get most viewed content.

```typescript
const popular = await getPopularContent(tenantId, 10)
// Returns: [{ resourceId, type, views }]
```

#### `getAnalyticsSummary(tenantId)`

Get analytics summary (all-time, this month, this week).

```typescript
const summary = await getAnalyticsSummary(tenantId)
// Returns: { allTime, thisMonth, thisWeek }
```

#### `getRevenueAnalytics(startDate?, endDate?)`

Get revenue analytics with monthly breakdown.

```typescript
const revenue = await getRevenueAnalytics()
// Returns: { totalRevenue, totalTransactions, averageTransaction, byMonth }
```

---

## API Endpoints

### 1. Track Event (`POST /api/analytics/track`)

**Location:** `src/endpoints/analytics/track.ts`

Track analytics event from frontend.

**Request:**

```json
{
  "tenant": "tenant-id",
  "event": "page_view",
  "metadata": {
    "path": "/berita/article-1",
    "resourceId": "article-1"
  },
  "sessionId": "session-123"
}
```

**Response:**

```json
{
  "success": true
}
```

**Features:**

- Auto-captures userAgent & IP
- No authentication required
- Fail-safe (doesn't break app on error)

---

### 2. Get Stats (`GET /api/analytics/stats/:tenantId`)

**Location:** `src/endpoints/analytics/stats.ts`

Get analytics stats for tenant.

**Access Control:**

- Super admin: Can access any tenant
- Tenant user: Can only access own tenant

**Response:**

```json
{
  "summary": {
    "allTime": { "total": 1000, "byEvent": {...} },
    "thisMonth": { "total": 150, "byEvent": {...} },
    "thisWeek": { "total": 50, "byEvent": {...} }
  },
  "popularContent": [
    { "resourceId": "article-1", "type": "news_view", "views": 100 }
  ]
}
```

---

## Frontend Integration

### Track Page Views

```typescript
// In layout or page component
'use client'

import { useEffect } from 'react'
import { useTenant } from '@/providers/TenantProvider'

export function PageViewTracker() {
  const { tenant } = useTenant()

  useEffect(() => {
    if (!tenant) return

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant: tenant.id,
        event: 'page_view',
        metadata: {
          path: window.location.pathname,
          referrer: document.referrer,
        },
        sessionId: getSessionId(), // Implement session tracking
      }),
    })
  }, [tenant])

  return null
}
```

### Track Document Downloads

```typescript
async function handleDownload(documentId: string) {
  // Trigger download
  window.open(documentUrl, '_blank')

  // Track event
  await fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant: tenantId,
      event: 'document_download',
      metadata: {
        resourceId: documentId,
      },
    }),
  })
}
```

### Track Search

```typescript
async function handleSearch(query: string) {
  await fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant: tenantId,
      event: 'search',
      metadata: {
        searchQuery: query,
      },
    }),
  })
}
```

---

## Dashboard Views

### Super Admin Dashboard

Access via Payload Admin: **Globals → Super Admin Dashboard**

**Displays:**

- Total tenants & active tenants
- Revenue metrics (total & monthly)
- Tenants by type (chart)
- Subscription plan distribution
- Recent activity log

**Use Cases:**

- Monitor platform growth
- Track revenue
- Identify popular tenant types
- Subscription analytics

---

### Tenant Dashboard

Access via Payload Admin: **Globals → Tenant Dashboard**

**Displays:**

- Website statistics (page views, content counts)
- Subscription info (plan, status, days remaining)
- Popular content (most viewed)
- Recent activity

**Use Cases:**

- Monitor website traffic
- Track content performance
- Subscription status
- Content engagement

---

## Custom Dashboard Components (Future)

### React Admin Dashboard

```typescript
// src/app/(admin)/dashboard/page.tsx
import { getDashboardStats } from '@/utilities/analytics'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard title="Total Tenants" value={stats.totalTenants} />
      <StatCard title="Active Tenants" value={stats.activeTenants} />
      <StatCard title="Monthly Revenue" value={stats.monthlyRevenue} />
      <StatCard title="Total Revenue" value={stats.totalRevenue} />

      <Chart data={stats.tenantsByType} />
      <RecentActivity activities={stats.recentActivity} />
    </div>
  )
}
```

### Charts Integration

```typescript
// Using Chart.js or Recharts
import { Line, Bar, Pie } from 'recharts'

<Line
  data={revenueByMonth}
  xDataKey="month"
  yDataKey="revenue"
/>

<Bar
  data={tenantsByType}
  xDataKey="type"
  yDataKey="count"
/>

<Pie
  data={subscriptionStats}
  dataKey="count"
  nameKey="plan"
/>
```

---

## Reports Generation

### Monthly Report

```typescript
export async function generateMonthlyReport(month: string, year: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const [revenue, tenants, analytics] = await Promise.all([
    getRevenueAnalytics(startDate, endDate),
    getTenantGrowth(startDate, endDate),
    getAnalyticsSummary(startDate, endDate),
  ])

  return {
    period: `${year}-${month}`,
    revenue,
    tenants,
    analytics,
  }
}
```

### Export to CSV

```typescript
export function exportToCSV(data: any[], filename: string) {
  const csv = convertToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
```

---

## Performance Considerations

### Indexing

Analytics collection has indexes on:

- `tenant` - For fast tenant-specific queries
- `event` - For event type filtering
- `sessionId` - For session tracking

### Data Retention

Consider implementing data retention policy:

```typescript
// Cron job to delete old analytics
export async function cleanupOldAnalytics() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  await payload.delete({
    collection: 'analytics',
    where: {
      createdAt: {
        less_than: sixMonthsAgo.toISOString(),
      },
    },
  })
}
```

### Caching

Cache dashboard stats:

```typescript
import { cache } from 'react'

export const getCachedDashboardStats = cache(async () => {
  return getDashboardStats()
})
```

---

## Security

### Access Control

- Analytics collection: Super admin only
- SuperAdminDashboard: Super admin only
- TenantDashboard: Authenticated users (own tenant)
- Track endpoint: Public (for frontend tracking)
- Stats endpoint: Authenticated (with tenant check)

### Rate Limiting

Consider implementing rate limiting for track endpoint:

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
})

app.use('/api/analytics/track', limiter)
```

---

## Phase 7 Status: ✅ COMPLETED

**Files Created:** 7

- ✅ Analytics collection
- ✅ SuperAdminDashboard global
- ✅ TenantDashboard global
- ✅ Analytics utilities
- ✅ Track endpoint
- ✅ Stats endpoint
- ✅ Endpoints index

**Features:**

- ✅ Event tracking (page views, downloads, searches)
- ✅ Real-time dashboard stats
- ✅ Revenue analytics
- ✅ Popular content tracking
- ✅ Subscription monitoring
- ✅ Tenant growth metrics

**Total Collections:** 29

- Phase 1: 2 (Multi-Tenant)
- Phase 2: 4 (Billing)
- Phase 3: 8 (SPBE Common)
- Phase 4: 8 (Government Specific)
- Phase 5: 2 (Template System)
- Phase 7: 1 (Analytics)
- Core: 4 (Pages, Posts, Media, Categories)

**Total Globals:** 4

- Header, Footer
- SuperAdminDashboard, TenantDashboard

**🎉 COMPLETE MULTI-TENANT PLATFORM WITH ANALYTICS!**

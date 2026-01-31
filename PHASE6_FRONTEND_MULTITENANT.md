# Phase 6: Frontend Multi-Tenant - COMPLETED ✅

Frontend implementation untuk multi-tenant system dengan dynamic routing, theme customization, dan component library.

---

## Architecture Overview

### Routing Strategy: Path-based

```
URL Pattern: /t/[slug]/...

Examples:
- /t/desa-xyz → Homepage Desa XYZ
- /t/opd-kesehatan → Homepage OPD Kesehatan
- /t/dprd-papua → Homepage DPRD Papua
```

**Why Path-based?**

- ✅ Easier setup (no DNS configuration)
- ✅ Works on localhost
- ✅ Better for development
- ✅ Can switch to subdomain later

**Alternative: Subdomain-based**

```
desa-xyz.egovpapua.com
opd-kesehatan.egovpapua.com
dprd-papua.egovpapua.com
```

---

## Files Created

### 1. Tenant Provider (`src/providers/TenantProvider.tsx`)

React Context untuk menyediakan tenant dan theme settings di seluruh aplikasi.

**Usage:**

```typescript
import { useTenant } from '@/providers/TenantProvider'

function MyComponent() {
  const { tenant, themeSettings, isLoading } = useTenant()

  return <div>{tenant?.name}</div>
}
```

**Features:**

- Type-safe dengan TypeScript
- Auto-typed dari Payload types
- Client component

---

### 2. Tenant Utilities (`src/utilities/tenant.ts`)

Helper functions untuk tenant operations.

**Functions:**

#### `getTenantBySlug(slug: string)`

Get tenant by slug.

#### `getTenantBySubdomain(subdomain: string)`

Get tenant by subdomain (for future subdomain routing).

#### `getThemeSettings(tenantId: string | number)`

Get theme settings dengan depth 2 (include template & media).

#### `getTenantWithTheme(slug: string)`

Get tenant + theme settings sekaligus.

#### `extractTenantSlug(hostname, pathname, mode)`

Extract tenant slug dari URL (support path & subdomain mode).

#### `isTenantActive(tenant: Tenant)`

Check apakah tenant active (status: active atau trial).

#### `getTenantBaseUrl(tenant, mode, baseUrl)`

Generate base URL untuk tenant.

---

### 3. Tenant Layout (`src/app/(frontend)/t/[slug]/layout.tsx`)

Layout wrapper untuk semua tenant pages.

**Features:**

- Get tenant & theme settings
- Check tenant active status
- Provide TenantProvider
- Apply theme dengan ThemeApplier
- Render Header & Footer

**Inactive Tenant Handling:**

```typescript
if (!isTenantActive(tenant)) {
  return <SuspendedMessage />
}
```

---

### 4. Tenant Homepage (`src/app/(frontend)/t/[slug]/page.tsx`)

Homepage untuk tenant dengan dynamic content.

**Features:**

- Dynamic metadata (SEO)
- Hero section
- Latest news (6 items)
- Services (6 items)
- Agenda (5 items)
- Dynamic sections berdasarkan theme settings

**Metadata:**

```typescript
export async function generateMetadata({ params }) {
  const { tenant, themeSettings } = await getTenantWithTheme(params.slug)

  return {
    title: themeSettings?.seo?.metaTitle || tenant.name,
    description: themeSettings?.seo?.metaDescription,
    openGraph: { ... },
  }
}
```

---

### 5. Theme Applier (`src/components/tenant/ThemeApplier.tsx`)

Client component untuk apply theme settings ke DOM.

**What it does:**

1. Apply colors to CSS variables
2. Apply fonts (heading & body)
3. Apply font size
4. Inject custom CSS
5. Execute custom JS (with caution)

**CSS Variables:**

```css
--color-primary
--color-secondary
--color-accent
--color-background
--color-text
--font-heading
--font-body
--font-size-base
```

**Usage in Components:**

```tsx
<div style={{ color: 'var(--color-primary)' }}>Primary colored text</div>
```

---

### 6. Tenant Header (`src/components/tenant/TenantHeader.tsx`)

Header component dengan:

- Logo (dari theme settings)
- Navigation menu
- Search bar (conditional)
- Mobile menu button
- Sticky header (conditional)

**Responsive:**

- Desktop: Full navigation + search
- Mobile: Hamburger menu

---

### 7. Tenant Footer (`src/components/tenant/TenantFooter.tsx`)

Footer component dengan:

- About section (tenant name & address)
- Quick links
- Contact info
- Social media icons (conditional)
- Copyright text (customizable)

**Layout:** 4-column grid (responsive)

---

### 8. Tenant Hero (`src/components/tenant/TenantHero.tsx`)

Hero section dengan support:

- Slider (multiple images)
- Single image
- Video (future)
- Minimal (text only)

**Features:**

- Overlay dengan title & subtitle
- Responsive
- Smooth transitions

---

### 9. Tenant Sections (`src/components/tenant/TenantSections.tsx`)

Dynamic sections renderer.

**Supported Sections:**

- **News** - Latest news grid
- **Services** - Service cards
- **Agenda** - Upcoming events list
- **Statistics** (future)
- **Gallery** (future)
- **Quick Links** (future)
- **Contact** (future)

**Order Control:**
Sections rendered berdasarkan `themeSettings.homepage.sections` array order.

---

## Data Flow

### 1. Request Flow:

```
User visits /t/desa-xyz
  ↓
Layout: getTenantWithTheme('desa-xyz')
  ↓
Check tenant active status
  ↓
Provide TenantProvider
  ↓
Apply ThemeApplier
  ↓
Render Header + Page + Footer
```

### 2. Theme Application:

```
ThemeApplier useEffect
  ↓
Read themeSettings
  ↓
Set CSS variables
  ↓
Inject custom CSS
  ↓
Execute custom JS
  ↓
Components use CSS variables
```

### 3. Component Data Access:

```
Component
  ↓
useTenant() hook
  ↓
Get tenant & themeSettings from context
  ↓
Render with theme
```

---

## Styling System

### CSS Variables Approach

**Benefits:**

- ✅ Dynamic theming
- ✅ No CSS-in-JS overhead
- ✅ Works with Tailwind
- ✅ Easy to override

**Example:**

```css
/* Global styles */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

/* Component */
<button className="btn-primary">
  Click me
</button>
```

### Tailwind + CSS Variables

```tsx
<div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
  Content
</div>
```

---

## Additional Pages (To Implement)

### News Pages:

```
/t/[slug]/berita → News list
/t/[slug]/berita/[newsSlug] → News detail
```

### Service Pages:

```
/t/[slug]/layanan → Services list
/t/[slug]/layanan/[serviceSlug] → Service detail
```

### Profile Pages:

```
/t/[slug]/profil → Profile/About
/t/[slug]/profil/visi-misi → Vision & Mission
/t/[slug]/profil/struktur → Organization structure
```

### Document Pages:

```
/t/[slug]/dokumen → Documents list
/t/[slug]/dokumen/[docId] → Document detail
```

### Implementation Template:

```typescript
// src/app/(frontend)/t/[slug]/berita/page.tsx
export default async function NewsListPage({ params }) {
  const { slug } = await params
  const { tenant } = await getTenantWithTheme(slug)

  const payload = await getPayload({ config: configPromise })
  const news = await payload.find({
    collection: 'berita',
    where: { tenant: { equals: tenant.id } },
  })

  return <NewsListComponent news={news.docs} />
}
```

---

## SEO Implementation

### Dynamic Metadata:

```typescript
export async function generateMetadata({ params }) {
  const { tenant, themeSettings } = await getTenantWithTheme(params.slug)

  return {
    title: themeSettings?.seo?.metaTitle,
    description: themeSettings?.seo?.metaDescription,
    openGraph: {
      title: themeSettings?.seo?.metaTitle,
      description: themeSettings?.seo?.metaDescription,
      images: [themeSettings?.seo?.metaImage],
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}
```

### Google Analytics:

```typescript
// In layout or root
{themeSettings?.seo?.googleAnalyticsId && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${themeSettings.seo.googleAnalyticsId}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${themeSettings.seo.googleAnalyticsId}');
      `}
    </Script>
  </>
)}
```

---

## Performance Optimization

### 1. Static Generation:

```typescript
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const tenants = await payload.find({
    collection: 'tenants',
    limit: 1000,
  })

  return tenants.docs.map((tenant) => ({
    slug: tenant.slug,
  }))
}
```

### 2. Image Optimization:

```typescript
<Image
  src={imageUrl}
  alt={alt}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 3. Caching:

```typescript
// In utilities/tenant.ts
import { cache } from 'react'

export const getTenantBySlug = cache(async (slug: string) => {
  // ... implementation
})
```

---

## Security Considerations

### Custom JS Execution:

```typescript
// Only for premium plans
if (tenant.subscription?.plan?.isPremium && themeSettings.customJS) {
  // Execute with restrictions
  // Consider using iframe sandbox
}
```

### CSS Sanitization:

```typescript
import DOMPurify from 'isomorphic-dompurify'

const sanitizedCSS = DOMPurify.sanitize(themeSettings.customCSS, {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
})
```

---

## Testing

### Unit Tests:

```typescript
describe('getTenantBySlug', () => {
  it('should return tenant when found', async () => {
    const tenant = await getTenantBySlug('desa-xyz')
    expect(tenant).toBeDefined()
    expect(tenant?.slug).toBe('desa-xyz')
  })

  it('should return null when not found', async () => {
    const tenant = await getTenantBySlug('non-existent')
    expect(tenant).toBeNull()
  })
})
```

### E2E Tests:

```typescript
test('tenant homepage loads correctly', async ({ page }) => {
  await page.goto('/t/desa-xyz')
  await expect(page.locator('h1')).toContainText('Desa XYZ')
})
```

---

## Migration to Subdomain (Future)

### 1. Update `extractTenantSlug`:

```typescript
const slug = extractTenantSlug(
  request.headers.get('host'),
  request.nextUrl.pathname,
  'subdomain', // Change from 'path'
)
```

### 2. Middleware:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const slug = extractTenantSlug(hostname, '', 'subdomain')

  if (slug) {
    // Rewrite to /t/[slug]
    return NextResponse.rewrite(new URL(`/t/${slug}${request.nextUrl.pathname}`, request.url))
  }
}
```

### 3. DNS Configuration:

```
*.egovpapua.com → Your server IP
```

---

## Phase 6 Status: ✅ COMPLETED

**Files Created:** 9

- ✅ TenantProvider (Context)
- ✅ Tenant utilities
- ✅ Tenant layout
- ✅ Tenant homepage
- ✅ ThemeApplier
- ✅ TenantHeader
- ✅ TenantFooter
- ✅ TenantHero
- ✅ TenantSections

**Features:**

- ✅ Path-based routing
- ✅ Tenant context
- ✅ Theme application (CSS variables)
- ✅ Dynamic components
- ✅ SEO ready
- ✅ Responsive design
- ✅ Custom CSS/JS support

**Total Implementation:**

- Backend: 28 collections
- Frontend: 9 core files
- **Full Multi-Tenant System Ready!**

**Next: Phase 7 - Dashboard & Analytics (Optional)**

# Phase 5: Template System - COMPLETED ✅

System untuk template management dan per-tenant theme customization.

---

## Collections Created

### 1. Templates (`templates`)

**Location:** `src/collections/templates/Templates/index.ts`
**Group:** Template System

Template definition yang bisa dipilih oleh tenant.

**Fields:**

#### Basic Info:

- `name` - Template name (e.g., "Modern Desa", "Professional OPD")
- `slug` - URL-friendly identifier (unique)
- `description` - Template description
- `targetTenantType` - provinsi / kabupaten / opd / dpr / distrik / desa / universal

#### Preview:

- `thumbnail` - Screenshot template
- `demoUrl` - Link demo (optional)

#### Layout Configuration:

- `headerStyle` - default / centered / minimal / full-width
- `footerStyle` - default / minimal / extended
- `sidebarPosition` - left / right / none

#### Available Components:

- `hero` - Hero section
- `newsSlider` - News slider
- `serviceCards` - Service cards
- `statistics` - Statistics
- `gallery` - Gallery
- `contactForm` - Contact form

#### Default Pages:

Array of pages yang akan dibuat otomatis:

- `title`, `slug`, `template` (home/about/services/news/contact/custom)

#### Default Color Scheme:

- `primary` - Primary color (hex)
- `secondary` - Secondary color
- `accent` - Accent color

#### Typography:

- `headingFont` - Inter / Poppins / Roboto / Montserrat / Open Sans
- `bodyFont` - Inter / Poppins / Roboto / Open Sans

#### Features:

- Array of template features

#### Status:

- `isActive` - Template tersedia untuk dipilih
- `isDefault` - Default template untuk tenant type
- `isPremium` - Hanya untuk paket premium

**Access Control:**

- Create/Update/Delete: Super Admin only
- Read: All authenticated users

**Use Case:** Template library untuk tenant pilih

---

### 2. ThemeSettings (`theme-settings`)

**Location:** `src/collections/templates/ThemeSettings/index.ts`
**Group:** Template System

Per-tenant theme customization (one per tenant).

**Fields:**

#### Basic:

- `tenant` - Relationship to tenants (unique)
- `template` - Selected template

#### Color Customization:

- `primary` - Primary color
- `secondary` - Secondary color
- `accent` - Accent color
- `background` - Background color
- `text` - Text color

#### Logo Settings:

- `main` - Main logo
- `alternate` - Alternate logo (dark mode)
- `favicon` - Favicon
- `width` - Logo width (px)

#### Header Settings:

- `style` - default / centered / minimal / full-width
- `isSticky` - Sticky header
- `isTransparent` - Transparent on homepage
- `showSearch` - Show search

#### Footer Settings:

- `style` - default / minimal / extended
- `copyrightText` - Copyright text
- `showSocialMedia` - Show social media

#### Homepage Settings:

- `heroType` - slider / video / image / minimal
- `heroImages` - Array of hero slides (image, title, subtitle, link)
- `sections` - Array of homepage sections dengan urutan

**Homepage Sections:**

- news - Latest News
- services - Services
- statistics - Statistics
- gallery - Gallery
- agenda - Agenda
- quick-links - Quick Links
- contact - Contact

#### Typography:

- `headingFont` - Font untuk heading
- `bodyFont` - Font untuk body
- `fontSize` - small / medium / large

#### Custom Code:

- `customCSS` - Custom CSS
- `customJS` - Custom JavaScript

#### SEO Settings:

- `metaTitle` - Default meta title
- `metaDescription` - Default meta description (max 160)
- `metaImage` - Default OG image
- `googleAnalyticsId` - Google Analytics ID

**Access Control:**

- Create/Update/Delete: Authenticated
- Read: Tenant access (own settings only)

**Use Case:** Tenant customize template mereka

---

## Template System Flow

### 1. Template Selection:

```
Super Admin creates Templates
  ↓
Tenant selects Template (during registration or later)
  ↓
ThemeSettings created with template defaults
  ↓
Tenant customizes theme (colors, logo, etc)
```

### 2. Template per Tenant Type:

**Provinsi Templates:**

- Professional Government
- Modern Provincial
- Executive

**Kabupaten/Kota Templates:**

- City Modern
- District Classic
- Regional Hub

**OPD Templates:**

- Department Professional
- Agency Modern
- Service Oriented

**DPR Templates:**

- Legislative Classic
- Parliament Modern
- Democratic

**Desa Templates:**

- Village Simple
- Kampung Modern
- Community Focused

### 3. Customization Levels:

**Level 1 - Basic (All Plans):**

- Select template
- Change colors
- Upload logo
- Basic SEO

**Level 2 - Standard:**

- Typography customization
- Header/Footer styles
- Homepage sections order

**Level 3 - Premium:**

- Custom CSS
- Custom JavaScript
- Premium templates
- Advanced components

---

## Implementation Guide

### Frontend Integration:

#### 1. Get Theme Settings:

```typescript
// In layout or page
const themeSettings = await getThemeSettings(tenantSlug)

// Apply theme
const theme = {
  colors: themeSettings.colors,
  fonts: themeSettings.typography,
  logo: themeSettings.logo,
}
```

#### 2. Dynamic Component Loading:

```typescript
// Load template components
const Template = await import(`@/templates/${template.slug}`)

// Render with theme
<Template.Layout theme={theme}>
  {children}
</Template.Layout>
```

#### 3. Homepage Sections:

```typescript
// Render sections in order
{themeSettings.homepage.sections
  .filter(s => s.isVisible)
  .map(section => (
    <Section key={section.type} type={section.type} />
  ))
}
```

### Backend Hooks:

#### Auto-create ThemeSettings:

```typescript
// In Tenants collection
hooks: {
  afterChange: [
    async ({ doc, operation, req }) => {
      if (operation === 'create') {
        // Get default template for tenant type
        const defaultTemplate = await req.payload.find({
          collection: 'templates',
          where: {
            targetTenantType: { equals: doc.type },
            isDefault: { equals: true },
          },
        })

        // Create theme settings
        await req.payload.create({
          collection: 'theme-settings',
          data: {
            tenant: doc.id,
            template: defaultTemplate.docs[0]?.id,
            colors: defaultTemplate.docs[0]?.defaultColors,
          },
        })
      }
    },
  ],
}
```

---

## Template Components Structure

### Recommended Folder Structure:

```
src/
  templates/
    modern-desa/
      components/
        Header.tsx
        Footer.tsx
        Hero.tsx
        NewsSection.tsx
      layouts/
        Layout.tsx
      styles/
        theme.css
      index.ts

    professional-opd/
      ...
```

### Component Props:

```typescript
interface TemplateProps {
  theme: ThemeSettings
  tenant: Tenant
  children: React.ReactNode
}
```

---

## SEO Integration

### Meta Tags from ThemeSettings:

```typescript
export async function generateMetadata({ params }) {
  const themeSettings = await getThemeSettings(params.slug)

  return {
    title: themeSettings.seo.metaTitle,
    description: themeSettings.seo.metaDescription,
    openGraph: {
      images: [themeSettings.seo.metaImage],
    },
  }
}
```

### Google Analytics:

```typescript
// In layout
{themeSettings.seo.googleAnalyticsId && (
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${themeSettings.seo.googleAnalyticsId}`}
  />
)}
```

---

## Custom CSS/JS Security

### CSS Sanitization:

```typescript
// Sanitize custom CSS
const sanitizedCSS = sanitizeCSS(themeSettings.customCSS)
```

### JS Execution:

```typescript
// Execute in sandbox
if (themeSettings.customJS) {
  // Only for premium plans
  // Execute with restrictions
}
```

---

## Template Preview System

### Admin Preview:

```typescript
// In admin panel
<TemplatePreview
  template={template}
  theme={themeSettings}
/>
```

### Live Preview:

```
/preview/{tenantSlug}?template={templateId}
```

---

## Next Steps

### Create Default Templates:

1. Create 2-3 templates per tenant type
2. Set one as default
3. Add preview screenshots

### Frontend Implementation:

1. Build template components
2. Implement theme provider
3. Dynamic rendering system

### Template Marketplace (Future):

1. Community templates
2. Template ratings
3. Template sales

---

## Phase 5 Status: ✅ COMPLETED

**Collections Created:** 2/2

- ✅ Templates
- ✅ ThemeSettings

**Features:**

- ✅ Template definition system
- ✅ Per-tenant customization
- ✅ Color schemes
- ✅ Logo management
- ✅ Header/Footer styles
- ✅ Homepage sections
- ✅ Typography
- ✅ Custom CSS/JS
- ✅ SEO settings

**Total Collections:** 28

- Phase 1: 2 (Multi-Tenant Core)
- Phase 2: 4 (Billing)
- Phase 3: 8 (SPBE Common)
- Phase 4: 8 (Government Specific)
- Phase 5: 2 (Template System)
- Core: 4 (Pages, Posts, Media, Categories)

**Ready for Phase 6: Frontend Multi-Tenant Implementation**

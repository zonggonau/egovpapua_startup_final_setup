import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Tenant, ThemeSetting } from '@/payload-types'

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'tenants',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Get tenant by subdomain
 */
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  // If using subdomain routing, map subdomain to slug
  // For now, subdomain = slug
  return getTenantBySlug(subdomain)
}

/**
 * Get theme settings for tenant
 */
export async function getThemeSettings(tenantId: string | number): Promise<ThemeSetting | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'theme-settings',
    where: {
      tenant: {
        equals: tenantId,
      },
    },
    depth: 2, // Include template and media
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Get tenant with theme settings
 */
export async function getTenantWithTheme(slug: string): Promise<{
  tenant: Tenant | null
  themeSettings: ThemeSetting | null
}> {
  const tenant = await getTenantBySlug(slug)

  if (!tenant) {
    return { tenant: null, themeSettings: null }
  }

  const themeSettings = await getThemeSettings(tenant.id)

  return { tenant, themeSettings }
}

/**
 * Extract tenant slug from request
 * Supports both subdomain and path-based routing
 */
export function extractTenantSlug(
  hostname: string,
  pathname: string,
  mode: 'subdomain' | 'path' = 'path',
): string | null {
  if (mode === 'subdomain') {
    // Extract subdomain
    // e.g., desa-xyz.egovpapua.com -> desa-xyz
    const parts = hostname.split('.')
    if (parts.length > 2) {
      return parts[0]
    }
    return null
  } else {
    // Extract from path
    // e.g., /t/desa-xyz/... -> desa-xyz
    const match = pathname.match(/^\/t\/([^\/]+)/)
    return match ? match[1] : null
  }
}

/**
 * Check if tenant is active and has valid subscription
 */
export function isTenantActive(tenant: Tenant): boolean {
  return tenant.subscriptionStatus === 'active' || tenant.subscriptionStatus === 'trial'
}

/**
 * Get tenant base URL
 */
export function getTenantBaseUrl(
  tenant: Tenant,
  mode: 'subdomain' | 'path' = 'path',
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
): string {
  if (mode === 'subdomain') {
    const url = new URL(baseUrl)
    return `${url.protocol}//${tenant.slug}.${url.host}`
  } else {
    return `${baseUrl}/t/${tenant.slug}`
  }
}

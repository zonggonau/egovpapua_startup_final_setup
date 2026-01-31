import type { Access } from 'payload'

// Super admin can access everything
export const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'super_admin'
}

// Tenant admin can only access their own tenant's data
export const isTenantAdmin: Access = ({ req: { user } }) => {
  if (user?.role === 'super_admin') return true
  if (user?.role === 'tenant_admin') return true
  return false
}

// Tenant users can only read/write data from their own tenant
export const tenantAccess: Access = ({ req: { user } }) => {
  // Super admin can access all tenants
  if (user?.role === 'super_admin') {
    return true
  }

  // Other users can only access their own tenant
  if (user?.tenant) {
    return {
      tenant: {
        equals: user.tenant,
      },
    }
  }

  return false
}

// Tenant field filter - only show tenant's own data
export const filterByTenant: Access = ({ req: { user } }) => {
  // Super admin sees everything
  if (user?.role === 'super_admin') {
    return true
  }

  // Filter by user's tenant
  if (user?.tenant) {
    return {
      tenant: {
        equals: user.tenant,
      },
    }
  }

  return false
}

// Public can read published, authenticated users filtered by tenant
export const publicOrTenantAccess: Access = ({ req: { user } }) => {
  // Public users can only see published content
  if (!user) {
    return {
      _status: {
        equals: 'published',
      },
    }
  }

  // Super admin sees everything
  if (user.role === 'super_admin') {
    return true
  }

  // Tenant users see their own content (published or draft)
  if (user.tenant) {
    return {
      tenant: {
        equals: user.tenant,
      },
    }
  }

  return false
}

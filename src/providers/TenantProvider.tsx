'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import type { Tenant, ThemeSetting } from '@/payload-types'

export interface TenantContextType {
  tenant: Tenant | null
  themeSettings: ThemeSetting | null
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export interface TenantProviderProps {
  children: ReactNode
  tenant: Tenant | null
  themeSettings: ThemeSetting | null
}

export function TenantProvider({ children, tenant, themeSettings }: TenantProviderProps) {
  const value: TenantContextType = {
    tenant,
    themeSettings,
    isLoading: false,
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

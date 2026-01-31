import React from 'react'
import { notFound } from 'next/navigation'
import { getTenantWithTheme, isTenantActive } from '@/utilities/tenant'
import { TenantProvider } from '@/providers/TenantProvider'
import { TenantHeader } from '@/components/tenant/TenantHeader'
import { TenantFooter } from '@/components/tenant/TenantFooter'
import { ThemeApplier } from '@/components/tenant/ThemeApplier'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { tenant, themeSettings } = await getTenantWithTheme(slug)

  // Tenant not found
  if (!tenant) {
    notFound()
  }

  // Tenant not active (suspended, cancelled)
  if (!isTenantActive(tenant)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Website Tidak Tersedia</h1>
          <p className="text-gray-600">
            {tenant.subscriptionStatus === 'suspended'
              ? 'Website ini sedang ditangguhkan.'
              : 'Langganan website ini telah berakhir.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <TenantProvider tenant={tenant} themeSettings={themeSettings}>
      <ThemeApplier themeSettings={themeSettings}>
        <div className="flex min-h-screen flex-col">
          <TenantHeader />
          <main className="flex-1">{children}</main>
          <TenantFooter />
        </div>
      </ThemeApplier>
    </TenantProvider>
  )
}

import React from 'react'
import { getTenantWithTheme } from '@/utilities/tenant'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TenantHero } from '@/components/tenant/TenantHero'
import { TenantSections } from '@/components/tenant/TenantSections'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { tenant, themeSettings } = await getTenantWithTheme(slug)

  if (!tenant) {
    return {
      title: 'Tenant Not Found',
    }
  }

  return {
    title: themeSettings?.seo?.metaTitle || tenant.name,
    description: themeSettings?.seo?.metaDescription || `Website resmi ${tenant.name}`,
    openGraph: {
      title: themeSettings?.seo?.metaTitle || tenant.name,
      description: themeSettings?.seo?.metaDescription || `Website resmi ${tenant.name}`,
      images: themeSettings?.seo?.metaImage
        ? [
            {
              url:
                typeof themeSettings.seo.metaImage === 'string'
                  ? themeSettings.seo.metaImage
                  : themeSettings.seo.metaImage.url || '',
            },
          ]
        : [],
    },
  }
}

export default async function TenantHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { tenant, themeSettings } = await getTenantWithTheme(slug)

  if (!tenant) {
    return null
  }

  const payload = await getPayload({ config: configPromise })

  // Get latest news
  const news = await payload.find({
    collection: 'berita',
    where: {
      tenant: {
        equals: tenant.id,
      },
      _status: {
        equals: 'published',
      },
    },
    limit: 6,
    sort: '-publishedAt',
  })

  // Get services
  const services = await payload.find({
    collection: 'layanan-publik',
    where: {
      tenant: {
        equals: tenant.id,
      },
    },
    limit: 6,
  })

  // Get agenda
  const agenda = await payload.find({
    collection: 'agenda',
    where: {
      tenant: {
        equals: tenant.id,
      },
      isPublic: {
        equals: true,
      },
    },
    limit: 5,
    sort: 'tanggalMulai',
  })

  return (
    <div>
      {/* Hero Section */}
      <TenantHero themeSettings={themeSettings} />

      {/* Dynamic Sections based on theme settings */}
      <TenantSections
        sections={themeSettings?.homepage?.sections || []}
        data={{
          news: news.docs,
          services: services.docs,
          agenda: agenda.docs,
        }}
      />
    </div>
  )
}

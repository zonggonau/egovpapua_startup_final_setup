'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTenant } from '@/providers/TenantProvider'

interface TenantSectionsProps {
  sections: any[]
  data: {
    news: any[]
    services: any[]
    agenda: any[]
  }
}

export function TenantSections({ sections, data }: TenantSectionsProps) {
  const { tenant } = useTenant()

  if (!tenant) return null

  return (
    <div className="py-12">
      {sections
        .filter((section) => section.isVisible)
        .map((section, index) => {
          switch (section.type) {
            case 'news':
              return (
                <NewsSection key={index} title={section.title} news={data.news} tenant={tenant} />
              )
            case 'services':
              return (
                <ServicesSection
                  key={index}
                  title={section.title}
                  services={data.services}
                  tenant={tenant}
                />
              )
            case 'agenda':
              return (
                <AgendaSection
                  key={index}
                  title={section.title}
                  agenda={data.agenda}
                  tenant={tenant}
                />
              )
            default:
              return null
          }
        })}
    </div>
  )
}

function NewsSection({ title, news, tenant }: any) {
  return (
    <section className="container mx-auto px-4 mb-16">
      <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
        {title || 'Berita Terbaru'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.slice(0, 6).map((item: any) => {
          const imageUrl =
            item.featuredImage && typeof item.featuredImage !== 'string'
              ? item.featuredImage.url
              : null

          return (
            <Link key={item.id} href={`/t/${tenant.slug}/berita/${item.slug}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {imageUrl && (
                  <div className="relative h-48">
                    <Image
                      src={imageUrl}
                      alt={item.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.judul}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{item.ringkasan}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function ServicesSection({ title, services, tenant }: any) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
          {title || 'Layanan Publik'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 6).map((item: any) => (
            <Link
              key={item.id}
              href={`/t/${tenant.slug}/layanan/${item.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-2">{item.namaLayanan}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.kategori}</p>
              <span className="text-primary text-sm font-medium">Lihat Detail →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function AgendaSection({ title, agenda, tenant }: any) {
  return (
    <section className="container mx-auto px-4 mb-16">
      <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>
        {title || 'Agenda Kegiatan'}
      </h2>
      <div className="space-y-4">
        {agenda.slice(0, 5).map((item: any) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {new Date(item.tanggalMulai).getDate()}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(item.tanggalMulai).toLocaleDateString('id-ID', { month: 'short' })}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{item.judul}</h3>
              <p className="text-sm text-gray-600">
                {item.lokasi} •{' '}
                {new Date(item.tanggalMulai).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

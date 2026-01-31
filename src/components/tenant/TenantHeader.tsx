'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTenant } from '@/providers/TenantProvider'

export function TenantHeader() {
  const { tenant, themeSettings } = useTenant()

  if (!tenant) return null

  const logoUrl =
    themeSettings?.logo?.main && typeof themeSettings.logo.main !== 'string'
      ? themeSettings.logo.main.url
      : null

  const logoWidth = themeSettings?.logo?.width || 150
  const isSticky = themeSettings?.header?.isSticky ?? true
  const showSearch = themeSettings?.header?.showSearch ?? true

  return (
    <header
      className={`bg-white shadow-md ${isSticky ? 'sticky top-0 z-50' : ''}`}
      style={{
        backgroundColor: 'var(--color-background, #ffffff)',
        color: 'var(--color-text, #000000)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href={`/t/${tenant.slug}`} className="flex items-center gap-3">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={tenant.name}
                width={logoWidth}
                height={60}
                className="h-auto"
              />
            ) : (
              <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {tenant.name}
              </span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/t/${tenant.slug}`} className="hover:text-primary">
              Beranda
            </Link>
            <Link href={`/t/${tenant.slug}/profil`} className="hover:text-primary">
              Profil
            </Link>
            <Link href={`/t/${tenant.slug}/berita`} className="hover:text-primary">
              Berita
            </Link>
            <Link href={`/t/${tenant.slug}/layanan`} className="hover:text-primary">
              Layanan
            </Link>
            <Link href={`/t/${tenant.slug}/kontak`} className="hover:text-primary">
              Kontak
            </Link>
          </nav>

          {/* Search */}
          {showSearch && (
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Cari..."
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

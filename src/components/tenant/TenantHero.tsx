'use client'

import React from 'react'
import Image from 'next/image'
import type { ThemeSetting } from '@/payload-types'

interface TenantHeroProps {
  themeSettings: ThemeSetting | null
}

export function TenantHero({ themeSettings }: TenantHeroProps) {
  const heroType = themeSettings?.homepage?.heroType || 'slider'
  const heroImages = themeSettings?.homepage?.heroImages || []

  if (heroImages.length === 0) {
    return (
      <div
        className="relative h-[500px] flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-primary, #0066CC)' }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Selamat Datang</h1>
          <p className="text-xl">Website Resmi Pemerintah</p>
        </div>
      </div>
    )
  }

  if (heroType === 'slider' && heroImages.length > 1) {
    // Simple slider (you can enhance with a library like Swiper)
    return (
      <div className="relative h-[500px] overflow-hidden">
        {heroImages.map((slide, index) => {
          const imageUrl = slide.image && typeof slide.image !== 'string' ? slide.image.url : null

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === 0 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {imageUrl && (
                <Image src={imageUrl} alt={slide.title || 'Hero'} fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  {slide.title && <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>}
                  {slide.subtitle && <p className="text-xl">{slide.subtitle}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Single image hero
  const firstSlide = heroImages[0]
  const imageUrl =
    firstSlide.image && typeof firstSlide.image !== 'string' ? firstSlide.image.url : null

  return (
    <div className="relative h-[500px]">
      {imageUrl && (
        <Image src={imageUrl} alt={firstSlide.title || 'Hero'} fill className="object-cover" />
      )}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          {firstSlide.title && <h1 className="text-5xl font-bold mb-4">{firstSlide.title}</h1>}
          {firstSlide.subtitle && <p className="text-xl">{firstSlide.subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

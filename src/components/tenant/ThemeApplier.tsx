'use client'

import React, { useEffect } from 'react'
import type { ThemeSetting } from '@/payload-types'

interface ThemeApplierProps {
  children: React.ReactNode
  themeSettings: ThemeSetting | null
}

export function ThemeApplier({ children, themeSettings }: ThemeApplierProps) {
  useEffect(() => {
    if (!themeSettings) return

    // Apply colors to CSS variables
    const root = document.documentElement

    if (themeSettings.colors?.primary) {
      root.style.setProperty('--color-primary', themeSettings.colors.primary)
    }
    if (themeSettings.colors?.secondary) {
      root.style.setProperty('--color-secondary', themeSettings.colors.secondary)
    }
    if (themeSettings.colors?.accent) {
      root.style.setProperty('--color-accent', themeSettings.colors.accent)
    }
    if (themeSettings.colors?.background) {
      root.style.setProperty('--color-background', themeSettings.colors.background)
    }
    if (themeSettings.colors?.text) {
      root.style.setProperty('--color-text', themeSettings.colors.text)
    }

    // Apply fonts
    if (themeSettings.typography?.headingFont) {
      root.style.setProperty('--font-heading', getFontFamily(themeSettings.typography.headingFont))
    }
    if (themeSettings.typography?.bodyFont) {
      root.style.setProperty('--font-body', getFontFamily(themeSettings.typography.bodyFont))
    }

    // Apply font size
    if (themeSettings.typography?.fontSize) {
      root.style.setProperty('--font-size-base', getFontSize(themeSettings.typography.fontSize))
    }

    // Apply custom CSS
    if (themeSettings.customCSS) {
      const styleId = 'tenant-custom-css'
      let styleElement = document.getElementById(styleId) as HTMLStyleElement

      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }

      styleElement.textContent = themeSettings.customCSS
    }

    // Apply custom JS (with caution)
    if (themeSettings.customJS) {
      try {
        // Execute in a safe context
        const scriptId = 'tenant-custom-js'
        let scriptElement = document.getElementById(scriptId) as HTMLScriptElement

        if (!scriptElement) {
          scriptElement = document.createElement('script')
          scriptElement.id = scriptId
          scriptElement.textContent = themeSettings.customJS
          document.body.appendChild(scriptElement)
        }
      } catch (error) {
        console.error('Error executing custom JS:', error)
      }
    }

    // Cleanup
    return () => {
      // Remove custom styles/scripts on unmount
      const customCSS = document.getElementById('tenant-custom-css')
      const customJS = document.getElementById('tenant-custom-js')
      if (customCSS) customCSS.remove()
      if (customJS) customJS.remove()
    }
  }, [themeSettings])

  return <>{children}</>
}

function getFontFamily(font: string): string {
  const fontMap: Record<string, string> = {
    inter: "'Inter', sans-serif",
    poppins: "'Poppins', sans-serif",
    roboto: "'Roboto', sans-serif",
    montserrat: "'Montserrat', sans-serif",
    'open-sans': "'Open Sans', sans-serif",
  }
  return fontMap[font] || fontMap.inter
}

function getFontSize(size: string): string {
  const sizeMap: Record<string, string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
  }
  return sizeMap[size] || sizeMap.medium
}

"use client"

import { useEffect } from 'react'

interface AdBannerProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
  className?: string
}

export default function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  style = { display: 'block' },
  className = ''
}: AdBannerProps) {
  useEffect(() => {
    try {
      // Check if AdSense is loaded
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  // Don't show ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 ${className}`}>
        <p className="text-sm">📢 Ad Space</p>
        <p className="text-xs">AdSense ads will appear here in production</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}

// Type declaration for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
  }
} 
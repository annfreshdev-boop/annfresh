'use client'

import { useEffect } from 'react'

export default function TrackVisit({ path = '/' }: { path?: string }) {
  useEffect(() => {
    fetch(`/api/track?path=${encodeURIComponent(path)}`, { method: 'POST' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

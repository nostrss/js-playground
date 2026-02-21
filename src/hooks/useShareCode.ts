import { useCallback } from 'react'

import { buildShareUrl } from '@/utils/share'

export function useShareCode(code: string) {
  const share = useCallback(async () => {
    const url = buildShareUrl(code)
    await navigator.clipboard.writeText(url)
    alert('링크가 클립보드에 복사되었습니다!')
  }, [code])

  return { share }
}

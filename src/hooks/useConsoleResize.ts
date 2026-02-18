import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

import { DEFAULT_CONSOLE_WIDTH, MIN_CONSOLE_WIDTH, MAX_CONSOLE_WIDTH } from '@/constants/editor'
import { clamp } from '@/utils/clamp'

export function useConsoleResize() {
  const dragMoveHandlerRef = useRef<((event: MouseEvent) => void) | null>(null)
  const dragEndHandlerRef = useRef<(() => void) | null>(null)

  const [consoleWidth, setConsoleWidth] = useState(DEFAULT_CONSOLE_WIDTH)

  const stopConsoleResize = useCallback(() => {
    if (dragMoveHandlerRef.current) {
      window.removeEventListener('mousemove', dragMoveHandlerRef.current)
      dragMoveHandlerRef.current = null
    }

    if (dragEndHandlerRef.current) {
      window.removeEventListener('mouseup', dragEndHandlerRef.current)
      dragEndHandlerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopConsoleResize()
    }
  }, [stopConsoleResize])

  const handleConsoleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault()

      const startClientX = event.clientX
      const startWidth = consoleWidth

      stopConsoleResize()

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startClientX - moveEvent.clientX
        setConsoleWidth(clamp(startWidth + delta, MIN_CONSOLE_WIDTH, MAX_CONSOLE_WIDTH))
      }

      const handleMouseUp = () => {
        stopConsoleResize()
      }

      dragMoveHandlerRef.current = handleMouseMove
      dragEndHandlerRef.current = handleMouseUp

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [consoleWidth, stopConsoleResize],
  )

  return { consoleWidth, handleConsoleResizeStart }
}

import type { MouseEvent as ReactMouseEvent } from 'react'

type ResizeHandleProps = {
  width: number
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
}

export const ResizeHandle = ({ width, onResizeStart }: ResizeHandleProps) => (
  <div
    className='absolute inset-y-0 left-0 z-10 w-2 -translate-x-1/2 cursor-col-resize select-none'
    data-testid='console-resize-handle'
    onMouseDown={onResizeStart}
    role='separator'
    aria-label='Console resize handle'
    aria-orientation='vertical'
    aria-valuenow={width}
  />
)

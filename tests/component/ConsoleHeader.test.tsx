import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ConsoleHeader } from '@/components/console/ConsoleHeader'
import { getThemeStyle } from '@/utils/theme'

const defaultProps = {
  isRunning: false,
  selectedTheme: 'vs' as const,
  themeOptions: [{ id: 'vs' as const, label: 'Light' }],
  themeStyle: getThemeStyle('vs'),
  onThemeChange: vi.fn(),
  onShare: vi.fn(),
}

describe('ConsoleHeader', () => {
  it('Share 버튼을 렌더링한다', () => {
    render(<ConsoleHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
  })

  it('Share 버튼 클릭 시 onShare 콜백을 호출한다', () => {
    const onShare = vi.fn()
    render(<ConsoleHeader {...defaultProps} onShare={onShare} />)
    fireEvent.click(screen.getByRole('button', { name: 'Share' }))
    expect(onShare).toHaveBeenCalledTimes(1)
  })

  it('Share 버튼 텍스트는 항상 "Share"다', () => {
    render(<ConsoleHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Share' })).toHaveTextContent('Share')
  })

  it('"Copied!" 텍스트는 존재하지 않는다', () => {
    render(<ConsoleHeader {...defaultProps} />)
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument()
  })
})

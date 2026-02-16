import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import App from './App'

vi.mock('@/components/Editor', () => ({
  Editor: () => <div data-testid='editor'>Mock Editor</div>,
}))

describe('App', () => {
  it('에디터를 렌더링한다', () => {
    render(<App />)

    expect(screen.getByTestId('editor')).toBeInTheDocument()
  })

  it('전체 화면 레이아웃 클래스를 적용한다', () => {
    render(<App />)

    expect(screen.getByRole('main')).toHaveClass('h-screen', 'w-screen')
  })
})

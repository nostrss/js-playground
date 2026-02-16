import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('핵심 섹션을 렌더링한다', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Vite + React + Zod',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/API 검증:\s*실패/)).toBeInTheDocument()
    expect(screen.getByText(/폼 검증:\s*실패/)).toBeInTheDocument()
    expect(screen.getByText(/ENV 검증:\s*실패/)).toBeInTheDocument()
  })

  it('카운트 증가 버튼 클릭 시 값이 증가한다', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByText('0')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: '카운트 증가',
      }),
    )

    expect(screen.getByText('1')).toBeInTheDocument()
  })
})

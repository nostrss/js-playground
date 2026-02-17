import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { RunnerMessage } from '@/types/console'

const mockState = vi.hoisted(() => ({
  executeMock: vi.fn(() => Promise.resolve()),
  disposeMock: vi.fn(),
  runnerMessageListener: null as ((message: RunnerMessage) => void) | null,
}))

vi.mock('monaco-editor', () => ({
  editor: {
    create: vi.fn((_container: Element, options: { value: string }) => {
      const currentValue = options.value

      return {
        onDidChangeModelContent: (_listener: () => void) => {
          void _listener

          return {
            dispose: vi.fn(),
          }
        },
        getValue: () => currentValue,
        dispose: vi.fn(),
      }
    }),
  },
}))

vi.mock('@/lib/runner', () => ({
  createRunner: ({ onMessage }: { onMessage: (message: RunnerMessage) => void }) => {
    mockState.runnerMessageListener = onMessage

    return {
      execute: mockState.executeMock,
      dispose: mockState.disposeMock,
    }
  },
}))

import { Editor } from '@/components/Editor'

function emitRunnerMessage(message: RunnerMessage) {
  mockState.runnerMessageListener?.(message)
}

describe('Editor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockState.executeMock.mockClear()
    mockState.disposeMock.mockClear()
    mockState.runnerMessageListener = null
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('좌우 패널을 렌더링한다', () => {
    render(<Editor />)

    expect(screen.getByTestId('playground-layout')).toBeInTheDocument()
    expect(screen.getByTestId('editor-panel')).toBeInTheDocument()
    expect(screen.getByTestId('console-panel')).toBeInTheDocument()
    expect(screen.getByTestId('console-resize-handle')).toBeInTheDocument()
  })

  it('콘솔 패널 너비를 드래그로 조절하고 최소/최대 범위를 지킨다', () => {
    render(<Editor />)

    const panel = screen.getByTestId('console-panel')
    const handle = screen.getByTestId('console-resize-handle')

    expect(panel).toHaveStyle({ width: '360px' })

    act(() => {
      fireEvent.mouseDown(handle, { clientX: 1000 })
      fireEvent.mouseMove(window, { clientX: 900 })
    })
    expect(panel).toHaveStyle({ width: '460px' })

    act(() => {
      fireEvent.mouseMove(window, { clientX: 2000 })
    })
    expect(panel).toHaveStyle({ width: '280px' })

    act(() => {
      fireEvent.mouseMove(window, { clientX: 0 })
    })
    expect(panel).toHaveStyle({ width: '720px' })

    act(() => {
      fireEvent.mouseUp(window)
      fireEvent.mouseMove(window, { clientX: 600 })
    })
    expect(panel).toHaveStyle({ width: '720px' })
  })

  it('초기 실행 이후 runId=1 로그를 콘솔에 표시한다', async () => {
    render(<Editor />)

    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    act(() => {
      emitRunnerMessage({
        type: 'console-event',
        runId: 1,
        level: 'log',
        args: ['initial-run'],
        timestamp: Date.now(),
      })
    })

    expect(screen.getByText('initial-run')).toBeInTheDocument()
  })

  it('현재 실행 runId 로그만 콘솔에 출력한다', async () => {
    render(<Editor />)

    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    act(() => {
      emitRunnerMessage({
        type: 'console-event',
        runId: 0,
        level: 'log',
        args: ['stale'],
        timestamp: Date.now(),
      })
      emitRunnerMessage({
        type: 'console-event',
        runId: 1,
        level: 'log',
        args: ['active'],
        timestamp: Date.now(),
      })
    })

    expect(screen.queryByText('stale')).not.toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('runtime error 로그를 콘솔에 표시한다', async () => {
    render(<Editor />)

    await act(async () => {
      vi.advanceTimersByTime(1000)
      await Promise.resolve()
    })

    act(() => {
      emitRunnerMessage({
        type: 'runtime-error',
        runId: 1,
        message: 'boom',
        stack: null,
        timestamp: Date.now(),
      })
    })

    expect(screen.getByText('boom')).toBeInTheDocument()
  })
})

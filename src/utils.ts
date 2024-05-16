import pc from 'picocolors'

export function at<T = any>(array: readonly T[], index: number): T | undefined {
  const len = array.length

  if (!len)
    return undefined

  if (index < 0)
    index += len

  if (index < 0 || index >= len)
    return undefined
  return array[index]
}

export function currentTime(): string {
  return `[${new Date().toLocaleTimeString('zh-CN', { hour12: false })}]`
}

export function print(message: string) {
  // eslint-disable-next-line no-console
  console.log(`${pc.gray(currentTime())} ${message}`)
}

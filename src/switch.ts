import { env } from 'node:process'
import ky from 'ky'
import pc from 'picocolors'
import { at, print } from './utils'

export async function autoSwitch() {
  const secret = env.SECRET
  const externalController = env.EXTERNAL_CONTROLLER
  const selector = env.SELECTOR
  const delayThreshold = Number(env.DELAY_THRESHOLD) || 500
  const proxiesInclude = env.PROXIES_INCLUDE?.split(',')
  const proxiesExclude = env.PROXIES_EXCLUDE?.split(',')

  if (!secret || !externalController || !selector) {
    print('请配置 SECRET, EXTERNAL_CONTROLLER, SELECTOR')
    return
  }

  const proxiesInfoUrl = `http://${externalController}/proxies`
  const proxiesBySelectorUrl = `http://${externalController}/proxies/${selector}`

  const proxiesInfo: Record<string, any> = await ky.get(proxiesInfoUrl, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  }).json()

  const proxies: Record<string, any> = await ky.get(proxiesBySelectorUrl, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  }).json()

  const currentProxyName: string = proxies.now
  const currentProxyDelay: number = at(proxiesInfo.proxies[currentProxyName].history, -1).delay
  print(`当前节点: ${pc.underline(currentProxyName)} ${currentProxyDelay ? pc.green(`(${currentProxyDelay}ms)`) : pc.red('超时')}`)
  if (currentProxyDelay && currentProxyDelay < delayThreshold) {
    print(`当前无需切换节点`)
    return
  }

  const proxiesSorted = (proxies.all as Array<string>).filter((p) => {
    return (proxiesInclude?.length && proxiesInclude.some(i => p.includes(i)))
      && (proxiesExclude?.length && !proxiesExclude.some(e => p.includes(e)))
  }).map((p) => {
    return {
      name: p,
      delay: at(proxiesInfo.proxies[p].history, -1).delay,
    }
  }).sort((a, b) => {
    return a.delay - b.delay
  })

  const nextProxy = proxiesSorted[0]

  print(`切换到节点：${pc.underline(nextProxy.name)} ${nextProxy.delay ? pc.green(`(${nextProxy.delay}ms)`) : pc.red('超时')}`)
  const formData = new FormData()
  formData.append('name', nextProxy.name)
  const res = await ky.put(proxiesBySelectorUrl, {
    json: {
      name: nextProxy.name,
    },
    headers: {
      'Authorization': `Bearer ${secret}`,
      'content-type': 'application/json',
    },
  })

  if (res.status === 204)
    print(`成功切换至节点：${nextProxy.name}`)

  else
    print(`切换节点失败`)
}

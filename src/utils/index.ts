/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
  const timeNow = new Date()
  const hours = timeNow.getHours()
  if (hours >= 6 && hours <= 10) return `Good morning ⛅`
  if (hours >= 10 && hours <= 14) return `Good afternoon 🌞`
  if (hours >= 14 && hours <= 18) return `Good afternoon 🌞`
  if (hours >= 18 && hours <= 24) return `Good evening 🌛`
  if (hours >= 0 && hours <= 6) return `Good evening 🌛`
}

// 时间戳转YYYY-MM-DD 格式
export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return formattedTime
}

// 将数字转成字符串
export function numberToString(value: Number): string {
  let newValue: string = ''
  newValue = value.toString()
  return newValue
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language

  let defaultBrowserLang = ''
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh'
  } else if (['zh-HK', 'zh-hk'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh-hk'
  } else {
    defaultBrowserLang = 'en'
  }
  return defaultBrowserLang
}

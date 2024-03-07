import { FieldNamesProps } from '@/components/ProTable/interface'
import { isArray } from '@/utils/is'
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

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
  const propArr = prop.split('.')
  if (propArr.length == 1) return prop
  return propArr[propArr.length - 1]
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--'
  return callValue ?? '--'
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(
  callValue: any,
  enumData?: any,
  fieldNames?: FieldNamesProps,
  type?: 'tag'
) {
  const value = fieldNames?.value ?? 'value'
  const label = fieldNames?.label ?? 'label'
  const children = fieldNames?.children ?? 'children'
  let filterData: { [key: string]: any } = {}
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children)
  // 判断是否输出的结果为 tag 类型
  if (type == 'tag') {
    return filterData?.tagType ? filterData.tagType : ''
  } else {
    return filterData ? filterData[label] : '--'
  }
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator
    if (current[value] === callValue) return current
    if (current[children]) return findItemNested(current[children], callValue, value, children)
  }, null)
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes('.')) return row[prop] ?? '--'
  prop.split('.').forEach((item) => (row = row[item] ?? '--'))
  return row
}

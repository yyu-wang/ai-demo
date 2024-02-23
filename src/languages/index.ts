import { createI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'

import zh from './modules/zh'
import zhHk from './modules/zh-hk'
import en from './modules/en'

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: {
    zh,
    en,
    'zh-hk': zhHk
  }
})

export default i18n

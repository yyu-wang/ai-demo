export type LanguageType = 'zh' | 'en' | 'zh-hk' | null

/* GlobalState */
export interface GlobalState {
  language: LanguageType
  isCollapse: boolean
  footer: boolean
}

// SystemStore
export interface systemState {
  title: string
  menuActive: string
}

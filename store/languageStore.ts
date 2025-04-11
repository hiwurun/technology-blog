import { create } from 'zustand'

// 定义支持的语言
export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

// 定义 store 的状态和方法
interface LanguageState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: 'zh', // 默认语言
  setLocale: (locale) => set({ locale }),
}))

// src/i18n.ts
import { createI18n } from 'vue-i18n';

// Import your locale messages
import en from './locales/en.json';
import zh from './locales/zh.json';

const messages = {
  en,
  zh,
};

const savedLocale = localStorage.getItem('locale') || 'zh';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
// src/i18n/utils.ts
import { getCollection } from 'astro:content';
import { languages, defaultLang, showDefaultLang, type SupportedLanguages } from './i18n-config';

let cachedUI: Record<string, any> | null = null;

export async function getUI(lang: SupportedLanguages = defaultLang) {
  if (!cachedUI) {
    const uiCollection = await getCollection('ui');
    cachedUI = Object.fromEntries(
      uiCollection.map(entry => [entry.id, entry.data])
    );
  }
  return cachedUI[lang] || cachedUI[defaultLang];
}

export function getLocaleFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as SupportedLanguages;
  return defaultLang;
}

export async function useTranslations(lang: SupportedLanguages) {
  const ui = await getUI(lang);
  return function t(key: string) {
    try {
      const value = key.split('.').reduce((obj, k) => obj?.[k], ui);
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        // Fall back to default language
        const defaultUI = cachedUI?.[defaultLang];
        return key.split('.').reduce((obj, k) => obj?.[k], defaultUI) || key;
      }
      return value;
    } catch (error) {
      console.error(`Error accessing translation for key: ${key}`, error);
      return key;
    }
  }
}

export function getLocalizedURL(currentPath: string, locale: string, defaultLang: string) {
  // Remove the current locale from the path if it exists
  const pathWithoutLocale = currentPath.replace(/^\/[^/]+\/?/, '').replace(/\/$/, '');

  // For home page in default language, return root URL
  if (!pathWithoutLocale && locale === defaultLang) {
    return '/';
  }

  // For other cases, add locale prefix
  return `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
}

export { languages, defaultLang, showDefaultLang };
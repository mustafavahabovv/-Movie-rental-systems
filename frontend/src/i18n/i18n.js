import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import az from './az.json';
import ru from './ru.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    az: { translation: az },
    ru: { translation: ru },
  },
  lng: 'en', // ilkin dil
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

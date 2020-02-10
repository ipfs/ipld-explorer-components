import i18n from 'i18next'
import ICU from 'i18next-icu'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import cs from 'i18next-icu/locale-data/cs'
import da from 'i18next-icu/locale-data/da'
import de from 'i18next-icu/locale-data/de'
import en from 'i18next-icu/locale-data/en'
import es from 'i18next-icu/locale-data/es'
import fr from 'i18next-icu/locale-data/fr'
import it from 'i18next-icu/locale-data/it'
import ja from 'i18next-icu/locale-data/ja'
import ko from 'i18next-icu/locale-data/ko'
import nl from 'i18next-icu/locale-data/nl'
import no from 'i18next-icu/locale-data/no'
import pl from 'i18next-icu/locale-data/pl'
import pt from 'i18next-icu/locale-data/pt'
import sv from 'i18next-icu/locale-data/sv'
import zh from 'i18next-icu/locale-data/zh'

i18n
  .use(new ICU({
    localeData: [cs, da, de, en, es, fr, it, ja, ko, nl, no, pl, pt, sv, zh]
  }))
  .use(XHR)
  .use(LanguageDetector)
  .init({
    ns: ['explore'],
    fallbackLng: 'en',
    debug: true,
    // react i18next special options (optional)
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  })

export default i18n

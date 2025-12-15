import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./lib/translations/en.json";
import fr from "./lib/translations/fr.json";

i18n
.use(initReactI18next)
.init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    resources: {
        en: en,
        fr: fr
    }
})

export default i18n;

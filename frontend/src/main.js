import {createApp} from 'vue';
import {createPinia} from 'pinia';

import en from "./i18n/en.json";
import nl from "./i18n/nl.json";
import {createI18n} from 'vue-i18n';

import {library} from '@fortawesome/fontawesome-svg-core';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import {
    faAngleDown,
    faArrowLeft,
    faArrowRight,
    faEnvelope,
    faEnvelopeCircleCheck,
    faGraduationCap,
    faPhone,
    faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import {faFacebookF, faInstagram, faLinkedin, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';

library.add(faAngleDown, faPhone, faEnvelope, faArrowLeft, faArrowRight,
    faEnvelopeCircleCheck, faGraduationCap, faClock, faUserGroup,
    faFacebookF, faInstagram, faTwitter, faLinkedin);

const i18n = createI18n({
    locale: 'nl', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        en: en,
        nl: nl,
    },
});

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount('#app');

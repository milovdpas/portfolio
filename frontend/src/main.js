import {createApp} from 'vue';

import i18n from './i18n';

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

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(i18n);
app.use(router);

app.mount('#app');

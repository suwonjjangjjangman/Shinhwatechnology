import { initAnimations } from './js/animations.js';
import { initTabs } from './js/tabs.js';
import { initNav } from './js/nav.js';
import { initSlider } from './js/slider.js';
import { initLightbox } from './js/lightbox.js';
import { initForm } from './js/form.js';
import { initI18n } from './js/i18n.js';
import { initNotices } from './js/notices.js';
import { initAnalytics } from './js/analytics.js';

if (typeof lucide !== 'undefined') lucide.createIcons();

initAnimations();
initTabs();
initNav();
initSlider();
initLightbox();
initForm();
initI18n();
initNotices();
initAnalytics();

if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
        if (!user) {
            window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
        }
    });
}

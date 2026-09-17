function measurementId() {
    return document.querySelector('meta[name="ga-measurement-id"]')?.content.trim();
}

function gtag(...args) {
    if (typeof window.gtag === 'function') window.gtag(...args);
}

export function initAnalytics() {
    const id = measurementId();
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function analyticsTag() { window.dataLayer.push(arguments); };
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.async = true;
    document.head.append(script);
    gtag('js', new Date());
    gtag('config', id, { send_page_view: true });
}

export function trackLeadSubmission(form) {
    const area = form.querySelector('[name="area"]:checked')?.value || 'unspecified';
    gtag('event', 'generate_lead', { lead_type: area });
}

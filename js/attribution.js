const storageKey = 'shinhwa-first-visit';
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];

function getVisitData() {
    const url = new URL(window.location.href);
    return {
        first_landing_page: url.href,
        first_referrer: document.referrer || '(직접 방문)',
        ...Object.fromEntries(campaignKeys.map(key => [key, url.searchParams.get(key) || ''])),
    };
}

function getFirstVisit() {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
        const visit = getVisitData();
        localStorage.setItem(storageKey, JSON.stringify(visit));
        return visit;
    } catch {
        return getVisitData();
    }
}

function setField(form, name, value) {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) field.value = value;
}

export function fillAttributionFields(form) {
    const firstVisit = getFirstVisit();
    const currentUrl = new URL(window.location.href);
    setField(form, 'landing_page', currentUrl.href);
    setField(form, 'landing_referrer', document.referrer || '(직접 방문)');
    Object.entries(firstVisit).forEach(([name, value]) => setField(form, name, value));
}

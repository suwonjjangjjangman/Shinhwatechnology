import { fillAttributionFields } from './attribution.js';
import { trackLeadSubmission } from './analytics.js';

function sanitizeFilename(name) {
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';
    return base.replace(/[^\p{L}\p{N}_-]+/gu, '_') + ext;
}

function sanitizeFileInput(form) {
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput?.files[0];
    if (!file) return;
    const safeName = sanitizeFilename(file.name);
    if (safeName === file.name) return;
    const dt = new DataTransfer();
    dt.items.add(new File([file], safeName, { type: file.type }));
    fileInput.files = dt.files;
}

export function initForm() {
    const form = document.querySelector('form[name="inquiry-form"]');
    if (!form) return;

    fillAttributionFields(form);

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.textContent = '전송 중...';
        try {
            sanitizeFileInput(form);
            const res = await fetch('/', {
                method: 'POST',
                body: new FormData(form),
            });
            if (!res.ok) throw new Error();
            trackLeadSubmission(form);
            alert('문의가 성공적으로 접수되었습니다.\n담당자가 빠르게 연락드리겠습니다.');
            form.reset();
        } catch {
            alert('전송 중 오류가 발생했습니다.\n이메일로 직접 문의해 주세요: procurement@shinhwa-tech.kr');
        } finally {
            btn.disabled = false;
            btn.textContent = '문의 접수';
        }
    });
}

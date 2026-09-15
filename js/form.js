export function initForm() {
    const form = document.querySelector('form[name="inquiry-form"]');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.textContent = '전송 중...';
        try {
            const res = await fetch('/', {
                method: 'POST',
                body: new FormData(form),
            });
            if (!res.ok) throw new Error();
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

const formName = 'inquiry-form';

function getAttachmentUrl(data) {
    const value = data.attachment;
    if (typeof value !== 'string' || !value.startsWith('https://')) return '';
    return value;
}

function formatSection(title, fields) {
    const lines = fields.map(([label, value]) => `${label}: ${value || '-'}`);
    return `[${title}]\n${lines.join('\n')}`;
}

function buildEmailText(data, attachmentUrl) {
    const product = formatSection('01 견적요청 제품', [
        ['분야', data.area], ['제품명/품번', data.product],
        ['제조사', data.manufacturer], ['수량', data.quantity],
    ]);
    const customer = formatSection('02 의뢰고객 정보', [
        ['회사명', data.company], ['부서명', data.department], ['직위', data.position],
        ['성명', data.name], ['이메일', data.email], ['전화번호', data.phone],
        ['팩스번호', data.fax], ['휴대폰번호', data.mobile],
    ]);
    const source = formatSection('유입 정보', [
        ['최초 방문 페이지', data.first_landing_page], ['최초 유입', data.first_referrer],
        ['UTM 출처', data.utm_source], ['UTM 매체', data.utm_medium], ['캠페인', data.utm_campaign],
    ]);
    const file = attachmentUrl ? `\n원본 파일 링크: ${attachmentUrl}` : '';
    return `${product}\n\n${customer}\n\n[03 추가 문의사항]\n${data.message || ''}${file}\n\n${source}`;
}

function buildSubject(data) {
    const who = [data.company, data.name].filter(Boolean).join(' ');
    return `[신규 견적 문의] ${who || '이름 없음'} - ${data.product || data.area || '일반 문의'}`;
}

async function sendQuote(data, attachmentUrl = '') {
    const attachments = attachmentUrl
        ? [{ path: attachmentUrl, filename: attachmentUrl.split('/').pop().split('?')[0] }]
        : undefined;
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM,
            to: process.env.QUOTE_NOTIFY_TO.split(',').map(email => email.trim()),
            reply_to: data.email,
            subject: buildSubject(data),
            text: buildEmailText(data, attachmentUrl),
            attachments,
        }),
    });
    if (!response.ok) throw new Error(await response.text());
}

export default {
    async formSubmitted(event) {
        const data = event.data || {};
        const submittedFormName = data['form-name'] || event.form?.name || event.formName;
        if (submittedFormName !== formName) return;
        if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM || !process.env.QUOTE_NOTIFY_TO) {
            console.error('Resend quote-mail environment variables are not configured.');
            return;
        }
        const attachmentUrl = getAttachmentUrl(data);
        try {
            await sendQuote(data, attachmentUrl);
        } catch (error) {
            if (!attachmentUrl) throw error;
            console.error('Attachment delivery failed; sending secure-link fallback.', error);
            await sendQuote(data);
        }
    },
};

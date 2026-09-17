const formName = 'inquiry-form';

function getAttachmentUrl(data) {
    const value = data.attachment;
    if (typeof value !== 'string' || !value.startsWith('https://')) return '';
    return value;
}

function buildEmailText(data, attachmentUrl) {
    const fields = [
        ['이름/회사명', data.name], ['이메일', data.email], ['연락처', data.phone],
        ['분야', data.area], ['최초 방문 페이지', data.first_landing_page],
        ['최초 유입', data.first_referrer], ['UTM 출처', data.utm_source],
        ['UTM 매체', data.utm_medium], ['캠페인', data.utm_campaign],
    ];
    const lines = fields.map(([label, value]) => `${label}: ${value || '-'}`);
    if (attachmentUrl) lines.push(`원본 파일 링크: ${attachmentUrl}`);
    return `${lines.join('\n')}\n\n[문의내용]\n${data.message || ''}`;
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
            subject: `[신규 견적 문의] ${data.subject || data.name || '제목 없음'}`,
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

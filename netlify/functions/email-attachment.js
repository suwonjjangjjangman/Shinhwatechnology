async function fetchAttachmentBase64(url) {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return Buffer.from(buf).toString('base64');
}

function buildEmailText(data) {
    return [
        `이름/회사명: ${data.name || ''}`,
        `이메일: ${data.email || ''}`,
        `연락처: ${data.phone || ''}`,
        `분야: ${data.area || ''}`,
        `유입경로: ${data.landing_referrer || ''}`,
        '',
        `[문의내용]`,
        data.message || '',
    ].join('\n');
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body || '{}');
    const payload = body.payload || body;
    const data = payload.data || payload;

    const attachments = [];
    const attachment = data.attachment;
    const attachmentUrl = attachment && (attachment.url || attachment);
    if (attachmentUrl && typeof attachmentUrl === 'string') {
        attachments.push({
            filename: (attachment.filename) || attachmentUrl.split('/').pop(),
            content: await fetchAttachmentBase64(attachmentUrl),
        });
    }

    const to = (process.env.QUOTE_NOTIFY_TO || 'procurement@shinhwa-tech.kr').split(',');
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM || 'onboarding@resend.dev',
            to,
            subject: `[견적 문의] ${data.subject || '제목 없음'}`,
            text: buildEmailText(data),
            attachments,
        }),
    });

    if (!res.ok) {
        console.error('Resend send failed:', res.status, await res.text());
        return { statusCode: 502, body: 'failed' };
    }
    return { statusCode: 200, body: 'ok' };
};

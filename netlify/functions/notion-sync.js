const NOTION_VERSION = '2022-06-28';

function textProp(value) {
    return { rich_text: value ? [{ text: { content: String(value).slice(0, 2000) } }] : [] };
}

function buildProperties(data, siteUrl) {
    const attachment = data.attachment
        ? (data.attachment.startsWith('http') ? data.attachment : `${siteUrl}${data.attachment}`)
        : null;

    return {
        '이름/회사명': { title: [{ text: { content: data.name || '(이름 없음)' } }] },
        '이메일': { email: data.email || null },
        '연락처': { phone_number: data.phone || null },
        '제목': textProp(data.subject),
        '분야': data.area ? { select: { name: data.area } } : { select: null },
        '문의내용': textProp(data.message),
        '첨부파일': { url: attachment },
        '유입경로': textProp(data.landing_referrer),
        '상태': { select: { name: '신규' } },
    };
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body || '{}');
    const payload = body.payload || body;
    const data = payload.data || payload;
    const siteUrl = payload.site_url || 'https://shinhwatechnology.co.kr';

    const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            parent: { database_id: process.env.NOTION_DATABASE_ID },
            properties: buildProperties(data, siteUrl),
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('Notion sync failed:', res.status, errText);
        return { statusCode: 502, body: errText };
    }

    return { statusCode: 200, body: 'ok' };
};

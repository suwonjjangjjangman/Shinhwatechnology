# 견적 문의·분석 운영 설정

## 1. Resend 첨부 메일 설정

Netlify 프로젝트의 Environment variables에 아래 값을 추가합니다. API 키는 채팅이나 저장소에 넣지 않습니다.

| 변수 | 값 |
| --- | --- |
| `RESEND_API_KEY` | Resend에서 발급한 API 키 |
| `RESEND_FROM` | `신화테크놀러지 견적문의 <견적@shinhwatechnology.co.kr>` |
| `QUOTE_NOTIFY_TO` | 구매팀과 수신자를 쉼표로 구분한 주소 |

`quote-email.mjs`는 Netlify가 검증한 견적 문의 이벤트에서만 실행됩니다. 첨부 전송이 실패하면 원본 파일 링크를 포함한 대체 메일을 보냅니다. 첫 테스트가 끝날 때까지 기존 Netlify 이메일 알림을 유지하고, 수신이 확인된 뒤 중복 알림을 끕니다.

## 2. GA4 전환 측정 설정

1. GA4 속성과 웹 데이터 스트림을 만들고 측정 ID(`G-...`)를 받습니다.
2. `index.html`의 `ga-measurement-id` 메타 태그에 측정 ID를 넣습니다.
3. GA4에서 `generate_lead` 이벤트를 핵심 이벤트로 표시합니다.
4. 실제 문의를 한 번 테스트해 Realtime 또는 DebugView에서 이벤트를 확인합니다.

문의 내용, 전화번호, 이메일, 도면은 GA4로 보내지 않습니다. 방문 경로와 제품 분야만 전환 분석에 사용합니다.

## 3. SEO 등록

배포 후 다음을 등록하고 각각 `https://shinhwatechnology.co.kr/sitemap.xml`을 제출합니다.

- Google Search Console
- 네이버 서치어드바이저

검색 유입을 늘리려면 정밀가공, RF 부품, 산업별 적용 사례를 각기 독립된 페이지로 확장합니다. 해시 메뉴만으로는 각 서비스의 검색 제목과 설명을 분리하기 어렵습니다.

## 4. 유입 링크 표준

외부 홍보 링크에는 아래처럼 출처를 붙입니다.

`https://shinhwatechnology.co.kr/?utm_source=naver_blog&utm_medium=organic&utm_campaign=precision_machining`

`utm_source`, `utm_medium`, `utm_campaign`은 항상 소문자와 같은 이름 규칙을 사용합니다.

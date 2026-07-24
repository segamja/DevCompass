# DevCompass 웹 배포 가이드 (Vercel)

DevCompass는 **Vercel**에 프론트엔드(Vite) + API(Serverless)를 함께 배포합니다.

---

## 1. Vercel 프로젝트 연결

### 방법 A — GitHub 연동 (권장)

1. [vercel.com](https://vercel.com) 로그인
2. **Add New → Project**
3. GitHub 저장소 `segamja/DevCompass` 선택 → **Import**
4. Framework Preset: **Vite** (자동 감지)
5. 아래 환경 변수 입력 후 **Deploy**

### 방법 B — CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

---

## 2. Vercel 환경 변수 (필수)

Vercel Dashboard → Project → **Settings → Environment Variables**

| 변수 | 값 | 적용 환경 |
|------|-----|-----------|
| `VITE_SUPABASE_URL` | `https://injwreiavyulvueqrbbk.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Production, Preview, Development |
| `SUPABASE_URL` | 위와 동일 URL | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key | Production, Preview, Development |
| `OPENAI_API_KEY` | OpenAI API key (선택) | Production, Preview, Development |

> `VITE_` 변수는 **빌드 시** 프론트에 포함됩니다. 배포 후 값을 바꾸면 **Redeploy**가 필요합니다.

---

## 3. Supabase Auth 설정 (배포 URL 반영)

배포 후 Vercel URL 예: `https://dev-compass-xxx.vercel.app`

Supabase Dashboard → **Authentication → URL Configuration**

| 항목 | 값 |
|------|-----|
| Site URL | `https://your-app.vercel.app` |
| Redirect URLs | `https://your-app.vercel.app/auth/callback` |
| | `http://localhost:5173/auth/callback` (로컬) |

---

## 4. GitHub OAuth App

GitHub OAuth App callback은 **Supabase** 주소입니다 (변경 없음):

```
https://injwreiavyulvueqrbbk.supabase.co/auth/v1/callback
```

---

## 5. DB 마이그레이션

Supabase SQL Editor에서 `supabase/migrations/001_initial.sql` 실행 (최초 1회).

---

## 6. 배포 확인

1. Vercel URL 접속
2. **GitHub로 시작하기** 클릭 → 로그인
3. **DNA 분석** 실행 → API(`/api/github/sync`, `/api/analysis/run`) 동작 확인

---

## 문제 해결

### 빈 화면 / 404
- `vercel.json` SPA rewrite 확인
- Vercel **Redeploy** 실행

### Supabase 설정 오류
- Vercel 환경 변수 `VITE_*` 확인 후 재배포

### OAuth redirect 오류
- Supabase Redirect URLs에 **정확한** Vercel 도메인 포함 여부 확인

### API 404 / DNA 분석 무반응
- Vercel에서 `/api/*` 요청이 404면 `api/index.ts` 단일 라우터 + `vercel.json` rewrite 확인
- 배포 후 `https://your-app.vercel.app/api?route=health` → `{"ok":true}` 응답 확인
- Vercel **Redeploy** 실행

### API 500 / GitHub sync 실패
- `SUPABASE_SERVICE_ROLE_KEY` 설정 확인
- Vercel Function Logs에서 에러 확인

---

## 커스텀 도메인 (선택)

Vercel → Project → **Settings → Domains** 에서 도메인 추가 후, Supabase Redirect URLs에도 동일 도메인 등록.

# GitHub 로그인 설정 가이드

DevCompass는 **Supabase Auth + GitHub OAuth**로 로그인합니다. 아래 순서대로 설정하면 로컬에서 GitHub 로그인을 테스트할 수 있습니다.

---

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성
2. **Project Settings → API** 에서 아래 값 복사:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (서버 API용, 프론트에 노출 금지)

---

## 2. DB 마이그레이션 실행

Supabase Dashboard → **SQL Editor** → New query

[`supabase/migrations/001_initial.sql`](../supabase/migrations/001_initial.sql) 내용을 붙여넣고 **Run** 실행

---

## 3. GitHub OAuth App 생성

1. [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers) → **New OAuth App**
2. 입력값:

| 항목 | 값 |
|------|-----|
| Application name | DevCompass (로컬) |
| Homepage URL | `http://localhost:5173` |
| Authorization callback URL | `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback` |

> `<YOUR-PROJECT-REF>`는 Supabase URL의 서브도메인입니다.  
> 예: `https://abcdefgh.supabase.co` → callback은 `https://abcdefgh.supabase.co/auth/v1/callback`

3. 생성 후 **Client ID**와 **Client Secret** 복사

---

## 4. Supabase GitHub Provider 설정

Supabase Dashboard → **Authentication → Providers → GitHub**

1. **Enable GitHub** 켜기
2. GitHub OAuth App의 **Client ID / Client Secret** 입력
3. **Save**

추가 설정 (Authentication → URL Configuration):

| 항목 | 값 |
|------|-----|
| Site URL | `http://localhost:5173` |
| Redirect URLs | `http://localhost:5173/auth/callback` |
| | `http://localhost:5174/auth/callback` (포트가 다를 경우) |
| | `http://localhost:5173/dashboard` |

**Authentication → Providers → GitHub** (또는 Auth 설정)에서  
**Store provider tokens** / provider refresh token 저장 옵션이 있으면 **활성화**하세요.  
(GitHub API sync에 provider token이 필요합니다.)

---

## 5. 환경 변수 (.env.local)

프로젝트 루트에 `.env.local` 파일 생성:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
```

---

## 6. 로컬 실행

**Terminal 1 — API 서버** (GitHub sync / AI 분석용):

```bash
npm run dev:api
```

**Terminal 2 — 프론트엔드**:

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 표시된 포트) 접속 → **GitHub로 시작하기** 클릭

---

## 7. 로그인 후 흐름

```
랜딩 → GitHub OAuth → /auth/callback → /dashboard
         ↓
    Analyze DNA 클릭 → GitHub sync → AI 분석 → 결과 표시
```

---

## 문제 해결

### "Supabase가 설정되지 않았습니다"
- `.env.local` 파일 존재 여부 확인
- `VITE_` 접두사 변수명 확인
- dev 서버 **재시작** (`npm run dev`)

### OAuth redirect 오류
- Supabase Redirect URLs에 현재 포트(`5173` 또는 `5174`) 포함 여부 확인
- GitHub OAuth App callback URL이 Supabase callback과 정확히 일치하는지 확인

### "GitHub token not found"
- Supabase에서 provider token 저장 활성화
- GitHub 로그아웃 후 **다시 로그인** (scope `read:user repo` 재동의)
- Settings → Reconnect GitHub

### API 401 / sync 실패
- `npm run dev:api` 가 실행 중인지 확인
- `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 설정 확인

---

## Vercel 배포 시 추가 설정

1. Vercel 환경 변수에 Supabase / OpenAI 키 등록
2. Supabase Redirect URLs에 `https://your-app.vercel.app/auth/callback` 추가
3. Supabase Site URL을 Vercel 도메인으로 변경

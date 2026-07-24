# DevCompass

**AI로 개발자 커리어를 탐색하세요**

DevCompass는 GitHub 활동을 분석해 Developer DNA, 스킬 점수, 성장 타임라인, 커리어 코칭, 포트폴리오·이력서 자동 생성을 제공하는 AI 기반 개발자 커리어 플랫폼입니다.

> **언어:** 한국어(기본) / English — 설정 페이지 또는 랜딩 페이지에서 전환 가능

---

## 진행 상황 (2026-07-24)

### ✅ 완료

| 영역 | 내용 |
|------|------|
| **프론트엔드** | React 18 + Vite + TypeScript + Tailwind + shadcn/ui |
| **라우팅** | 13개 페이지 + 랜딩 + OAuth 콜백 |
| **인증** | Supabase GitHub OAuth (PKCE, `/auth/callback`) |
| **DB** | `devcompass_` 접두어 테이블 (시그널수사 `signal_` 테이블과 공존) |
| **API** | Vercel Serverless + 로컬 dev API (`npm run dev:api`) |
| **GitHub Sync** | Profile / Repos / Languages / Starred / README / Events |
| **AI 분석** | OpenAI Structured Output (Developer DNA, 스킬 점수 등) |
| **UI 페이지** | Dashboard, DNA, Skill Analysis, Growth Timeline, Career Coach, Learning Roadmap, Repo Recommendations, Job Matching, Portfolio, Resume, GitHub University, Weekly Report, Settings |
| **데모 모드** | GitHub 없이 UI 미리보기 |
| **다국어** | 한국어(기본) / English |
| **공유 Supabase** | 시그널수사 프로젝트 DB 공유 (`injwreiavyulvueqrbbk`) |

### 🔧 설정 필요 (로컬 실행 시)

1. `.env.local` — Supabase URL, anon key, **service_role key**
2. Supabase SQL Editor — `supabase/migrations/001_initial.sql` 실행
3. GitHub OAuth App → Supabase GitHub Provider 연결
4. Supabase Redirect URLs — `http://localhost:5173/auth/callback`

자세한 가이드: [`docs/GITHUB_AUTH_SETUP.md`](docs/GITHUB_AUTH_SETUP.md)

### 📋 Supabase 공유 구조

| 프로젝트 | 설정 위치 | 테이블 접두어 |
|----------|-----------|---------------|
| **시그널수사** | `js/config.js` (`.env` 없음) | `signal_` |
| **DevCompass** | `.env.local` | `devcompass_` |

동일 Supabase 프로젝트(`injwreiavyulvueqrbbk`)를 무료 티어에서 공유합니다.

---

## 주요 기능

- GitHub OAuth 로그인 (Supabase Auth)
- GitHub 활동 동기화 (레포, 언어, 기여, README)
- AI Developer DNA 분석
- 8개 영역 스킬 점수 + 레이더 차트
- 성장 타임라인 시각화
- AI 커리어 코치 채팅
- 학습 로드맵 & 레포지토리 추천
- 채용 공고 매칭 & 스킬 갭 분석
- 포트폴리오 생성 (Web / PDF / Markdown)
- AI 이력서 어시스턴트 (이력서, 자기소개서, LinkedIn)
- GitHub University 미션
- 주간 커리어 리포트

---

## 기술 스택

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Recharts
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o (Structured JSON Output)
- **Auth:** GitHub OAuth via Supabase

---

## 설치 및 실행

### 1. 클론 및 의존성 설치

```bash
git clone https://github.com/segamja/DevCompass.git
cd DevCompass
npm install
```

### 2. 환경 변수

`.env.example`을 참고해 `.env.local` 생성:

```env
VITE_SUPABASE_URL=https://injwreiavyulvueqrbbk.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
PORT=3001
```

### 3. DB 마이그레이션

Supabase Dashboard → SQL Editor → `supabase/migrations/001_initial.sql` 실행

### 4. 로컬 실행

**터미널 1 — API 서버:**
```bash
npm run dev:api
```

**터미널 2 — 프론트엔드:**
```bash
npm run dev
```

브라우저: http://localhost:5173

---

## 사용 방법

1. **GitHub로 시작하기** 클릭 → OAuth 로그인
2. 사이드바 **DNA 분석** 클릭 → GitHub sync + AI 분석
3. Dashboard, Developer DNA, Career Coach 등 탐색
4. **설정**에서 한국어/English 전환

GitHub 없이 UI만 보려면 랜딩 페이지 **UI 데모 미리보기** 사용.

---

## 프로젝트 구조

```
src/           React 프론트엔드 + i18n (ko/en)
api/           Vercel serverless API
server/        로컬 dev API 서버
supabase/      DB 마이그레이션 (devcompass_* 테이블)
docs/          설정 가이드
Design/        UI 디자인 목업
```

---

## 배포 (Vercel)

```bash
npx vercel
```

Vercel 환경 변수에 Supabase / OpenAI 키 등록 후, Supabase Redirect URLs에 Vercel 도메인 추가.

---

## License

MIT

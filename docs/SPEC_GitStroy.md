📄 [기술명세서] GitStory: GitHub API 기반 AI 취업 포트폴리오 자동화 플랫폼
1. 프로젝트 개요 (Overview)
프로젝트명: GitStory (기트스토리)

목적: 취업 준비생 및 학생들의 GitHub 레포지토리, Star, Commit 등 파편화된 활동 데이터를 수집·분석하여, 자신만의 ‘개발자 성장 스토리’와 ‘카테고리별 기술 스택’이 정돈된 완성형 포트폴리오 문서(웹/PDF)를 자동 발급하는 서비스

타겟 사용자:

자신의 강점 분석 및 기술 포트폴리오 작성이 막막한 개발자 취준생/학생

수강생의 Output 및 진로 가이드가 필요한 부트캠프/대학/캠프 강사

2. 시스템 아키텍처 (System Architecture)
[Client: React / Next.js]
     │
     ├── (1) GitHub OAuth Auth/Token ────► [GitHub OAuth API]
     ├── (2) Fetch Activity Data ───────► [GitHub REST & GraphQL API]
     │
     ▼
[Backend / Edge Service] ──(3) Prompt Data──► [LLM Engine: GPT-4o / Claude]
     │                                                     │
     │◄─── (4) Story & Stack JSON Result ──────────────────┘
     │
     ▼
[Database / Storage: Supabase]
     ├── (5) User & Document Meta Store
     └── (6) PDF Export Component (html2canvas / jsPDF)
	 
	 
3. GitHub API 데이터 수집 명세 (Data Ingestion)GitHub API 엔드포인트를 통해 취준생의 실제 데이터를 1~2초 내에 수집합니다.
수집 파이프라인API Endpoint / Protocol추출 데이터 (Extracted Data)활용 목적
유저 프로필GET /users/{username}Bio, Public Repos 수, 계정 생성일, Followers개발자 기본 정보 및 연차/활동성 파악
관심 스택GET /users/{username}/starredStar한 레포지토리 목록, Topic, Description취준생이 추적·공부 중인 최신 관심 기술군 추출
프로젝트/언어GET /users/{username}/reposGET /repos/{owner}/{repo}/languages저장소 설명, 주요 언어별 바이트(Byte) 수, Star/Fork 수주력 사용 언어 비율 및 보유 프로젝트 분석
상세 프로젝트GET /repos/{owner}/{repo}/readmeREADME.md 원문 텍스트대표 프로젝트의 서비스 목적, 주요 기능 분석
활동/성장 흐름GraphQL API (v4) / GET /users/{username}/events연도별 Commit/PR/Issue 발생 히스토리	 

💡 Token Management (API Rate Limit 극복)

Unauthenticated 호출 시 IP당 60회/시간 제한이 발생하므로, 반드시 GitHub OAuth Login을 적용하여 유저당 5,000회/시간의 호출 한도를 확보합니다.

4. AI 분석 및 스토리텔링 파이프라인 (AI Engine Specification)
4.1. LLM Prompt Processing Flow
Data Preprocessing: 수집된 JSON 데이터 중 README.md의 특수문자 제거 및 언어 비율 데이터 정규화

Context Injection: 유저 수집 데이터를 LLM 입력 프롬프트로 바인딩

Structured JSON Output: 프롬프트 결과를 Structured Output(JSON Schema)으로 응답받아 프론트엔드 UI에 전달

4.2. LLM 입력/출력 데이터 스키마 예시
JSON

// LLM Output Schema (Structured JSON Response)
{
  "developer_slogan": "데이터 흐름을 이해하고 RAG 기반 AI Agent를 구축하는 백엔드 개발자",
  "developer_dna": ["AI Agent Builder", "Problem Solver", "Data-Driven"],
  "career_story": "Python 기반의 백엔드 시스템 구축으로 시작해, 최근 LangChain과 Vector DB를 활용한 AI 서비스 개발로 영역을 확장해 왔습니다...",
  "tech_stack": {
    "primary": ["Python", "Next.js", "Supabase"],
    "secondary": ["Docker", "Tailwind CSS", "FastAPI"],
    "exploring": ["LangGraph", "MCP", "Pinecone"]
  },
  "highlight_projects": [
    {
      "repo_name": "my-ai-agent",
      "summary": "LLM과 외부 API를 연동하여 맞춤형 추천을 제공하는 오토메이션 에이전트",
      "key_contribution": "LangGraph 흐름 설계 및 Supabase Realtime 저장소 구축"
    }
  ]
}

5. 포트폴리오 문서화 및 시각화 (Output Generator)
수집 및 AI 가공이 완료된 데이터를 시각적 문서 형태(PDF 및 Web)로 변환합니다.

5.1. 포트폴리오 문서 구성 요소
Header Section: 유저 ID, AI가 정의한 개발자 슬로건, 기본 프로필

Skill Radar & Tech Stack Grid:

Primary Stack: 가장 높은 코드 작성 비중 및 핵심 레포 관련 기술

Secondary Stack: 프로젝트 보조 적용 기술

Exploring Stack: 최근 Star 목록에서 추출된 관심 기술

Career Timeline Story: 공부한 오픈소스와 커밋 기록 기반의 “나의 SW 성장 이야기” (3~4문단)

Project Showcase: 주요 저장소별 README 요약 및 해결 이슈/역할 정돈

AI Coach Tip: 면접 및 자기소개서 작성 시 강조하면 좋을 강점 포인트 안내

5.2. 문서 자동 생성 엔진
Web Live Preview: React 기반의 Clean Resume / Portfolio 레이아웃 템플릿에 데이터 바인딩

PDF Export Engine: html2canvas로 UI 영역을 렌더링 후 jsPDF를 활용해 고해상도 A4 포맷 PDF로 즉시 변환/다운로드

6. 추천 기술 스택 (Tech Stack Summary)
Frontend: Next.js (React), Tailwind CSS, Lucide Icons, Recharts (Skill Radar 시각화)

Backend / DB: Supabase (OAuth Auth, Document Meta Store, Storage)

AI Integrations: OpenAI API (gpt-4o) 또는 Anthropic Claude API (claude-3-5-sonnet)

Export Library: html2canvas, jspdf

Deployment: Vercel
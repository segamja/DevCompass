# DevCompass

## AI Developer Career Platform

### 프로젝트 기술 명세서 (PRD)

> **Navigate Your Developer Career with AI**

------------------------------------------------------------------------

# 1. 프로젝트 개요

## 프로젝트명

**DevCompass**

## 한 줄 소개

GitHub 활동 데이터를 AI가 분석하여 개발자의 성장 과정, 역량, 커리어
방향을 제안하고 포트폴리오까지 자동 생성하는 AI 기반 개발자 커리어
플랫폼.

## 비전

GitHub를 단순한 코드 저장소가 아닌 **개발자의 커리어 자산(Career
Asset)** 으로 전환한다.

------------------------------------------------------------------------

# 2. 해결하려는 문제

-   GitHub 활동을 객관적으로 설명하기 어렵다.
-   무엇을 다음으로 공부해야 하는지 알기 어렵다.
-   포트폴리오와 이력서 작성에 많은 시간이 든다.
-   채용공고와 자신의 역량 차이를 파악하기 어렵다.
-   GitHub를 단순 저장소로만 활용하고 있다.

------------------------------------------------------------------------

# 3. 핵심 가치

1.  Analyze -- GitHub 활동 분석
2.  Understand -- 개발자 역량 및 성향 이해
3.  Recommend -- 맞춤형 학습 로드맵 제안
4.  Grow -- 지속적인 성장 관리
5.  Showcase -- 포트폴리오 및 커리어 자산 생성

------------------------------------------------------------------------

# 4. 주요 기능

## 4.1 GitHub Activity Analyzer

-   GitHub OAuth 로그인
-   Repository / Commit / Pull Request / Issue 분석
-   README 및 Topics 분석
-   Programming Language 분석
-   Contribution Calendar 분석

## 4.2 Developer DNA

AI가 개발자의 성향을 분석 - AI Agent Builder - Backend Engineer -
Frontend Creator - Cloud Architect - Open Source Explorer - Problem
Solver

## 4.3 AI Developer Skill Score

분석 영역 - Backend - Frontend - AI - Database - DevOps - Cloud -
Documentation - Collaboration

## 4.4 Growth Timeline

기술 습득 과정을 시간순으로 시각화하고 AI가 성장 스토리를 생성한다.

예시

Python → FastAPI → Docker → React → LLM → RAG → AI Agent

## 4.5 AI Career Coach

현재 역량을 기반으로 다음 학습 기술과 우선순위를 추천한다.

예시 - Docker - Redis - Kubernetes - CI/CD - LangGraph - MCP

## 4.6 Smart Repository Recommendation

개인의 수준과 관심 분야에 맞는 GitHub Repository 추천

## 4.7 Job Matching

채용공고 요구 기술과 GitHub 활동을 비교하여 적합도와 부족한 역량 분석

## 4.8 AI Portfolio Generator

자동 생성 - Developer Summary - 기술 스택 - 성장 스토리 - 대표
프로젝트 - Developer DNA - 포트폴리오(Web/PDF/Markdown)

## 4.9 AI Resume Assistant

자동 생성 - 이력서 - 자기소개서 - LinkedIn 프로필 - 면접 자기소개

## 4.10 GitHub University

-   Daily Mission
-   Weekly Challenge
-   README 학습
-   AI 피드백

## 4.11 Weekly Career Report

매주 성장 리포트 및 추천 기술 제공

------------------------------------------------------------------------

# 5. 시스템 아키텍처

    GitHub OAuth
            │
    GitHub REST / GraphQL API
            │
    Activity Collector
            │
    AI Analysis Engine
            │
    Career Intelligence Engine
            │
    Learning Recommendation Engine
            │
    Portfolio & Resume Generator
            │
    Supabase
            │
    React Dashboard

------------------------------------------------------------------------

# 6. 기술 스택

## Frontend

-   React 18
-   Vite
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Zustand
-   TanStack Query
-   Recharts

## Backend

-   Node.js
-   Vercel Serverless Functions

## Database

-   Supabase

## AI

-   OpenAI GPT-5.5
-   Structured Output
-   Embeddings
-   RAG(확장)

## Authentication

-   GitHub OAuth

## Deployment

-   Vercel

------------------------------------------------------------------------

# 7. MVP

1.  GitHub OAuth
2.  GitHub 데이터 수집
3.  Developer DNA
4.  AI Skill Score
5.  Growth Timeline
6.  AI Career Coach
7.  AI Portfolio Generator

------------------------------------------------------------------------

# 8. 차별화 포인트

  일반 GitHub 분석       DevCompass
  ---------------------- ------------
  GitHub 통계            ✅
  Repository 분석        ✅
  성장 스토리            ✅
  AI Career Coach        ✅
  학습 로드맵            ✅
  Repository 추천        ✅
  Job Matching           ✅
  AI Portfolio           ✅
  AI Resume              ✅
  GitHub University      ✅
  Weekly Career Report   ✅

------------------------------------------------------------------------

# 9. 향후 확장

-   AI Mock Interview
-   LinkedIn 연동
-   LeetCode / Baekjoon 연동
-   Jira / Notion / Slack 연동
-   팀 매칭
-   기업용 개발자 평가
-   AI Career Simulation

------------------------------------------------------------------------

# 10. 기대 효과

DevCompass는 GitHub 활동을 단순 분석하는 서비스가 아니라, 개발자의
성장과 커리어를 함께 설계하는 AI 플랫폼이다.

사용자는 자신의 과거를 분석하고, 현재를 진단하며, 미래를 설계할 수 있는
**AI Developer Career Platform**을 경험하게 된다.

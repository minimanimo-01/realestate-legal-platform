# 🚀 GitHub & Vercel 배포 가이드

법무사 협력 부동산/매수인 지원 플랫폼을 GitHub에 업로드하고 Vercel로 배포하는 완벽 가이드입니다.

---

## 📋 목차

1. [프로젝트 다운로드](#1-프로젝트-다운로드)
2. [GitHub 업로드](#2-github-업로드)
3. [Vercel 배포](#3-vercel-배포)
4. [환경변수 설정](#4-환경변수-설정)
5. [커스텀 도메인 연결](#5-커스텀-도메인-연결)
6. [문제 해결](#6-문제-해결)

---

## 1. 프로젝트 다운로드

### Figma Make에서 코드 다운로드

1. **Figma Make 인터페이스에서:**
   - 우측 상단의 "Export" 또는 "Download" 버튼 클릭
   - ZIP 파일로 프로젝트 다운로드

2. **압축 해제:**
   ```bash
   # 다운로드한 ZIP 파일 압축 해제
   unzip lawon-platform.zip
   cd lawon-platform
   ```

### 또는 수동으로 파일 복사

Figma Make에서 직접 다운로드가 안 되는 경우, 각 파일의 코드를 복사하여 로컬에 생성하세요.

---

## 2. GitHub 업로드

### 2-1. GitHub 저장소 생성

1. **GitHub 접속** (https://github.com)
2. 우측 상단 **"+"** 클릭 → **"New repository"**
3. 저장소 정보 입력:
   ```
   Repository name: lawon-platform
   Description: 법무사 협력 부동산/매수인 지원 플랫폼
   Visibility: Private (또는 Public)
   ❌ Add a README file (체크 해제)
   ❌ Add .gitignore (체크 해제)
   ❌ Choose a license (선택하지 않음)
   ```
4. **"Create repository"** 클릭

### 2-2. Git 초기화 및 업로드

```bash
# 1. 프로젝트 디렉토리로 이동
cd lawon-platform

# 2. Git 초기화
git init

# 3. 모든 파일 추가
git add .

# 4. 첫 커밋
git commit -m "Initial commit: 법무사 협력 부동산 플랫폼"

# 5. 기본 브랜치를 main으로 설정
git branch -M main

# 6. GitHub 원격 저장소 연결 (본인의 GitHub 계정명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/lawon-platform.git

# 7. GitHub에 푸시
git push -u origin main
```

**주의:** `YOUR_USERNAME`을 본인의 GitHub 사용자명으로 변경하세요!

### 2-3. GitHub 인증

푸시 시 인증 요구되면:

**Option 1: Personal Access Token (권장)**
```bash
# GitHub에서 Personal Access Token 생성
# Settings → Developer settings → Personal access tokens → Tokens (classic)
# "Generate new token" → repo 권한 선택 → 복사

# Git 자격 증명 입력 시
Username: YOUR_GITHUB_USERNAME
Password: YOUR_PERSONAL_ACCESS_TOKEN (위에서 복사한 토큰)
```

**Option 2: SSH Key**
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 키를 GitHub에 추가
# Settings → SSH and GPG keys → New SSH key

# SSH로 원격 저장소 변경
git remote set-url origin git@github.com:YOUR_USERNAME/lawon-platform.git
```

---

## 3. Vercel 배포

### 3-1. Vercel 계정 생성

1. **Vercel 접속** (https://vercel.com)
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (GitHub 계정으로 로그인)
4. Vercel에 GitHub 접근 권한 승인

### 3-2. 프로젝트 배포

1. **Vercel 대시보드** 접속
2. **"Add New..."** → **"Project"** 클릭
3. **"Import Git Repository"** 섹션에서:
   - GitHub 저장소 목록에서 `lawon-platform` 찾기
   - 안 보이면 **"Adjust GitHub App Permissions"** 클릭하여 권한 추가
4. **"Import"** 클릭
5. **Configure Project** 화면에서:
   ```
   Project Name: lawon-platform
   Framework Preset: Vite (자동 감지됨)
   Root Directory: ./ (기본값)
   Build Command: npm run build (자동 설정됨)
   Output Directory: dist (자동 설정됨)
   Install Command: npm install (자동 설정됨)
   ```
6. **환경변수 설정** (다음 섹션 참고)
7. **"Deploy"** 클릭

### 3-3. 배포 완료

- 배포 진행 상황 확인 (약 2-3분 소요)
- ✅ **"Congratulations!"** 메시지 표시되면 배포 완료
- 생성된 URL 확인: `https://lawon-platform.vercel.app` (또는 랜덤 URL)

---

## 4. 환경변수 설정

### 4-1. Supabase 정보 확인

현재 프로젝트의 Supabase 정보:

```
Project ID: czrylhekwmkdlobeuxuh
Supabase URL: https://czrylhekwmkdlobeuxuh.supabase.co
Public Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**전체 Supabase 키 확인 방법:**
1. Supabase 대시보드 접속 (https://supabase.com)
2. 프로젝트 선택
3. **Settings** → **API**
4. 다음 값들을 복사:
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ 절대 노출 금지)

### 4-2. Vercel 환경변수 설정

**방법 1: 웹 인터페이스에서 설정 (권장)**

1. Vercel 프로젝트 대시보드
2. **"Settings"** 탭 클릭
3. 좌측 메뉴에서 **"Environment Variables"** 클릭
4. 다음 환경변수 추가:

```env
Name: VITE_SUPABASE_PROJECT_ID
Value: czrylhekwmkdlobeuxuh
Environment: Production, Preview, Development (모두 체크)
---
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (전체 키)
Environment: Production, Preview, Development (모두 체크)
---
Name: VITE_SUPABASE_URL
Value: https://czrylhekwmkdlobeuxuh.supabase.co
Environment: Production, Preview, Development (모두 체크)
---
Name: VITE_SUPABASE_SERVICE_ROLE_KEY
Value: (Supabase에서 복사한 service_role key)
Environment: Production, Preview, Development (모두 체크)
```

5. 각 환경변수 추가 후 **"Save"** 클릭

**방법 2: Vercel CLI로 설정**

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 환경변수 추가
vercel env add VITE_SUPABASE_PROJECT_ID
# 값 입력: czrylhekwmkdlobeuxuh
# Environment 선택: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# 값 입력: (전체 키)

vercel env add VITE_SUPABASE_URL
# 값 입력: https://czrylhekwmkdlobeuxuh.supabase.co

vercel env add VITE_SUPABASE_SERVICE_ROLE_KEY
# 값 입력: (service_role key)
```

### 4-3. 재배포

환경변수 추가 후 재배포:

1. **Vercel 대시보드** → **"Deployments"** 탭
2. 최신 배포 항목의 **"⋯"** 클릭 → **"Redeploy"**
3. **"Redeploy"** 버튼 클릭

또는 GitHub에 새 커밋 푸시:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## 5. 커스텀 도메인 연결

### 5-1. 도메인 구매

추천 도메인: `lawon.kr`, `homelaw.kr`, `daonlaw.kr`

**구매처:**
- 가비아 (gabia.com) - 국내 도메인
- Namecheap (namecheap.com) - 국제 도메인

### 5-2. Vercel에 도메인 추가

1. **Vercel 프로젝트** → **"Settings"** → **"Domains"**
2. 도메인 입력 (예: `lawon.kr`)
3. **"Add"** 클릭
4. DNS 설정 안내 확인

### 5-3. DNS 설정

**A 레코드 방식:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME 방식:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**가비아 예시:**
1. 가비아 로그인 → **"My가비아"**
2. **"도메인"** → 구매한 도메인 선택
3. **"관리"** → **"DNS 정보"** → **"설정"**
4. 위 A 레코드 및 CNAME 추가
5. **"적용"** 클릭

### 5-4. SSL 인증서

- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- DNS 전파 완료 후 약 10분~1시간 소요
- `https://lawon.kr` 접속 가능

---

## 6. 문제 해결

### ❌ 빌드 실패 (Build Failed)

**원인:** 패키지 설치 오류 또는 TypeScript 에러

**해결:**
```bash
# 로컬에서 빌드 테스트
npm install
npm run build

# 에러 메시지 확인 후 수정
# 수정 후 커밋 & 푸시
git add .
git commit -m "Fix build errors"
git push
```

### ❌ 환경변수 인식 안 됨

**원인:** 환경변수 이름 오타 또는 재배포 필요

**해결:**
1. Vercel 대시보드 → Settings → Environment Variables
2. 변수 이름 확인 (`VITE_` 접두사 필수)
3. 재배포 실행

### ❌ Supabase 연결 실패

**원인:** Service Role Key 누락 또는 오타

**해결:**
1. Supabase 대시보드에서 키 재확인
2. Vercel 환경변수에 정확히 입력
3. 재배포

### ❌ 도메인 연결 안 됨

**원인:** DNS 전파 미완료

**해결:**
1. DNS 전파 확인: https://dnschecker.org
2. 24~48시간 대기
3. 가비아 DNS 설정 재확인

### ❌ 404 에러 (페이지 없음)

**원인:** React Router 설정 문제

**해결:**
- `vercel.json` 파일의 rewrites 설정 확인
- 이미 포함되어 있으므로 재배포만 실행

---

## 🎯 배포 체크리스트

배포 전 확인 사항:

- [ ] GitHub 저장소 생성 완료
- [ ] 모든 파일 업로드 완료
- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] 프로젝트 Import 완료
- [ ] 환경변수 4개 모두 설정
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_SERVICE_ROLE_KEY`
- [ ] 첫 배포 성공
- [ ] 웹사이트 접속 테스트
- [ ] 로그인 기능 테스트
- [ ] (선택) 커스텀 도메인 연결

---

## 📞 추가 지원

### Vercel 공식 문서
- https://vercel.com/docs

### Supabase 공식 문서
- https://supabase.com/docs

### 문제 발생 시
1. Vercel 배포 로그 확인
2. 브라우저 콘솔 에러 확인 (F12)
3. GitHub Issues에 문의

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 접속 가능한 웹사이트가 되었습니다.

**배포된 URL:**
- Vercel 기본 URL: `https://lawon-platform.vercel.app`
- 커스텀 도메인 (설정 시): `https://lawon.kr`

**자동 배포 시스템:**
- GitHub에 코드 푸시 → Vercel 자동 배포
- `main` 브랜치 푸시 → Production 배포
- 다른 브랜치 푸시 → Preview 배포

**성능 최적화:**
- 자동 CDN 배포 (전 세계 엣지 서버)
- 자동 이미지 최적화
- HTTP/2 및 Brotli 압축
- 무료 SSL 인증서

즐거운 서비스 운영 되세요! 🚀

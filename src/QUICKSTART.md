# ⚡ 빠른 시작 가이드

5분 안에 GitHub 업로드와 Vercel 배포를 완료하세요!

---

## 🎯 한눈에 보기

```
로컬 프로젝트 → GitHub → Vercel → 배포 완료 ✅
   (3분)      (1분)    (1분)
```

---

## 📦 Step 1: GitHub 업로드 (3분)

### 1-1. 터미널 열기

프로젝트 폴더에서 터미널(또는 명령 프롬프트)을 엽니다.

### 1-2. 다음 명령어 복사 & 붙여넣기

```bash
# Git 초기화
git init
git branch -M main

# 파일 추가 및 커밋
git add .
git commit -m "feat: initial commit - real estate legal platform"
```

### 1-3. GitHub 레포지토리 생성

1. https://github.com/new 접속
2. 입력:
   - **Repository name**: `realestate-legal-platform`
   - **Visibility**: Private (또는 Public)
3. ✅ **Create repository** 클릭

### 1-4. 업로드

GitHub에서 보여주는 명령어 중 **"...or push an existing repository from the command line"** 섹션의 명령어를 복사하여 실행:

```bash
git remote add origin https://github.com/YOUR_USERNAME/realestate-legal-platform.git
git push -u origin main
```

**인증 방법:**
- Username: GitHub 유저명
- Password: Personal Access Token ([생성 방법](https://github.com/settings/tokens))

---

## 🚀 Step 2: Vercel 배포 (2분)

### 2-1. Vercel 접속

https://vercel.com/login 접속 후 GitHub 계정으로 로그인

### 2-2. 프로젝트 Import

1. **"Add New"** → **"Project"** 클릭
2. GitHub 저장소 목록에서 **`realestate-legal-platform`** 선택
3. **"Import"** 클릭

### 2-3. 환경변수 설정

**Environment Variables** 섹션에서 다음 추가:

**필수 환경변수 (복사해서 사용하세요):**

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_PROJECT_ID` | `czrylhekwmkdlobeuxuh` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnlsaGVrd21rZGxvYmV1eHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTA2NjYsImV4cCI6MjA4MDY2NjY2Nn0.cAciCMZ_xgpaDOsufLB8osENR2ArRz6_qPUomN7GNDU` |

각 환경변수를 하나씩 추가:
1. Key 입력
2. Value 복사 & 붙여넣기
3. Production, Preview, Development 모두 체크
4. Save 클릭

> 💡 자세한 설명: [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)

### 2-4. 배포

**"Deploy"** 버튼 클릭 → 2분 대기 → 완료! 🎉

---

## ✅ 배포 확인

배포가 완료되면 다음과 같은 URL을 받습니다:

```
https://realestate-legal-platform.vercel.app
```

클릭하여 정상 작동하는지 확인하세요!

---

## 🔄 이후 업데이트 방법

코드를 수정한 후:

```bash
git add .
git commit -m "feat: add new feature"
git push
```

→ Vercel이 **자동으로 재배포**합니다! ✨

---

## 🆘 문제 해결

### GitHub 푸시 실패

```bash
# Personal Access Token 재발급
# https://github.com/settings/tokens
```

### Vercel 빌드 실패

1. Vercel 대시보드에서 에러 로그 확인
2. 환경변수가 올바르게 설정되었는지 확인
3. Supabase URL과 Key가 정확한지 확인

### 페이지가 로드되지 않음

1. 브라우저 콘솔(F12)에서 에러 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. 환경변수가 모두 설정되었는지 확인

---

## 📚 더 자세한 가이드

- 📖 [GITHUB_SETUP.md](./GITHUB_SETUP.md) - 자세한 GitHub 업로드 가이드
- 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 상세한 배포 가이드
- ✅ [CHECKLIST.md](./CHECKLIST.md) - 업로드 전 체크리스트

---

## 🎉 축하합니다!

프로젝트가 성공적으로 배포되었습니다!

**다음 단계:**
- ✅ 관리자 페이지에서 패스워드 설정
- ✅ 법률/제도 안내 작성
- ✅ 신청 서류 업로드
- ✅ 금리 정보 입력

**배포 URL을 고객에게 공유하세요!** 📤
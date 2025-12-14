# 🚀 GitHub 업로드 가이드

이 문서는 프로젝트를 GitHub에 업로드하는 방법을 안내합니다.

---

## 📋 사전 준비

### 1. Git 설치 확인

```bash
git --version
# Git이 설치되어 있지 않다면: https://git-scm.com/downloads
```

### 2. GitHub 계정 생성

- https://github.com 에서 계정 생성 (무료)

---

## 🎯 단계별 업로드 가이드

### Step 1: GitHub 레포지토리 생성

1. **GitHub 웹사이트 접속**
   - https://github.com/new

2. **레포지토리 정보 입력**
   ```
   Repository name: realestate-legal-platform
   Description: 법무사 협력 부동산/매수인 지원 플랫폼
   Visibility: Private (또는 Public)
   
   ❌ Add a README file (체크 해제)
   ❌ Add .gitignore (체크 해제)
   ❌ Choose a license (체크 해제)
   ```

3. **Create repository 클릭**

---

### Step 2: 로컬 Git 초기화

프로젝트 폴더에서 터미널을 열고:

```bash
# Git 초기화
git init

# 현재 브랜치를 main으로 설정
git branch -M main

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "feat: initial commit - real estate legal platform"
```

---

### Step 3: GitHub에 연결 및 푸시

```bash
# GitHub 레포지토리 연결 (YOUR_USERNAME을 본인의 GitHub 유저명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/realestate-legal-platform.git

# 원격 저장소에 푸시
git push -u origin main
```

#### 🔐 인증 방법

**Option 1: HTTPS (추천)**
- 푸시 시 GitHub 유저명과 Personal Access Token 입력
- Personal Access Token 생성: https://github.com/settings/tokens
  1. "Generate new token (classic)" 클릭
  2. Note: "realestate-platform-upload" 입력
  3. Expiration: 90 days (또는 원하는 기간)
  4. Scopes: `repo` 체크
  5. Generate token 클릭
  6. **토큰 복사** (다시 볼 수 없음!)

**Option 2: SSH**
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 키를 GitHub에 등록
# https://github.com/settings/keys

# SSH로 원격 저장소 변경
git remote set-url origin git@github.com:YOUR_USERNAME/realestate-legal-platform.git
```

---

### Step 4: 업로드 확인

1. GitHub 레포지토리 페이지로 이동
   ```
   https://github.com/YOUR_USERNAME/realestate-legal-platform
   ```

2. 파일들이 정상적으로 업로드되었는지 확인

---

## 🔄 이후 변경사항 푸시

코드를 수정한 후:

```bash
# 변경된 파일 확인
git status

# 변경 사항 추가
git add .

# 커밋 (의미있는 메시지 작성)
git commit -m "feat: add new feature"

# 푸시
git push
```

---

## 🌿 브랜치 전략 (선택사항)

### 추천 브랜치 구조

```
main (프로덕션)
  └── develop (개발)
        ├── feature/new-feature (기능 개발)
        └── fix/bug-fix (버그 수정)
```

### 브랜치 사용법

```bash
# develop 브랜치 생성
git checkout -b develop

# feature 브랜치 생성
git checkout -b feature/buyer-calculator

# 작업 후 develop에 병합
git checkout develop
git merge feature/buyer-calculator

# develop을 main에 병합 (배포 준비 완료 시)
git checkout main
git merge develop
git push
```

---

## 🔒 환경변수 보안

**⚠️ 중요:** `.env` 파일은 절대 GitHub에 올리지 마세요!

### 확인 사항

1. `.gitignore` 파일에 다음이 포함되어 있는지 확인:
   ```
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

2. `.env.example` 파일만 업로드되었는지 확인

3. 실수로 `.env` 파일을 푸시한 경우:
   ```bash
   # 즉시 GitHub Secrets 교체 필요!
   # Supabase 키를 재생성하세요
   ```

---

## 🚀 Vercel 배포 연결

GitHub에 업로드 후 Vercel 배포:

1. **Vercel 접속**
   - https://vercel.com

2. **Import Project**
   - "Add New" → "Project" 클릭
   - GitHub 계정 연결
   - `realestate-legal-platform` 선택

3. **환경변수 설정**
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Deploy 클릭**

5. **자동 배포 설정**
   - main 브랜치에 푸시하면 자동으로 배포됨
   - PR 생성 시 미리보기 배포 자동 생성

---

## 📊 GitHub Actions CI/CD

프로젝트에는 CI/CD 워크플로우가 포함되어 있습니다 (`.github/workflows/ci.yml`):

### 자동화된 작업

- ✅ TypeScript 타입 체크
- ✅ 빌드 테스트
- ✅ Node.js 18, 20 버전 호환성 체크

### GitHub Secrets 설정

1. GitHub 레포지토리 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 다음 시크릿 추가:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```

---

## 🆘 문제 해결

### "Permission denied" 오류

```bash
# SSH 키가 올바르게 설정되었는지 확인
ssh -T git@github.com

# HTTPS를 사용하거나 Personal Access Token 재발급
```

### "Push rejected" 오류

```bash
# 원격 저장소의 변경사항을 먼저 가져오기
git pull origin main --rebase
git push
```

### 대용량 파일 업로드 실패

```bash
# 100MB 이상 파일은 Git LFS 사용
git lfs install
git lfs track "*.zip"
git add .gitattributes
git commit -m "chore: add git lfs"
```

---

## 📚 추가 자료

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub 가이드](https://guides.github.com/)
- [Vercel 배포 가이드](https://vercel.com/docs)

---

**축하합니다! 🎉 GitHub 업로드가 완료되었습니다!**

다음 단계: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하여 Vercel에 배포하세요.

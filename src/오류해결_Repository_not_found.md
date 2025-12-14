# 🆘 "Repository not found" 오류 해결

## ⚠️ 발생한 오류

```
remote: Repository not found.
fatal: repository 'https://github.com/minimanimo-01/realestate-legal-platform.git /' not found
```

---

## 🔍 문제 원인 2가지

### 원인 1: URL 끝에 공백 또는 슬래시(/) 포함 ⚠️

에러 메시지를 보면: `...platform.git /` ← 끝에 **공백과 슬래시**가 있습니다!

올바른 URL: `...platform.git` (끝에 아무것도 없어야 함)

### 원인 2: GitHub에 레포지토리를 아직 생성하지 않음

먼저 GitHub 웹사이트에서 레포지토리를 만들어야 합니다.

---

## ✅ 해결 방법 (순서대로 실행)

### 1단계: GitHub 레포지토리가 있는지 확인

브라우저에서 접속:
```
https://github.com/minimanimo-01/realestate-legal-platform
```

**결과:**
- ✅ 페이지가 보임 → 레포지토리 있음 → **2단계**로 이동
- ❌ 404 에러 → 레포지토리 없음 → **아래 "레포지토리 생성하기"** 실행

---

### 2단계: 잘못된 원격 저장소 제거

터미널에서 실행:

```bash
git remote remove origin
```

---

### 3단계: 올바른 URL로 다시 연결

터미널에서 실행 (⚠️ URL 끝에 공백/슬래시 없이!):

```bash
git remote add origin https://github.com/minimanimo-01/realestate-legal-platform.git
```

**주의:**
- ✅ `...platform.git` (끝!)
- ❌ `...platform.git /` (공백 + 슬래시 X)
- ❌ `...platform.git/` (슬래시 X)

---

### 4단계: 다시 업로드

```bash
git push -u origin main
```

---

## 🆕 레포지토리가 없다면? (404 에러인 경우)

### GitHub에서 레포지토리 생성하기

1. **https://github.com/new** 접속

2. 입력:
   ```
   Repository name: realestate-legal-platform
   Description: (선택사항)
   Visibility: Private 또는 Public 선택
   ```

3. ⚠️ **중요:** 
   - **"Add a README file"** 체크 해제
   - **"Add .gitignore"** 선택 안 함
   - **"Choose a license"** 선택 안 함
   
   (아무것도 체크하지 마세요! 빈 레포지토리로 만들어야 합니다)

4. **"Create repository"** 클릭

5. 생성 후 → **위의 2단계부터** 다시 실행

---

## 🎯 전체 명령어 정리 (한 번에 복사)

```bash
# 1. 잘못된 원격 저장소 제거
git remote remove origin

# 2. 올바른 URL로 다시 연결 (⚠️ 끝에 공백/슬래시 없이!)
git remote add origin https://github.com/minimanimo-01/realestate-legal-platform.git

# 3. 업로드
git push -u origin main
```

---

## 🔐 인증 요구 시

Username과 Password를 물어보면:

```
Username: minimanimo-01
Password: (Personal Access Token)
```

### Personal Access Token이 없다면?

1. https://github.com/settings/tokens 접속
2. **"Generate new token"** → **"Generate new token (classic)"**
3. 설정:
   - Note: `vercel-deploy`
   - Expiration: `No expiration` (또는 원하는 기간)
   - ✅ **repo** (전체 체크)
4. **"Generate token"** 클릭
5. 생성된 토큰 복사 (⚠️ 다시 볼 수 없으니 저장!)
6. Password에 붙여넣기

---

## ✅ 성공 메시지

다음과 같은 메시지가 나오면 성공!

```
Enumerating objects: 100, done.
Counting objects: 100% (100/100), done.
Delta compression using up to 8 threads
Compressing objects: 100% (85/85), done.
Writing objects: 100% (100/100), 123.45 KiB | 12.34 MiB/s, done.
Total 100 (delta 20), reused 0 (delta 0)
To https://github.com/minimanimo-01/realestate-legal-platform.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🆘 여전히 오류가 나면?

### 오류 1: "Permission denied"
→ Personal Access Token을 다시 생성하고 사용

### 오류 2: "Authentication failed"
→ Username과 Token을 정확히 입력했는지 확인

### 오류 3: "remote contains work that you do not have"
→ 터미널에서 실행:
```bash
git push -u origin main --force
```

---

## 📝 체크리스트

- [ ] GitHub에서 레포지토리 생성 확인 (`https://github.com/minimanimo-01/realestate-legal-platform`)
- [ ] URL 끝에 공백/슬래시 없음 확인
- [ ] `git remote remove origin` 실행
- [ ] `git remote add origin` 올바른 URL로 실행
- [ ] `git push -u origin main` 실행
- [ ] Personal Access Token 준비

---

**다시 시도해보세요!** 🚀

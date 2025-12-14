# 🔐 Personal Access Token 생성 - 단계별 가이드

## 📍 403 오류 해결을 위한 필수 작업

GitHub은 2021년부터 패스워드 인증을 중단했습니다.
이제 **Personal Access Token**을 사용해야 합니다!

---

## ⚡ 빠른 시작 (5분 완성)

### 1단계: Token 생성 페이지 이동

**https://github.com/settings/tokens** 접속

또는

1. GitHub 로그인
2. 우측 상단 프로필 사진 클릭
3. **Settings** 클릭
4. 좌측 메뉴 맨 아래 **Developer settings** 클릭
5. **Personal access tokens** → **Tokens (classic)** 클릭

---

### 2단계: 새 Token 생성

1. **"Generate new token"** 버튼 클릭
2. **"Generate new token (classic)"** 선택 (classic 선택 중요!)

---

### 3단계: Token 설정

#### 📝 Note (토큰 이름)
```
vercel-deploy
```
(또는 원하는 이름)

#### ⏰ Expiration (만료 기간)
```
No expiration (만료 없음)
```
또는 원하는 기간 선택

#### ✅ Select scopes (권한 선택)

**반드시 체크해야 할 항목:**

```
✅ repo (전체 선택)
   ├─ ✅ repo:status
   ├─ ✅ repo_deployment
   ├─ ✅ public_repo
   ├─ ✅ repo:invite
   └─ ✅ security_events
```

> 💡 **repo** 옆 체크박스를 클릭하면 하위 항목이 모두 체크됩니다!

**나머지 항목은 체크 안 해도 됩니다.**

---

### 4단계: Token 생성 및 복사

1. 페이지 맨 아래로 스크롤
2. **"Generate token"** 버튼 클릭 (초록색)
3. 생성된 Token이 표시됩니다:

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. **복사 버튼** 클릭 또는 마우스로 드래그해서 복사

---

## ⚠️ 매우 중요!

### Token을 안전하게 보관하세요!

- 📋 메모장에 복사해서 저장
- 💾 안전한 파일에 저장
- 🔒 다른 사람과 공유하지 마세요

**이 Token은 다시 볼 수 없습니다!**
페이지를 나가면 Token을 다시 확인할 수 없으므로 반드시 지금 복사하세요.

---

## 🔧 Windows 자격 증명 삭제 (중요!)

403 오류를 해결하려면 기존 자격 증명을 삭제해야 합니다.

### Windows 사용자:

1. **Windows 검색창** (Win + S)에 **"자격 증명 관리자"** 입력
2. **자격 증명 관리자** 클릭
3. **"Windows 자격 증명"** 탭 클릭
4. 아래로 스크롤해서 다음 항목 찾기:
   - `git:https://github.com`
   - `github.com`
   
5. 찾으면 **▼** 클릭 → **"제거"** 클릭

---

### Mac 사용자:

터미널에서 실행:

```bash
git credential-osxkeychain erase
host=github.com
protocol=https
```

Enter 두 번 누르기

---

## 🚀 Token 사용하기

### 터미널에서:

```bash
git push -u origin main
```

인증 요구 시:

```
Username for 'https://github.com': minimanimo-01
Password for 'https://minimanimo-01@github.com': 
```

**Password에 복사한 Token 붙여넣기!**

> 💡 붙여넣을 때 화면에 아무것도 표시되지 않지만 정상입니다!
> 그냥 붙여넣고 Enter를 누르세요.

---

## ✅ 성공 확인

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

## 🆘 문제 해결

### "Bad credentials" 오류
→ Token을 잘못 복사했습니다. 다시 생성하세요.

### 여전히 403 오류
→ 자격 증명 관리자에서 GitHub 항목을 완전히 삭제했는지 확인

### Token을 잃어버렸어요
→ 새로운 Token을 생성하세요. 이전 Token은 삭제하고 새로 만드세요.

### "repo" 권한이 필요하다는 오류
→ Token 생성 시 "repo" 체크박스를 선택했는지 확인

---

## 💻 더 쉬운 방법: GitHub Desktop

터미널이 어렵다면 **GitHub Desktop**을 사용하세요!

1. https://desktop.github.com 다운로드
2. 설치 후 GitHub 로그인
3. 프로젝트 추가
4. "Publish repository" 클릭

**Token 입력 필요 없음!** 자동으로 처리됩니다.

---

## 📋 체크리스트

- [ ] https://github.com/settings/tokens 접속
- [ ] "Generate new token (classic)" 클릭
- [ ] Note: `vercel-deploy` 입력
- [ ] Expiration: `No expiration` 선택
- [ ] ✅ **repo** 전체 체크
- [ ] "Generate token" 클릭
- [ ] Token 복사 및 저장
- [ ] 자격 증명 관리자에서 GitHub 항목 삭제
- [ ] `git push -u origin main` 실행
- [ ] Password에 Token 붙여넣기

---

## 🎯 요약

1. **Token 생성**: https://github.com/settings/tokens
2. **repo 권한** 체크
3. **Token 복사** 및 저장
4. **자격 증명 삭제** (Windows: 자격 증명 관리자)
5. **git push** 실행
6. **Password에 Token** 입력

---

**준비되셨나요?** 위 단계를 따라하면 5분 안에 완료됩니다! 🚀

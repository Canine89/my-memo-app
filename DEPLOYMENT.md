# 🚀 배포 가이드

## 1. Supabase 데이터베이스 설정

### 1.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 가입/로그인
2. "New Project" 클릭
3. 프로젝트 이름: `memo-app`
4. 데이터베이스 비밀번호 설정
5. 리전 선택 (가장 가까운 지역)

### 1.2 데이터베이스 연결 정보 확인
1. 프로젝트 대시보드에서 "Settings" → "Database" 이동
2. "Connection string" 섹션에서 "URI" 복사
3. 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## 2. Vercel 배포

### 2.1 GitHub 저장소 생성
1. GitHub에서 새 저장소 생성
2. 로컬 코드 푸시:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[USERNAME]/memo-app.git
git push -u origin main
```

### 2.2 Vercel 배포
1. [Vercel](https://vercel.com)에 가입/로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. "Import" 클릭

### 2.3 환경 변수 설정
Vercel 대시보드에서 "Settings" → "Environment Variables"에서 다음 변수들 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Supabase에서 복사한 PostgreSQL URL | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | Production |
| `NEXTAUTH_SECRET` | 랜덤 문자열 (32자 이상) | Production, Preview, Development |

**NEXTAUTH_SECRET 생성 방법:**
```bash
openssl rand -base64 32
```

### 2.4 배포 완료
1. "Deploy" 클릭
2. 배포 완료 후 도메인 확인
3. 데이터베이스 마이그레이션 실행

## 3. 데이터베이스 마이그레이션

### 3.1 로컬에서 마이그레이션 실행
```bash
# 환경 변수 설정
export DATABASE_URL="your-supabase-database-url"

# 마이그레이션 실행
npx prisma migrate deploy
```

### 3.2 Vercel에서 마이그레이션 실행 (선택사항)
Vercel 대시보드에서 "Functions" → "Deploy Hooks"에서 마이그레이션 실행

## 4. 배포 확인

### 4.1 기본 기능 테스트
1. 회원가입 페이지 접속
2. 새 계정 생성
3. 로그인 테스트
4. 메모 생성/수정/삭제 테스트

### 4.2 데이터베이스 확인
```bash
npx prisma studio
```

## 5. 추가 설정

### 5.1 커스텀 도메인 (선택사항)
1. Vercel 대시보드에서 "Settings" → "Domains"
2. 원하는 도메인 추가
3. DNS 설정 완료

### 5.2 모니터링 설정
1. Vercel Analytics 활성화
2. Supabase 대시보드에서 사용량 모니터링

## 6. 문제 해결

### 6.1 일반적인 문제들
- **데이터베이스 연결 오류**: DATABASE_URL 확인
- **인증 오류**: NEXTAUTH_SECRET 확인
- **빌드 오류**: Prisma 클라이언트 재생성 필요

### 6.2 로그 확인
- Vercel 대시보드에서 "Functions" 탭에서 로그 확인
- Supabase 대시보드에서 "Logs" 확인

## 7. 비용

### 7.1 Vercel
- **Hobby Plan**: 무료 (개인 프로젝트용)
- **Pro Plan**: $20/월 (상업적 사용)

### 7.2 Supabase
- **Free Tier**: 무료 (500MB 데이터베이스, 50MB 파일 저장)
- **Pro Plan**: $25/월 (8GB 데이터베이스, 100GB 파일 저장)

## 8. 보안 고려사항

1. **환경 변수 보안**: 절대 코드에 하드코딩하지 말 것
2. **데이터베이스 접근**: Supabase RLS(Row Level Security) 설정
3. **HTTPS**: Vercel에서 자동 제공
4. **정기 업데이트**: 의존성 패키지 정기 업데이트

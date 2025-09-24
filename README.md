# 메모 앱

Next.js, Prisma, NextAuth.js를 사용한 개인 메모 관리 애플리케이션입니다.

## 기능

- 사용자 회원가입/로그인
- 개인 메모 생성/수정/삭제
- 메모 검색
- 다크/라이트 테마
- 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Lucide React

## 로컬 개발

1. 저장소 클론
```bash
git clone <repository-url>
cd memo-app-new
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

4. 데이터베이스 설정
```bash
npx prisma migrate dev
npx prisma generate
```

5. 개발 서버 실행
```bash
npm run dev
```

## 배포

### Vercel + Supabase

1. **Supabase 프로젝트 생성**
   - [Supabase](https://supabase.com)에서 새 프로젝트 생성
   - 데이터베이스 URL 복사

2. **Vercel 배포**
   - [Vercel](https://vercel.com)에서 GitHub 저장소 연결
   - 환경 변수 설정:
     - `DATABASE_URL`: Supabase 데이터베이스 URL
     - `NEXTAUTH_URL`: 배포된 도메인
     - `NEXTAUTH_SECRET`: 랜덤 시크릿 키

3. **데이터베이스 마이그레이션**
   ```bash
   npx prisma migrate deploy
   ```

## 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 데이터베이스 URL | `postgresql://...` |
| `NEXTAUTH_URL` | 애플리케이션 URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth.js 시크릿 키 | `your-secret-key` |

## 라이선스

MIT

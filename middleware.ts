import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // 인증이 필요한 페이지에 대한 추가 로직이 있다면 여기에 작성
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 루트 경로와 인증 관련 페이지는 인증이 필요
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/memos")) {
          return !!token
        }
        // 인증 페이지는 토큰이 없어도 접근 가능
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/api/memos/:path*",
  ]
}

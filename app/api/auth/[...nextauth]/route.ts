import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// 에러 핸들링을 위한 추가 설정
export const config = {
  api: {
    bodyParser: false,
  },
}

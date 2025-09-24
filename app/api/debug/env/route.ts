import { NextResponse } from 'next/server'

export async function GET() {
  // 프로덕션에서는 이 API를 비활성화하는 것이 좋습니다
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
  })
}

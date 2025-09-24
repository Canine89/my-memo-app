import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: '제목은 필수입니다.' },
        { status: 400 }
      )
    }

    const memo = await prisma.memo.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        title,
        content: content || '',
        updatedAt: new Date()
      }
    })

    if (memo.count === 0) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const updatedMemo = await prisma.memo.findUnique({
      where: { id: params.id }
    })

    return NextResponse.json(updatedMemo)
  } catch (error) {
    console.error('메모 수정 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const memo = await prisma.memo.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (memo.count === 0) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '메모가 삭제되었습니다.' })
  } catch (error) {
    console.error('메모 삭제 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

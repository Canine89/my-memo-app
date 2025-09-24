"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Save, Trash2, Moon, Sun, LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"

interface Memo {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function MemoApp() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [memos, setMemos] = useState<Memo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  // 클라이언트에서만 실행되도록 mounted 상태 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [mounted, status, router])

  // 메모 데이터 로드
  const loadMemos = async () => {
    if (!session?.user?.id) return
    
    try {
      setIsLoading(true)
      const response = await fetch("/api/memos")
      if (response.ok) {
        const data = await response.json()
        setMemos(data)
      }
    } catch (error) {
      console.error("메모 로드 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 세션이 로드되면 메모 데이터 로드
  useEffect(() => {
    if (mounted && session?.user?.id) {
      loadMemos()
    }
  }, [mounted, session?.user?.id])

  const createNewMemo = async () => {
    try {
      const response = await fetch("/api/memos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "새 메모",
          content: "",
        }),
      })

      if (response.ok) {
        const newMemo = await response.json()
        setMemos([newMemo, ...memos])
        setEditingId(newMemo.id)
        setEditTitle(newMemo.title)
        setEditContent(newMemo.content)
      }
    } catch (error) {
      console.error("메모 생성 오류:", error)
    }
  }

  const startEditing = (memo: Memo) => {
    setEditingId(memo.id)
    setEditTitle(memo.title)
    setEditContent(memo.content)
  }

  const saveMemo = async () => {
    if (!editingId) return

    try {
      const response = await fetch(`/api/memos/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })

      if (response.ok) {
        const updatedMemo = await response.json()
        setMemos(
          memos.map((memo) =>
            memo.id === editingId ? updatedMemo : memo,
          ),
        )
        setEditingId(null)
        setEditTitle("")
        setEditContent("")
      }
    } catch (error) {
      console.error("메모 저장 오류:", error)
    }
  }

  const deleteMemo = async (id: string) => {
    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMemos(memos.filter((memo) => memo.id !== id))
        if (editingId === id) {
          setEditingId(null)
          setEditTitle("")
          setEditContent("")
        }
      }
    } catch (error) {
      console.error("메모 삭제 오류:", error)
    }
  }

  const filteredMemos = memos.filter(
    (memo) =>
      memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 클라이언트에서 마운트되지 않았거나 로딩 중이면 로딩 상태 표시
  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">메모 앱</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {session?.user?.name || session?.user?.email}
              </div>
              {mounted && (
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
              <Button onClick={createNewMemo} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                <Plus className="h-4 w-4" />새 메모
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="메모 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Memos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemos.map((memo) => (
            <Card key={memo.id} className="h-fit bg-sidebar-accent">
              <CardHeader className="pb-3">
                {editingId === memo.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-semibold"
                    placeholder="메모 제목"
                  />
                ) : (
                  <h3 className="font-semibold text-card-foreground text-balance">{memo.title}</h3>
                )}
              </CardHeader>
              <CardContent>
                {editingId === memo.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="메모 내용을 입력하세요..."
                      className="min-h-[120px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveMemo} size="sm" className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Save className="h-3 w-3" />
                        저장
                      </Button>
                      <Button
                        onClick={() => deleteMemo(memo.id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        삭제
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {memo.content || "내용이 없습니다."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(memo.updatedAt).toLocaleDateString("ko-KR")}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEditing(memo)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 border-border hover:bg-accent"
                        >
                          <Edit className="h-3 w-3" />
                          수정
                        </Button>
                        <Button
                          onClick={() => deleteMemo(memo.id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMemos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "검색 결과가 없습니다." : "메모가 없습니다. 새 메모를 만들어보세요!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

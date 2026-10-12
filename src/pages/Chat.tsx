import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft, MoreHorizontal, Phone, FileText, PlusCircle, Smile, Send } from "lucide-react"
import { Avatar } from "@/components/common"
import { CHAT_THREADS, CONVERSATIONS, type ChatMsg } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const AUTO_REPLIES = [
  "好的，收到！",
  "没问题～",
  "可以的，那就这么定！",
  "我看看时间，稍后回复你",
  "嗯嗯，明天见！",
]

export default function Chat() {
  const { id } = useParams()
  const conv = CONVERSATIONS.find((c) => c.id === id) ?? CONVERSATIONS[0]
  const { markConvRead } = useStore()
  const [msgs, setMsgs] = useState<ChatMsg[]>(CHAT_THREADS[conv.id] ?? [])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    markConvRead(conv.id)
  }, [conv.id, markConvRead])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setInput("")
    setMsgs((m) => [...m, { id: `u-${Date.now()}`, from: "me", kind: "text", text }])
    // 模拟对方回复
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
      setMsgs((m) => [...m, { id: `a-${Date.now()}`, from: "other", kind: "text", text: reply }])
    }, 900)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      {/* 聊天顶栏 */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <Link
          to="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Avatar name={conv.name} color={conv.color} size={38} />
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">{conv.name}</p>
          <p className="text-[11px] text-hc-600">{conv.online ? "在线" : "离线"}</p>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
          <Phone className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* 消息区 */}
      <div className="min-h-[420px] space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        {msgs.map((m) => {
          if (m.from === "system")
            return (
              <p key={m.id} className="text-center text-xs text-gray-400">
                —— {m.text} ——
              </p>
            )
          if (m.kind === "file")
            return (
              <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div className="flex max-w-[75%] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{m.fileName}</p>
                    <p className="text-[11px] text-gray-400">点击下载 · 12.6 MB</p>
                  </div>
                </div>
              </div>
            )
          if (m.kind === "card")
            return (
              <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div className="w-64 overflow-hidden rounded-2xl border border-hc-200 bg-white shadow-sm">
                  <div className="bg-hc-50 p-3">
                    <p className="text-sm font-bold text-ink">{m.card?.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.card?.meta}</p>
                    <p className="mt-1 text-xs font-bold text-hc-600">才分 {m.card?.price} /课时</p>
                  </div>
                  <Link
                    to="/me"
                    className="block bg-hc-500 py-2 text-center text-xs font-bold text-white hover:bg-hc-600"
                  >
                    查看预约
                  </Link>
                </div>
              </div>
            )
          return (
            <div key={m.id} className={cn("flex gap-2.5", m.from === "me" && "flex-row-reverse")}>
              <Avatar
                name={m.from === "me" ? "我" : conv.name}
                color={m.from === "me" ? "#3D8AF7" : conv.color}
                size={34}
              />
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                  m.from === "me"
                    ? "rounded-tr-sm bg-hc-500 text-white"
                    : "rounded-tl-sm border border-gray-100 bg-white text-ink",
                )}
              >
                {m.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 输入栏 */}
      <div className="sticky bottom-4 z-20 mt-4 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white/95 p-2.5 shadow-xl backdrop-blur">
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
          <PlusCircle className="h-5 w-5" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="发消息聊聊课程安排…"
          className="h-10 flex-1 rounded-full bg-gray-100 px-4 text-sm outline-none transition-colors focus:bg-hc-50"
        />
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
          <Smile className="h-5 w-5" />
        </button>
        <button
          onClick={send}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hc-500 text-white shadow-md shadow-hc-500/30 transition-all hover:bg-hc-600 active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

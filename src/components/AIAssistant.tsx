import { useEffect, useRef, useState } from "react"
import {
  Bot,
  X,
  Send,
  Loader2,
  KeyRound,
  Sparkles,
  CircleAlert,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

const KEY_STORAGE = "huancai-deepseek-key"
// 站长共享的 DeepSeek Key（内置默认，访问者开箱即用；可在面板里换成自己的）
const SHARED_KEY = "sk-5f43862aea7a4acd963350f26dc0769e"

const QUICK_QUESTIONS = [
  "怎么赚才分？",
  "如何发布一门技能？",
  "才分不够支付怎么办？",
  "技能认证怎么申请？",
  "怎么找到身边的达人？",
]

const SYSTEM_PROMPT = `你是「换才」校园技能互换平台的 AI 助手，名字叫「小才」。平台以「交换、连接、成长」为核心理念，是大学生之间互换技能的平台。

平台规则（回答依据）：
- 货币是「才分」：教别人技能赚才分，学技能花才分；才分仅限平台内使用，不可提现转账，12 个月滚动有效。
- 赚才分途径：完成授课、每日签到 +5、完善技能档案 +20、邀请好友 +15、学生认证 +60、优质评价 +10、兑换专区活动。
- 发布技能：在「发布技能」页选择「我能教 / 我想学」，填名称、分类（设计/编程/语言/办公/生活/音乐）、描述、授课方式（线上/线下/均可）、价格（才分/课时），可勾选「支持技能互换」用技能免费交换。
- 预约下单：技能详情页选时间 → 才分支付（平台担保托管，课后双方确认才划转）或技能互换；才分不足时先去做任务赚才分。
- 线上课在「在线教室」进行，有视频通话和互动白板；下课后记得评价，好评双方都有才分奖励。
- 技能认证：满足课时学习时长后可申请测评（AI 测评 + 人工复核），通过颁发区块链存证电子证书。
- 安全：平台要求校园实名认证（学生证 + 学信网核验），交易争议 48 小时内平台仲裁。

回答要求：语气亲切活泼，像同学帮忙；简洁有条理，多用短句和列表；涉及才分数字要准确；不要编造平台没有的功能；结尾可以适当追问一句是否需要更详细的步骤。`

interface Msg {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  // 用户自定义 Key（存在自己浏览器）；为空时使用站长共享 Key
  const [customKey, setCustomKey] = useState<string>(() =>
    localStorage.getItem(KEY_STORAGE) ?? "",
  )
  const [keyInput, setKeyInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const apiKey = customKey.trim() || SHARED_KEY
  const usingShared = !customKey.trim()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [msgs, loading, open])

  const saveCustomKey = () => {
    const k = keyInput.trim()
    if (!k) return
    localStorage.setItem(KEY_STORAGE, k)
    setCustomKey(k)
    setKeyInput("")
    setShowSettings(false)
    setError(null)
  }

  const resetToShared = () => {
    localStorage.removeItem(KEY_STORAGE)
    setCustomKey("")
    setKeyInput("")
    setShowSettings(false)
    setError(null)
  }

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput("")
    setError(null)
    const next: Msg[] = [...msgs, { role: "user", content }]
    setMsgs(next)
    setLoading(true)
    try {
      const resp = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      })
      if (resp.status === 401) {
        setError("API Key 无效或已过期，可在右上角设置中换成自己的 Key。")
        setMsgs((m) => m.slice(0, -1))
        return
      }
      if (!resp.ok) {
        setError(`请求失败（HTTP ${resp.status}），请稍后再试。`)
        setMsgs((m) => m.slice(0, -1))
        return
      }
      const data = await resp.json()
      const reply = data.choices?.[0]?.message?.content
      if (!reply) {
        setError("DeepSeek 没有返回内容，请换个问法试试。")
        setMsgs((m) => m.slice(0, -1))
        return
      }
      setMsgs((m) => [...m, { role: "assistant", content: reply }])
    } catch {
      setError("网络请求失败：请检查网络连接，或确认浏览器没有拦截跨域请求。")
      setMsgs((m) => m.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-hc-400 to-hc-600 text-white shadow-xl shadow-hc-500/40 transition-transform hover:scale-105 active:scale-95",
          open && "from-gray-500 to-gray-700 shadow-gray-500/40",
        )}
        title="AI 助手"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hcyellow-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-hcyellow-400" />
          </span>
        )}
      </button>

      {/* 对话面板 */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[540px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:right-6">
          {/* 头部 */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-hc-500 to-hc-600 px-4 py-3.5 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Bot className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-bold">小才 · AI 助手</h3>
              <p className="text-[11px] text-white/70">DeepSeek 驱动 · 站长共享额度</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              title="API Key 设置"
            >
              <KeyRound className="h-4 w-4" />
            </button>
          </div>

          {/* Key 设置条 */}
          {showSettings && (
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <Sparkles className="h-3.5 w-3.5 text-hcyellow-500" />
                {usingShared
                  ? "当前使用站长共享的 Key，无需配置，直接用。"
                  : `当前使用自定义 Key：${apiKey.slice(0, 8)}…${apiKey.slice(-4)}`}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="填自己的 sk- Key（可选）"
                  className="h-9 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none focus:border-hc-400 focus:ring-2 focus:ring-hc-100"
                />
                <button
                  onClick={saveCustomKey}
                  disabled={!keyInput.trim()}
                  className="h-9 shrink-0 rounded-xl bg-hc-500 px-3 text-xs font-bold text-white transition-colors hover:bg-hc-600 disabled:bg-gray-300"
                >
                  保存
                </button>
              </div>
              {!usingShared && (
                <button
                  onClick={resetToShared}
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-hc-700 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  恢复使用站长共享 Key
                </button>
              )}
            </div>
          )}

          {/* 消息区 */}
          <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto bg-gray-50/60 p-4">
            {msgs.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-hc-100 text-hc-600">
                  <Sparkles className="h-7 w-7" />
                </span>
                <p className="mt-3 text-sm font-bold text-ink">你好，我是小才 👋</p>
                <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
                  关于换才的一切都可以问我：赚才分、发技能、预约上课、技能认证……
                </p>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                {m.role === "assistant" && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hc-400 to-hc-600 text-white">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "rounded-tr-sm bg-hc-500 text-white"
                      : "rounded-tl-sm border border-gray-100 bg-white text-ink",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hc-400 to-hc-600 text-white">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-hc-500" />
                  <span className="text-xs text-gray-400">小才思考中…</span>
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-1.5 border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
              <CircleAlert className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          {/* 快捷问题 */}
          {msgs.length === 0 && (
            <div className="flex gap-2 overflow-x-auto border-t border-gray-100 px-4 py-2.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="shrink-0 rounded-full border border-hc-200 bg-hc-50 px-3 py-1.5 text-xs font-medium text-hc-700 transition-colors hover:bg-hc-100"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="问点什么，比如：才分怎么赚？"
              className="h-10 flex-1 rounded-full bg-gray-100 px-4 text-sm outline-none transition-colors focus:bg-hc-50"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hc-500 text-white shadow-md shadow-hc-500/30 transition-all hover:bg-hc-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

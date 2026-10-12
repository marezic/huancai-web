import { Link } from "react-router"
import { CalendarCheck, Bell, Heart, Search } from "lucide-react"
import { Avatar, CertBadge, PageHeader } from "@/components/common"
import { CONVERSATIONS, NOTICE_CARDS } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const CARD_ICONS = {
  booking: CalendarCheck,
  system: Bell,
  social: Heart,
}

export default function Messages() {
  const { readConvs } = useStore()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="消息"
        sub="会话 · 通知 · 未读提醒"
        right={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
        }
      />

      {/* 通知分类卡片 */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {NOTICE_CARDS.map(({ key, label, count, color }) => {
          const Icon = CARD_ICONS[key as keyof typeof CARD_ICONS]
          return (
            <div
              key={key}
              className="relative flex flex-col items-center gap-1.5 rounded-2xl border border-gray-100 bg-white py-4 shadow-sm"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: color }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-gray-600">{label}</span>
              {count > 0 && (
                <span className="absolute right-3 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 会话列表 */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {CONVERSATIONS.map((c, i) => {
          const isRead = readConvs.includes(c.id)
          const unread = isRead ? 0 : c.unread
          return (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-gray-50",
                i !== 0 && "border-t border-gray-50",
              )}
            >
              <div className="relative">
                <Avatar name={c.name} color={c.color} size={46} />
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-hc-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold text-ink">{c.name}</span>
                  {c.cert && <CertBadge level={c.cert} />}
                  <span className="ml-auto shrink-0 text-[11px] text-gray-400">{c.time}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.lastMsg}</p>
              </div>
              {unread > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

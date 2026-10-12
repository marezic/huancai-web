import { useRef, useState } from "react"
import {
  Coins,
  CalendarCheck,
  UserPlus,
  PencilLine,
  Zap,
  Ticket,
  BadgeCheck,
  CircleAlert,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common"
import { SHOP_ITEMS, TASKS } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const TASK_ICONS: Record<string, typeof Zap> = {
  verify: BadgeCheck,
  profile: PencilLine,
  invite: UserPlus,
  signin: CalendarCheck,
}

const SHOP_ICONS: Record<string, typeof Zap> = {
  zap: Zap,
  ticket: Ticket,
  badge: BadgeCheck,
}

export default function Points() {
  const { points, txns, signIn, signedDates } = useStore()
  const [claimed, setClaimed] = useState<string[]>([])
  const today = new Date().toISOString().slice(0, 10)
  const signedToday = signedDates.includes(today)
  const tasksRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)

  const doTask = (id: string, title: string, reward: number) => {
    if (claimed.includes(id)) return
    setClaimed((c) => [...c, id])
    // signIn 由每日签到按钮单独处理
    toast.success(`完成任务「${title}」`, { description: `+${reward} 才分已到账` })
  }

  const buy = (id: string, title: string, cost: number) => {
    if (claimed.includes(`shop-${id}`)) return
    if (points < cost) {
      toast.error("才分不足", { description: "先完成任务赚点才分吧" })
      return
    }
    setClaimed((c) => [...c, `shop-${id}`])
    toast.success(`已兑换「${title}」`, { description: `消耗 ${cost} 才分` })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="才分中心" sub="余额 · 明细 · 任务 · 兑换" />

      {/* 才分余额卡 */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-hc-500 via-hc-600 to-hc-700 p-6 text-white shadow-lg shadow-hc-500/25 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <Coins className="pointer-events-none absolute -bottom-6 right-8 h-28 w-28 text-white/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">才分余额</p>
            <p className="mt-1 text-5xl font-bold tracking-tight">{points.toLocaleString()}</p>
            <p className="mt-2 text-xs text-white/60">12 个月滚动有效 · 仅限平台内使用</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => tasksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold ring-1 ring-white/25 transition-colors hover:bg-white/25"
            >
              赚才分
            </button>
            <button
              onClick={() => shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-hc-700 transition-colors hover:bg-hc-50"
            >
              去兑换
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 收支明细 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-ink">收支明细</h2>
          <div className="divide-y divide-gray-50">
            {txns.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{t.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{t.time}</p>
                </div>
                <span
                  className={cn(
                    "text-sm font-bold",
                    t.amount > 0 ? "text-hc-600" : "text-gray-500",
                  )}
                >
                  {t.amount > 0 ? `+${t.amount}` : t.amount}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 赚才分任务 */}
        <section ref={tasksRef} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm scroll-mt-24">
          <h2 className="mb-1 font-bold text-ink">赚才分任务</h2>
          <p className="mb-3 text-xs text-muted-foreground">完成任务即可领取才分奖励</p>
          <div className="space-y-2">
            {TASKS.map((task) => {
              const Icon = TASK_ICONS[task.id]
              const done = task.done || (task.id === "signin" && signedToday) || claimed.includes(task.id)
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hc-100 text-hc-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{task.title}</p>
                    <p className="text-xs text-hcyellow-600">奖励 +{task.reward} 才分</p>
                  </div>
                  {done ? (
                    <span className="shrink-0 rounded-full bg-gray-200 px-4 py-1.5 text-xs font-medium text-gray-400">
                      已完成
                    </span>
                  ) : task.id === "signin" ? (
                    <button
                      onClick={() => {
                        if (signIn()) toast.success("签到成功，+5 才分")
                      }}
                      className="shrink-0 rounded-full bg-hc-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-hc-500/30 hover:bg-hc-600"
                    >
                      去签到
                    </button>
                  ) : (
                    <button
                      onClick={() => doTask(task.id, task.title, task.reward)}
                      className="shrink-0 rounded-full bg-hc-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-hc-500/30 hover:bg-hc-600"
                    >
                      去完成
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* 才分兑换专区 */}
        <section ref={shopRef} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm scroll-mt-24">
          <h2 className="mb-3 font-bold text-ink">才分兑换专区</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {SHOP_ITEMS.map((item) => {
              const Icon = SHOP_ICONS[item.icon]
              const bought = claimed.includes(`shop-${item.id}`)
              return (
                <div key={item.id} className="rounded-2xl border border-gray-100 p-4 transition-shadow hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hcyellow-50 text-hcyellow-600 ring-1 ring-hcyellow-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-2.5 text-sm font-bold text-ink">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                  <button
                    onClick={() => buy(item.id, item.title, item.cost)}
                    disabled={bought}
                    className={cn(
                      "mt-3 w-full rounded-full py-2 text-xs font-bold transition-colors",
                      bought
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-hcyellow-500 text-white hover:bg-hcyellow-600",
                    )}
                  >
                    {bought ? "已兑换" : `${item.cost} 才分兑换`}
                  </button>
                </div>
              )
            })}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CircleAlert className="h-3.5 w-3.5 text-hcyellow-500" />
            才分仅限平台内使用 · 不可提现 · 不可转账
          </p>
        </section>
      </div>
    </div>
  )
}

import { useState } from "react"
import { MapPin, QrCode, CalendarDays, PartyPopper } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common"
import { ACTIVITIES, ACTIVITY_FILTERS } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

export default function Activities() {
  const { points, joinedActivities, joinActivity } = useStore()
  const [filter, setFilter] = useState("全部")

  const list = ACTIVITIES.filter((a) => {
    if (filter === "全部") return true
    if (filter === "本周") return a.tag !== "技能节"
    return a.tag === filter
  })
  const myJoined = ACTIVITIES.filter((a) => joinedActivities.includes(a.id))

  const join = (id: string, cost: number, title: string) => {
    if (joinedActivities.includes(id)) return
    if (cost > 0 && points < cost) {
      toast.error("才分不足", { description: `报名「${title}」需要 ${cost} 才分` })
      return
    }
    if (joinActivity(id, cost, title)) {
      toast.success(`已报名「${title}」`, {
        description: cost ? `消耗 ${cost} 才分，活动当天出示二维码入场` : "免费活动，活动当天出示二维码入场",
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="线下活动" sub="工作坊 · 技能节 · 才分报名" />

      {/* 技能节横幅 */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 p-6 text-white shadow-lg shadow-orange-500/25 md:p-8">
        <PartyPopper className="pointer-events-none absolute -bottom-4 right-6 h-32 w-32 text-white/15" />
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/30">
          技能节
        </span>
        <h2 className="mt-3 text-2xl font-bold">校园技能节 · 秋季场</h2>
        <p className="mt-1.5 text-sm text-white/85">
          10/18 周六 · 大学生活动中心 · 36 位技能达人现场摆摊 · 凭才分入场
        </p>
        <button
          onClick={() => join("skill-fest", 0, "校园技能节 · 秋季场")}
          disabled={joinedActivities.includes("skill-fest")}
          className={cn(
            "mt-4 rounded-full px-6 py-2.5 text-sm font-bold transition-all",
            joinedActivities.includes("skill-fest")
              ? "bg-white/25 text-white/80"
              : "bg-white text-orange-600 shadow-md hover:bg-orange-50",
          )}
        >
          {joinedActivities.includes("skill-fest") ? "已报名 ✓" : "立即报名"}
        </button>
      </div>

      {/* 筛选 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {ACTIVITY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f
                ? "border-hc-500 bg-hc-500 text-white shadow-sm shadow-hc-500/30"
                : "border-gray-200 bg-white text-gray-600 hover:border-hc-300 hover:text-hc-700",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 活动列表 */}
      <div className="space-y-3">
        {list.map((a) => {
          const joined = joinedActivities.includes(a.id)
          return (
            <div
              key={a.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: a.color }}
              >
                <CalendarDays className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-bold text-ink">{a.title}</h3>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                    {a.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.time} · <MapPin className="inline h-3 w-3" /> {a.place}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs font-medium",
                    a.left <= 10 ? "text-red-500" : "text-hc-600",
                  )}
                >
                  {a.left >= 999 ? "名额充足" : `还剩 ${a.left} 个名额`}
                </p>
              </div>
              <button
                onClick={() => join(a.id, a.cost, a.title)}
                disabled={joined}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all",
                  joined
                    ? "cursor-default bg-hc-50 text-hc-700 ring-1 ring-hc-200"
                    : a.cost === 0
                      ? "bg-hc-500 text-white shadow-sm shadow-hc-500/30 hover:bg-hc-600"
                      : "bg-hcyellow-500 text-white shadow-sm shadow-hcyellow-500/30 hover:bg-hcyellow-600",
                )}
              >
                {joined ? "已报名 ✓" : a.cost === 0 ? "免费报名" : `${a.cost}才分报名`}
              </button>
            </div>
          )
        })}
      </div>

      {/* 我的报名 */}
      {myJoined.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-bold text-ink">我的报名</h2>
          <div className="space-y-2">
            {myJoined.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-2xl border border-hc-200 bg-hc-50 p-4"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: a.color }}
                >
                  <QrCode className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">
                    {a.title} <span className="font-normal text-hc-700">· 已报名</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.time} · 出示二维码入场
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast.info("入场二维码", { description: "演示环境：现场向工作人员出示即可" })
                  }
                  className="shrink-0 text-xs font-medium text-hc-700 hover:underline"
                >
                  查看二维码 ›
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

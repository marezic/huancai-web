import { useState } from "react"
import { Crown, TrendingUp, ChevronUp, Info } from "lucide-react"
import { toast } from "sonner"
import { Avatar, PageHeader } from "@/components/common"
import { RANKS } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const TABS = ["技能大神", "学习之星", "本校榜"] as const

const LIST_VARIANTS: Record<(typeof TABS)[number], typeof RANKS> = {
  技能大神: RANKS,
  学习之星: [...RANKS].reverse(),
  本校榜: RANKS.filter((r) => r.rank !== 2),
}

export default function Leaderboard() {
  const { points } = useStore()
  const [tab, setTab] = useState<(typeof TABS)[number]>("技能大神")
  const list = LIST_VARIANTS[tab]
  const top3 = list.slice(0, 3)
  const rest = list.slice(3)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="排行榜" sub="技能大神榜 · 荣誉激励" />

      <div className="mb-6 flex justify-center gap-1 rounded-full bg-gray-100 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium transition-all",
              tab === t ? "bg-white text-hc-700 shadow-sm" : "text-gray-500 hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 前三名领奖台 */}
      <div className="mb-6 grid grid-cols-3 items-end gap-3">
        {[top3[1], top3[0], top3[2]].map((user, i) => {
          const place = i === 1 ? 1 : i === 0 ? 2 : 3
          const heights = ["h-24", "h-32", "h-20"]
          const medal = ["bg-gray-200 text-gray-500", "bg-hcyellow-400 text-white", "bg-orange-200 text-orange-700"]
          return (
            <div key={user.name} className={cn("flex flex-col items-center", place === 1 && "-mt-4")}>
              <div className="relative">
                {place === 1 && (
                  <Crown className="absolute -top-6 left-1/2 h-6 w-6 -translate-x-1/2 fill-hcyellow-400 text-hcyellow-500" />
                )}
                <Avatar name={user.name} color={user.color} size={place === 1 ? 64 : 52} />
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-bold",
                    medal[place - 1],
                  )}
                >
                  {place}
                </span>
              </div>
              <p className={cn("mt-2 font-bold", place === 1 ? "text-base text-ink" : "text-sm text-ink")}>
                {user.name}
              </p>
              <p className="text-[11px] text-muted-foreground">{user.skills}</p>
              <p className={cn("mt-0.5 text-sm font-bold", place === 1 ? "text-hcyellow-600" : "text-gray-500")}>
                {user.score.toLocaleString()}
              </p>
              <div
                className={cn(
                  "mt-2 w-full rounded-t-2xl bg-gradient-to-b from-hc-100 to-hc-50",
                  heights[place - 1],
                )}
              />
            </div>
          )
        })}
      </div>

      {/* 4 名以后 */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {rest.map((user, i) => (
          <div
            key={user.name}
            className={cn("flex items-center gap-3 px-4 py-3.5", i !== 0 && "border-t border-gray-50")}
          >
            <span className="w-6 text-center text-sm font-bold text-gray-400">{user.rank}</span>
            <Avatar name={user.name} color={user.color} size={38} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.skills}</p>
            </div>
            <span className="text-sm font-bold text-hc-700">{user.score.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* 我的排名 */}
      <div className="sticky bottom-4 z-20 mt-6 flex items-center gap-3 rounded-2xl border border-hc-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
        <span className="w-6 text-center text-sm font-bold text-gray-400">24</span>
        <Avatar name="小明同学" color="#43CD68" size={38} />
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">我的排名</p>
          <p className="text-xs text-muted-foreground">才分 {points.toLocaleString()}</p>
        </div>
        <span className="flex items-center gap-0.5 rounded-full bg-hc-50 px-2.5 py-1 text-xs font-bold text-hc-700 ring-1 ring-hc-200">
          <ChevronUp className="h-3.5 w-3.5" />
          3
        </span>
        <button
          onClick={() => toast.info("冲榜攻略", { description: "多授课、多收好评、坚持每日签到，才分涨得快" })}
          className="flex items-center gap-1 rounded-full bg-hc-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-hc-500/30 hover:bg-hc-600"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          冲榜攻略
        </button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
        <Info className="h-3.5 w-3.5" />
        榜单每小时更新 · 才分相同按好评率排序
      </p>
    </div>
  )
}

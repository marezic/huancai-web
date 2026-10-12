import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { Search, MapPin, ArrowRightLeft, SlidersHorizontal } from "lucide-react"
import { Avatar, CertBadge, PageHeader } from "@/components/common"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const TABS = ["推荐", "附近", "最新"] as const
const FILTERS = ["全部", "在线授课", "线下约课", "可技能互换"] as const

export default function Skills() {
  const [params, setParams] = useSearchParams()
  const q = params.get("q") ?? ""
  const [tab, setTab] = useState<(typeof TABS)[number]>("推荐")
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("全部")
  const { allSkills } = useStore()

  const list = useMemo(() => {
    let result = allSkills
    if (q.trim()) {
      const key = q.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(key) ||
          s.subtitle.toLowerCase().includes(key) ||
          s.category.toLowerCase().includes(key) ||
          s.teacher.name.toLowerCase().includes(key),
      )
    }
    if (filter === "在线授课") result = result.filter((s) => s.mode !== "线下见面")
    if (filter === "线下约课") result = result.filter((s) => s.mode !== "在线授课")
    if (filter === "可技能互换") result = result.filter((s) => s.exchange)
    if (tab === "附近")
      result = [...result].sort(
        (a, b) => parseFloat(a.teacher.distance ?? "99") - parseFloat(b.teacher.distance ?? "99"),
      )
    if (tab === "最新") result = [...result].reverse()
    return result
  }, [q, tab, filter, allSkills])

  return (
    <div>
      <PageHeader title="找技能" sub="供需标签 + LBS 双端推荐" />

      {/* 搜索框 */}
      <div className="mb-5 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-hc-400 focus-within:ring-2 focus-within:ring-hc-100">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
          placeholder="搜索想学的技能 / 达人，如：PPT、Python、日语"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        {q && (
          <button
            onClick={() => setParams({})}
            className="shrink-0 text-xs text-gray-400 hover:text-gray-600"
          >
            清除
          </button>
        )}
      </div>

      {/* 标签页：推荐 / 附近 / 最新 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-full bg-gray-100 p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-medium transition-all",
                tab === t ? "bg-white text-hc-700 shadow-sm" : "text-gray-500 hover:text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          共 {list.length} 门技能
        </span>
      </div>

      {/* 筛选 chips：全部 / 在线授课 / 线下约课 / 可技能互换 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
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

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <p className="text-gray-400">没有找到「{q}」相关的技能</p>
          <p className="mt-1 text-xs text-gray-400">换个关键词试试，或者成为第一个教它的人</p>
          <Link
            to="/publish"
            className="mt-4 inline-block rounded-full bg-hc-500 px-5 py-2 text-sm font-bold text-white hover:bg-hc-600"
          >
            去发布技能
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((skill) => (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* 左侧色块（技能封面） */}
              <span
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                style={{ backgroundColor: skill.color }}
              >
                {skill.title.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-bold text-ink group-hover:text-hc-700">
                    {skill.title}
                    <span className="ml-1 font-normal text-muted-foreground">{skill.subtitle}</span>
                  </h3>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Avatar name={skill.teacher.name} color={skill.color} size={18} />
                    @{skill.teacher.name}
                  </span>
                  <CertBadge level={skill.teacher.cert} />
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {skill.teacher.distance}
                  </span>
                  {skill.exchange && (
                    <span className="inline-flex items-center gap-0.5 text-hcblue-600">
                      <ArrowRightLeft className="h-3 w-3" />
                      可互换
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-hc-600">{skill.price}</span>
                    <span className="text-xs text-muted-foreground">才分/课时</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {skill.teacher.rating}分 · {skill.teacher.lessons}次教学
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

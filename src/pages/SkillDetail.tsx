import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  Star,
  Heart,
  ArrowRightLeft,
  CalendarClock,
  MonitorPlay,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Avatar, CertBadge, Stars } from "@/components/common"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

export default function SkillDetail() {
  const { id } = useParams()
  const { allSkills, favorites, toggleFav } = useStore()
  const skill = allSkills.find((s) => s.id === id)
  const [slot, setSlot] = useState<string | null>(null)

  if (!skill) {
    return (
      <div className="py-20 text-center text-gray-400">
        课程不存在
        <Link to="/skills" className="mt-2 block text-hc-600">
          返回找技能
        </Link>
      </div>
    )
  }

  const fav = favorites.includes(skill.id)

  return (
    <div className="mx-auto max-w-3xl">
      {/* 顶部横幅 —— 设计稿技能详情头图 */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 text-white md:p-8"
        style={{ background: `linear-gradient(120deg, ${skill.color}, ${skill.color}CC)` }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-0 right-24 hidden rotate-[-12deg] opacity-30 md:block">
          <MonitorPlay className="h-24 w-24" />
        </div>
        <Link
          to="/skills"
          className="mb-5 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs ring-1 ring-white/25 transition-colors hover:bg-white/25"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回找技能
        </Link>
        <h1 className="text-3xl font-bold">{skill.title}</h1>
        <p className="mt-1 text-lg text-white/85">{skill.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/25">{skill.category}</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/25">{skill.mode}</span>
          {skill.exchange && (
            <span className="rounded-full bg-hcyellow-400/90 px-2.5 py-1 font-medium text-hcyellow-900">
              支持技能互换
            </span>
          )}
        </div>
      </div>

      {/* 讲师信息卡片 */}
      <div className="relative z-10 mx-4 -mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <Avatar name={skill.teacher.name} color={skill.color} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">{skill.teacher.name}</span>
              <CertBadge level={skill.teacher.cert} />
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Stars value={skill.teacher.rating} size={12} />
              {skill.teacher.rating}分 · {skill.teacher.lessons}次教学 · {skill.teacher.school}
            </div>
          </div>
          <Link
            to={`/chat/c-design`}
            className="shrink-0 rounded-full border border-hc-300 px-4 py-1.5 text-sm font-medium text-hc-700 transition-colors hover:bg-hc-50"
          >
            联系TA
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-hcyellow-50 px-4 py-3 ring-1 ring-hcyellow-200">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-hcyellow-700">{skill.price}</span>
            <span className="text-xs text-hcyellow-700/80">才分 / 课时</span>
          </div>
          {skill.exchange && (
            <span className="text-xs font-medium text-hcyellow-700">可用你的技能免费互换</span>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6 px-1">
        {/* 课程介绍 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-ink">课程介绍</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {skill.intro ?? "适合想系统提升该技能的同学，从零基础到实战应用，手把手教学。"}
          </p>
        </section>

        {/* 课程大纲 */}
        {skill.outline && (
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-ink">课程大纲</h2>
            <ol className="mt-3 space-y-3">
              {skill.outline.map((item) => (
                <li key={item.no} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-hc-100 text-xs font-bold text-hc-700">
                    {item.no}
                  </span>
                  <span className="text-sm text-gray-700">{item.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 学员评价 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">学员评价（{skill.reviewCount ?? skill.teacher.lessons}）</h2>
            <Stars value={skill.teacher.rating} />
          </div>
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <Avatar name={skill.sampleReview?.name ?? "李同学"} color="#3D8AF7" size={28} />
              <span className="text-sm font-medium text-ink">{skill.sampleReview?.name ?? "李同学"}</span>
              <Stars value={5} size={12} />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {skill.sampleReview?.text ?? "老师讲得很细，一次课就做出了满意的作品！"}
            </p>
          </div>
        </section>

        {/* 可预约时间 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-ink">
            <CalendarClock className="h-4 w-4 text-hc-600" />
            可预约时间
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(skill.slots ?? []).map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  slot === s
                    ? "border-hc-500 bg-hc-500 text-white shadow-sm shadow-hc-500/30"
                    : "border-gray-200 text-gray-600 hover:border-hc-300 hover:text-hc-700",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          {slot && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-hc-700">
              <CheckCircle2 className="h-4 w-4" />
              已选择 {slot}，点击下方「立即预约」完成下单
            </p>
          )}
        </section>
      </div>

      {/* 底部操作栏 —— 收藏 / 发起互换 / 立即预约 */}
      <div className="sticky bottom-4 z-20 mt-8 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-2xl backdrop-blur">
        <button
          onClick={() => {
            toggleFav(skill.id)
            toast(fav ? "已取消收藏" : "已收藏到「我的收藏」")
          }}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs transition-colors",
            fav ? "text-red-500" : "text-gray-500 hover:text-red-500",
          )}
        >
          <Heart className={cn("h-5 w-5", fav && "fill-red-500")} />
          收藏
        </button>
        <button
          onClick={() =>
            toast.success("已向对方发起互换申请", {
              description: "等待对方回应后可在消息中继续沟通",
            })
          }
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-hc-500 py-3 text-sm font-bold text-hc-700 transition-colors hover:bg-hc-50"
        >
          <ArrowRightLeft className="h-4 w-4" />
          发起互换
        </button>
        <Link
          to={`/booking/${skill.id}`}
          className="flex flex-[1.5] items-center justify-center gap-1.5 rounded-xl bg-hc-500 py-3 text-sm font-bold text-white shadow-md shadow-hc-500/30 transition-colors hover:bg-hc-600"
        >
          <Star className="h-4 w-4 fill-white" />
          立即预约
        </Link>
      </div>
    </div>
  )
}

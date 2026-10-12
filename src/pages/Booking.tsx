import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, ShieldCheck, Coins, ArrowRightLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const DATES = [
  { label: "今天", date: "09/27" },
  { label: "明天", date: "09/28" },
  { label: "周一", date: "09/29" },
  { label: "周二", date: "09/30" },
  { label: "周三", date: "10/01" },
]
const TIMES = ["10:00", "14:00", "15:00", "16:00", "19:00", "20:00"]

export default function Booking() {
  const { id } = useParams()
  const nav = useNavigate()
  const { allSkills, points, createOrder } = useStore()
  const skill = allSkills.find((s) => s.id === id)

  const [date, setDate] = useState(DATES[1])
  const [time, setTime] = useState("15:00")
  const [teachMode, setTeachMode] = useState<"线上视频授课" | "线下见面">("线上视频授课")
  const [pay, setPay] = useState<"points" | "exchange">("points")
  const [done, setDone] = useState(false)

  if (!skill) return <div className="py-20 text-center text-gray-400">课程不存在</div>

  const price = pay === "points" ? skill.price : 0
  const insufficient = pay === "points" && points < skill.price

  const submit = () => {
    if (insufficient) {
      toast.error("才分不足", {
        description: "去才分中心完成每日签到、任务赚取才分",
      })
      return
    }
    const order = createOrder({
      skillId: skill.id,
      skillTitle: `${skill.title} · ${skill.subtitle}`,
      teacherName: skill.teacher.name,
      date: `${date.label} ${date.date}`,
      time,
      mode: teachMode,
      price,
    })
    if (!order) {
      toast.error("才分不足，预约失败")
      return
    }
    if (pay === "exchange") {
      toast.success("互换预约已提交", { description: "等待对方确认你的互换申请" })
    }
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* 顶部课程卡片 */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <Link to={`/skills/${skill.id}`} className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ backgroundColor: skill.color }}
          >
            {skill.title.slice(0, 2)}
          </span>
          <div>
            <h1 className="font-bold text-ink">
              {skill.title}
              <span className="ml-1 font-normal text-muted-foreground">{skill.subtitle}</span>
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              @{skill.teacher.name} · {skill.teacher.rating}分 · 才分 {skill.price}/课时
            </p>
          </div>
        </Link>
        <Link
          to={`/skills/${skill.id}`}
          className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回
        </Link>
      </div>

      <div className="space-y-5">
        {/* 选择日期 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-ink">选择日期</h2>
          <div className="grid grid-cols-5 gap-2">
            {DATES.map((d) => (
              <button
                key={d.label}
                onClick={() => setDate(d)}
                className={cn(
                  "rounded-xl border py-2.5 text-center transition-all",
                  date.label === d.label
                    ? "border-hc-500 bg-hc-50 shadow-sm"
                    : "border-gray-200 hover:border-hc-300",
                )}
              >
                <span
                  className={cn(
                    "block text-sm font-bold",
                    date.label === d.label ? "text-hc-700" : "text-ink",
                  )}
                >
                  {d.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">{d.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 选择时间 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-ink">选择时间</h2>
          <div className="flex flex-wrap gap-2">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-medium transition-all",
                  time === t
                    ? "border-hc-500 bg-hc-500 text-white shadow-sm shadow-hc-500/30"
                    : "border-gray-200 text-gray-600 hover:border-hc-300",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* 授课方式 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-ink">授课方式</h2>
          <div className="grid grid-cols-2 gap-2">
            {(["线上视频授课", "线下见面"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTeachMode(m)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  teachMode === m
                    ? "border-hc-500 bg-hc-50 text-hc-700"
                    : "border-gray-200 text-gray-500 hover:border-hc-300",
                )}
              >
                {m}
              </button>
            ))}
          </div>
          {teachMode === "线上视频授课" && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-hcblue-50 px-3 py-2 text-xs text-hcblue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              上课前 10 分钟可在「我的订单」进入视频教室，内置互动白板
            </p>
          )}
        </section>

        {/* 支付方式 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-ink">支付方式</h2>
          <div className="space-y-2">
            {skill.exchange && (
              <button
                onClick={() => setPay("exchange")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  pay === "exchange" ? "border-hcblue-400 bg-hcblue-50" : "border-gray-200 hover:border-hcblue-300",
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hcblue-100 text-hcblue-600">
                  <ArrowRightLeft className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-ink">技能互换</span>
                  <span className="block text-xs text-muted-foreground">
                    我用「摄影技巧」与对方交换
                  </span>
                </span>
                {pay === "exchange" && <CheckCircle2 className="h-5 w-5 text-hcblue-600" />}
              </button>
            )}
            <button
              onClick={() => setPay("points")}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                pay === "points" ? "border-hc-500 bg-hc-50" : "border-gray-200 hover:border-hc-300",
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hcyellow-100 text-hcyellow-600">
                <Coins className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-ink">
                  才分支付 {skill.price}
                </span>
                <span
                  className={cn(
                    "block text-xs",
                    insufficient ? "font-medium text-red-500" : "text-muted-foreground",
                  )}
                >
                  余额 {points.toLocaleString()} 才分
                  {insufficient && "（不足）"}
                </span>
              </span>
              {pay === "points" && <CheckCircle2 className="h-5 w-5 text-hc-600" />}
            </button>
          </div>
          <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-hc-600" />
            平台担保托管：确认达成 → 冻结才分 → 双方确认后划转，争议 48 小时内仲裁。
          </p>
        </section>
      </div>

      {/* 底部结算栏 */}
      <div className="sticky bottom-4 z-20 mt-8 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-2xl backdrop-blur">
        <div>
          <span className="block text-xs text-muted-foreground">合计</span>
          <span className="text-xl font-bold text-hc-600">
            {pay === "points" ? `${skill.price} 才分` : "技能互换"}
          </span>
        </div>
        <button
          onClick={submit}
          disabled={insufficient}
          className={cn(
            "flex-1 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99]",
            insufficient
              ? "cursor-not-allowed bg-gray-300 shadow-none"
              : "bg-hc-500 shadow-hc-500/30 hover:bg-hc-600",
          )}
        >
          {insufficient ? "才分不足" : "提交预约"}
        </button>
      </div>

      {/* 预约成功弹窗 */}
      <Dialog open={done} onOpenChange={setDone}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-hc-100">
              <CheckCircle2 className="h-8 w-8 text-hc-600" />
            </div>
            <DialogTitle className="text-center">预约提交成功</DialogTitle>
            <DialogDescription className="text-center">
              {date.label} {date.date} {time} · {teachMode}
              <br />
              {pay === "points"
                ? `${skill.price} 才分已由平台托管冻结，对方确认后划转`
                : "互换申请已发送，等待对方确认"}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => {
                setDone(false)
                nav("/me")
              }}
              className="flex-1 rounded-xl border border-hc-300 py-2.5 text-sm font-bold text-hc-700 hover:bg-hc-50"
            >
              查看订单
            </button>
            <button
              onClick={() => {
                setDone(false)
                nav("/skills")
              }}
              className="flex-1 rounded-xl bg-hc-500 py-2.5 text-sm font-bold text-white hover:bg-hc-600"
            >
              再逛逛
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useState } from "react"
import { useNavigate } from "react-router"
import { Upload, GraduationCap, BookOpen, ArrowRightLeft, CircleAlert } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common"
import { CATEGORIES } from "@/data"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const MODES = ["在线授课", "线下见面", "均可"] as const
const TIMES = ["工作日晚上", "周末全天"] as const
const PALETTE = ["#43CD68", "#3D8AF7", "#FF7A7A", "#9B7BF7", "#F7931E", "#2BB3A3"]

export default function Publish() {
  const nav = useNavigate()
  const { publishSkill } = useStore()
  const [mode, setMode] = useState<"我能教" | "我想学">("我能教")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("设计")
  const [desc, setDesc] = useState("")
  const [teachMode, setTeachMode] = useState<(typeof MODES)[number]>("在线授课")
  const [price, setPrice] = useState(150)
  const [exchange, setExchange] = useState(true)
  const [freeTime, setFreeTime] = useState<string[]>(["工作日晚上"])
  const [uploaded, setUploaded] = useState(false)

  const toggleTime = (t: string) =>
    setFreeTime((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  const submit = () => {
    if (!title.trim()) {
      toast.error("请填写技能名称", { description: "例如：PPT高阶设计" })
      return
    }
    if (!desc.trim()) {
      toast.error("请填写技能描述")
      return
    }
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    publishSkill({
      id: `u-${Date.now()}`,
      title: title.trim(),
      subtitle: mode === "我能教" ? "达人自营" : "求带",
      category,
      teacher: {
        id: "me",
        name: "小明同学",
        school: "武汉大学",
        cert: "校园认证",
        rating: 5.0,
        lessons: 0,
        distance: "0km",
      },
      price: mode === "我能教" ? price : 0,
      mode: teachMode,
      exchange,
      color,
      hot: true,
      intro: desc,
      slots: ["今天 19:00", "明天 15:00"],
    })
    toast.success(mode === "我能教" ? "技能发布成功！" : "想学需求发布成功！", {
      description: "已上架到找技能列表，可在「我的」中管理",
    })
    nav("/skills")
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="发布技能" sub="我能教 / 我想学 双模式" />

      {/* 双模式切换 */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1.5">
        {(
          [
            { key: "我能教", icon: GraduationCap, desc: "把我会的教出去，赚才分" },
            { key: "我想学", icon: BookOpen, desc: "发布需求，等达人来接单" },
          ] as const
        ).map(({ key, icon: Icon, desc }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={cn(
              "rounded-xl px-4 py-3 text-left transition-all",
              mode === key ? "bg-white shadow-md" : "opacity-60 hover:opacity-90",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1.5 font-bold",
                mode === key ? "text-hc-700" : "text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {key}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
          </button>
        ))}
      </div>

      <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* 技能名称 */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            技能名称 <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="如：PPT高阶设计"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"
          />
        </div>

        {/* 技能分类 */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">技能分类</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  category === c
                    ? "border-hc-500 bg-hc-500 text-white shadow-sm shadow-hc-500/30"
                    : "border-gray-200 text-gray-600 hover:border-hc-300 hover:text-hc-700",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 技能描述 */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">
            技能描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="介绍你的技能水平、教学经验和课程安排…"
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"
          />
        </div>

        {/* 授课方式 */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">授课方式</label>
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setTeachMode(m)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  teachMode === m
                    ? "border-hc-500 bg-hc-50 text-hc-700"
                    : "border-gray-200 text-gray-600 hover:border-hc-300",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 价格设置 */}
        {mode === "我能教" && (
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">价格设置</label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-hc-400 focus-within:ring-2 focus-within:ring-hc-100">
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                  className="w-20 bg-transparent text-sm font-bold outline-none"
                />
                <span className="text-xs text-muted-foreground">才分/课时</span>
              </div>
              <button
                onClick={() => setExchange(!exchange)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  exchange
                    ? "border-hcblue-400 bg-hcblue-50 text-hcblue-700"
                    : "border-gray-200 text-gray-500",
                )}
              >
                <ArrowRightLeft className="h-4 w-4" />
                支持技能互换
                {exchange && <span className="text-xs">✓</span>}
              </button>
            </div>
          </div>
        )}

        {/* 可授课时间 */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">可授课时间</label>
          <div className="flex flex-wrap gap-2">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => toggleTime(t)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  freeTime.includes(t)
                    ? "border-hc-500 bg-hc-50 text-hc-700"
                    : "border-gray-200 text-gray-600 hover:border-hc-300",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 封面上传 */}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink">技能封面图</label>
          <button
            onClick={() => setUploaded(true)}
            className={cn(
              "flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm transition-colors",
              uploaded
                ? "border-hc-400 bg-hc-50 text-hc-700"
                : "border-gray-200 text-gray-400 hover:border-hc-300 hover:text-hc-600",
            )}
          >
            {uploaded ? (
              <>
                <GraduationCap className="h-6 w-6" />
                封面已添加（演示环境不上传真实图片）
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                点击上传技能封面图
              </>
            )}
          </button>
        </div>

        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-hcyellow-500" />
          发布即表示同意《换才技能发布规范》，虚假信息将被下架并扣除信用分。
        </p>
      </div>

      <button
        onClick={submit}
        className="mt-6 w-full rounded-2xl bg-hc-500 py-4 text-base font-bold text-white shadow-lg shadow-hc-500/30 transition-all hover:bg-hc-600 active:scale-[0.99]"
      >
        {mode === "我能教" ? "发布技能" : "发布想学需求"}
      </button>
    </div>
  )
}

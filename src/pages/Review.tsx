import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { CheckCircle2, Star, Gift } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

const TAGS = ["讲解清晰", "准备充分", "收获很大", "及时回复", "非常有耐心", "时间准时"]

export default function Review() {
  const { id } = useParams()
  const nav = useNavigate()
  const { allSkills, addTxn } = useStore()
  const skill = allSkills.find((s) => s.id === id) ?? allSkills[0]

  const [stars, setStars] = useState(5)
  const [hover, setHover] = useState(0)
  const [tags, setTags] = useState<string[]>(["讲解清晰", "准备充分"])
  const [text, setText] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = (t: string) =>
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  const submit = () => {
    addTxn("优质评价奖励", 10)
    setSubmitted(true)
    toast.success("评价已提交，+10 才分奖励已到账")
    setTimeout(() => nav("/points"), 1800)
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* 交换完成横幅 */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-hc-200 bg-gradient-to-r from-hc-50 to-white p-5 shadow-sm">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hc-500 text-white shadow-md shadow-hc-500/30">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-bold text-hc-800">交换完成！</h1>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
            与 @{skill.teacher.name} 完成 1 课时教学，
            <span className="font-bold text-hc-700">{skill.price} 才分</span>
            已托管划转到对方账户
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* 总体评价 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <h2 className="font-bold text-ink">总体评价</h2>
          <div className="mt-3 flex justify-center gap-1.5" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setStars(i)}
                onMouseEnter={() => setHover(i)}
                className="p-1 transition-transform hover:scale-125"
              >
                <Star
                  className={cn(
                    "h-9 w-9 transition-colors",
                    (hover || stars) >= i
                      ? "fill-hcyellow-400 text-hcyellow-400"
                      : "text-gray-200",
                  )}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {["", "很不满意", "不满意", "一般", "满意", "非常满意"][hover || stars]}
          </p>
        </section>

        {/* 添加标签 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-ink">添加标签（多选）</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                  tags.includes(t)
                    ? "border-hc-500 bg-hc-500 text-white shadow-sm shadow-hc-500/30"
                    : "border-gray-200 bg-white text-gray-600 hover:border-hc-300 hover:text-hc-700",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* 分享收获 */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-ink">分享你的收获</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="老师讲得超细，一次课就做出了满意的 PPT，还教了很多排版思路…"
            className="mt-3 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"
          />
          <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">匿名评价</span>
            <Switch checked={anonymous} onCheckedChange={setAnonymous} />
          </div>
        </section>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Gift className="h-4 w-4 text-hcyellow-500" />
          发布优质评价可获得 <span className="font-bold text-hcyellow-600">+10 才分</span> 奖励
        </p>
      </div>

      <button
        onClick={submit}
        disabled={submitted}
        className={cn(
          "mt-6 w-full rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.99]",
          submitted ? "bg-gray-300 shadow-none" : "bg-hc-500 shadow-hc-500/30 hover:bg-hc-600",
        )}
      >
        {submitted ? "已提交，感谢评价 ✓" : "提交评价"}
      </button>

      <p className="mt-3 text-center text-xs text-gray-400">
        评价将展示在对方技能详情页，帮助更多人找到好老师
      </p>
    </div>
  )
}

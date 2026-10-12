import { useState } from "react"
import { Link } from "react-router"
import {
  ArrowLeft,
  CheckCircle2,
  Upload,
  ShieldCheck,
  GraduationCap,
  CircleAlert,
  FileText,
  Image as ImageIcon,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common"
import { cn } from "@/lib/utils"

const STEPS = ["填写信息", "上传证件", "等待认证"]

export default function Verify() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [school] = useState("武汉大学")
  const [sid, setSid] = useState("")
  const [uploaded, setUploaded] = useState(false)

  const submit = () => {
    if (!name.trim() || !sid.trim()) {
      toast.error("请填写完整信息", { description: "姓名、学号均为必填项" })
      return
    }
    if (!uploaded) {
      toast.error("请上传学生证照片")
      return
    }
    setStep(2)
    toast.success("认证申请已提交", { description: "预计 1 个工作日内完成审核" })
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="校园实名认证"
        sub="学生证 + 学信网双重核验"
        back={
          <Link
            to="/me"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        }
      />

      {/* 步骤条 */}
      <div className="mb-6 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i < step
                    ? "bg-hc-500 text-white"
                    : i === step
                      ? "bg-hc-500 text-white ring-4 ring-hc-100"
                      : "bg-gray-100 text-gray-400",
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-xs", i <= step ? "font-medium text-hc-700" : "text-gray-400")}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-2 mb-5 h-0.5 flex-1 rounded", i < step ? "bg-hc-400" : "bg-gray-100")} />
            )}
          </div>
        ))}
      </div>

      {step < 2 ? (
        <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* 姓名 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入真实姓名"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"
            />
          </div>

          {/* 学校 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">学校</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-ink">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              {school}
              <span className="ml-auto text-xs text-gray-400">LBS 自动定位</span>
            </div>
          </div>

          {/* 学号 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              学号 <span className="text-red-500">*</span>
            </label>
            <input
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              placeholder="请输入学号"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"
            />
          </div>

          {/* 学生证上传 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">上传学生证照片</label>
            <button
              onClick={() => {
                setUploaded(true)
                setStep(1)
              }}
              className={cn(
                "flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm transition-colors",
                uploaded
                  ? "border-hc-400 bg-hc-50 text-hc-700"
                  : "border-gray-200 text-gray-400 hover:border-hc-300 hover:text-hc-600",
              )}
            >
              {uploaded ? (
                <>
                  <ImageIcon className="h-6 w-6" />
                  学生证照片已上传（演示环境不上传真实图片）
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  点击上传学生证照片
                  <span className="text-xs text-gray-400">支持 jpg / png，需包含姓名与学号</span>
                </>
              )}
            </button>
          </div>

          {/* 学信网提示 */}
          <div className="flex items-center gap-3 rounded-xl bg-hcblue-50 p-3.5">
            <FileText className="h-8 w-8 shrink-0 text-hcblue-500" />
            <div>
              <p className="text-sm font-bold text-hcblue-700">学信网在线验证</p>
              <p className="text-xs text-hcblue-600/80">将跳转学信网完成学籍核验（演示环境跳过）</p>
            </div>
          </div>

          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-hc-600" />
            认证信息仅用于身份审核，加密存储，平台不会向第三方泄露。
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-hc-100">
            <CheckCircle2 className="h-9 w-9 text-hc-600" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-ink">认证申请已提交</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            审核结果将通过系统通知发送给你
            <br />
            认证通过可获得 <span className="font-bold text-hcyellow-600">+60 才分</span> 新手礼包
          </p>
          <Link
            to="/me"
            className="mt-6 inline-block rounded-full bg-hc-500 px-8 py-2.5 text-sm font-bold text-white shadow-md shadow-hc-500/30 hover:bg-hc-600"
          >
            返回个人中心
          </Link>
        </div>
      )}

      {step < 2 && (
        <button
          onClick={submit}
          className="mt-6 w-full rounded-2xl bg-hc-500 py-4 text-base font-bold text-white shadow-lg shadow-hc-500/30 transition-all hover:bg-hc-600 active:scale-[0.99]"
        >
          提交认证
        </button>
      )}

      {step < 2 && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-hc-600" />
          认证通过即可获得 +60 才分新手礼包
        </p>
      )}
    </div>
  )
}

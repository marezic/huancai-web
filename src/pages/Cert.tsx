import { Link } from "react-router"
import {
  ArrowLeft,
  Award,
  QrCode,
  Clock,
  FileCheck,
  UserCheck,
  BadgeCheck,
  CircleAlert,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common"

const STEPS = [
  { icon: Clock, label: "学习时长" },
  { icon: FileCheck, label: "在线测评" },
  { icon: UserCheck, label: "人工复核" },
  { icon: BadgeCheck, label: "颁发证书" },
]

const APPLIABLE = [
  {
    id: "ppt-adv",
    title: "PPT设计 · 高级",
    status: "已满足 20 课时学习时长",
    ok: true,
    action: "申请测评 ¥39",
  },
  {
    id: "ps-mid",
    title: "PS修图 · 中级",
    status: "还需 8 课时（当前 12/20）",
    ok: false,
    action: "未满足",
  },
]

export default function Cert() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="技能认证"
        sub="电子证书 · 区块链存证"
        back={
          <Link
            to="/me"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        }
      />

      {/* 证书卡片 */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border-2 border-hcyellow-300 bg-gradient-to-br from-hcyellow-50 to-white p-6 shadow-md">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-hcyellow-100" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-hcyellow-600" />
            <span className="text-sm font-bold text-hcyellow-800">通用技能电子证书</span>
          </div>
          <span className="text-xs text-gray-400">NO. HC20260927</span>
        </div>
        <h2 className="relative mt-4 text-2xl font-bold text-ink">PPT设计 · 高级</h2>
        <p className="relative mt-1 text-sm text-gray-500">持证人：小明同学 · 武汉大学</p>
        <p className="relative mt-0.5 text-xs text-gray-400">
          换才平台 × 第三方权威培训机构 联合颁发
        </p>
        <div className="relative mt-4 flex items-end justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-hc-50 px-3 py-1.5 text-xs font-bold text-hc-700 ring-1 ring-hc-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            区块链已存证
          </span>
          <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <QrCode className="h-10 w-10 text-gray-700" />
          </span>
        </div>
      </div>

      {/* 认证流程 */}
      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-ink">认证流程</h2>
        <div className="flex items-center">
          {STEPS.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hc-100 text-hc-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs text-gray-600">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="mx-1 mb-5 h-px flex-1 bg-dashed bg-gray-200" />}
            </div>
          ))}
        </div>
      </section>

      {/* 可申请认证 */}
      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold text-ink">可申请认证</h2>
        <div className="space-y-2">
          {APPLIABLE.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hcyellow-100 text-hcyellow-600">
                <Award className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">{a.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{a.status}</p>
              </div>
              {a.ok ? (
                <button
                  onClick={() => toast.success("测评申请已提交", { description: "AI 测评链接已发送到消息中心" })}
                  className="shrink-0 rounded-full bg-hc-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-hc-500/30 hover:bg-hc-600"
                >
                  {a.action}
                </button>
              ) : (
                <span className="shrink-0 rounded-full bg-gray-200 px-4 py-1.5 text-xs font-medium text-gray-400">
                  {a.action}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-muted-foreground">
          <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-hcyellow-500" />
          测评费 39 元/项（学生价），AI 测评 + 人工复核，证书可用于求职背景提升。
        </p>
      </section>
    </div>
  )
}

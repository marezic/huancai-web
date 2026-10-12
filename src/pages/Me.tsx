import { useState } from "react"
import { Link } from "react-router"
import {
  Crown,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  GraduationCap,
  BadgeCheck,
  Heart,
  Coins,
  Settings,
  ChevronRight,
  PencilLine,
  Cloud,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, PageHeader } from "@/components/common"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useStore } from "@/store"

const ORDER_TABS = [
  { key: "待确认", icon: Hourglass },
  { key: "进行中", icon: Clock },
  { key: "已完成", icon: CheckCircle2 },
  { key: "已取消", icon: XCircle },
]

const MENU = [
  { to: "/publish", icon: GraduationCap, title: "我的技能", desc: "已发布 3 个" },
  { to: "/cert", icon: BadgeCheck, title: "我的证书", desc: "PPT设计 · 高级" },
  { to: "/skills", icon: Heart, title: "我的收藏", desc: "" },
  { to: "/points", icon: Coins, title: "才分明细", desc: "" },
  { to: "/me", icon: Settings, title: "设置与帮助", desc: "" },
]

export default function Me() {
  const { points, orders, mySkills, userLabel, dbReady, rename, logout } = useStore()
  const tab = ORDER_TABS[0].key
  const [editOpen, setEditOpen] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)

  const saveName = async () => {
    const name = nameInput.trim()
    if (!name) {
      toast.error("用户名不能为空")
      return
    }
    setSavingName(true)
    const ok = await rename(name)
    setSavingName(false)
    if (ok) {
      toast.success("用户名已更新", { description: "你发布的技能也会同步显示新名字" })
      setEditOpen(false)
    } else {
      toast.error("修改失败，请检查网络后重试")
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="个人中心" sub="数据资产 · 订单 · 会员" />

      {/* 用户卡片 */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-hc-500 via-hc-600 to-hc-700 p-6 text-white shadow-lg shadow-hc-500/25">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <Avatar name={userLabel ?? "游客"} color="#ffffff" size={64} className="text-hc-700" />
            {dbReady && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-hc-600 bg-hcyellow-400">
                <Crown className="h-3 w-3 text-hcyellow-800" />
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{dbReady ? userLabel : "游客"}</h2>
              {dbReady ? (
                <>
                  <span className="rounded-full bg-hcyellow-400 px-2 py-0.5 text-[11px] font-bold text-hcyellow-900">
                    钻石用户
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium ring-1 ring-white/25">
                    <Cloud className="h-3 w-3" />
                    云端已连接
                  </span>
                </>
              ) : (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium ring-1 ring-white/25">
                  未登录
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-white/75">
              {dbReady
                ? `云端账号 · 发布内容全站实时同步 ✓`
                : "登录后可发布技能，数据和全站同学实时同步"}
            </p>
          </div>
          {dbReady ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNameInput(userLabel ?? "")
                  setEditOpen(true)
                }}
                className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs ring-1 ring-white/25 transition-colors hover:bg-white/25"
              >
                <PencilLine className="h-3.5 w-3.5" />
                改用户名
              </button>
              <button
                onClick={async () => {
                  await logout()
                  toast.success("已退出登录")
                }}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs ring-1 ring-white/25 transition-colors hover:bg-white/25"
              >
                退出
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-hc-700 transition-transform hover:scale-105"
            >
              登录 / 注册
            </Link>
          )}
        </div>

        {/* 数据资产 */}
        <div className="relative mt-5 grid grid-cols-4 divide-x divide-white/15 rounded-2xl bg-white/10 py-3 ring-1 ring-white/15">
          {[
            ["才分", points.toLocaleString()],
            ["完成课程", "24"],
            ["教学时长", "56h"],
            ["我的关注", "128"],
          ].map(([label, value]) => (
            <Link to="/points" key={label} className="text-center transition-opacity hover:opacity-80">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[11px] text-white/70">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 会员横幅 */}
      <button
        onClick={() => toast.success("已开通妙手·学期卡", { description: "学生认证用户首学期免费（演示）" })}
        className="mb-6 flex w-full items-center gap-3 rounded-2xl bg-[#2A2F38] p-4 text-left text-white shadow-md transition-transform hover:scale-[1.01]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hcyellow-400/20 text-hcyellow-400">
          <Crown className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold">妙手 · 学期卡会员</span>
          <span className="block text-xs text-white/60">
            优先派单 · 才分加成 8% · 认证折扣
          </span>
        </span>
        <span className="rounded-full bg-hcyellow-400 px-4 py-1.5 text-xs font-bold text-hcyellow-900">
          ¥0 开通
        </span>
      </button>

      {/* 我的订单 */}
      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink">我的订单</h2>
          <span className="text-xs text-gray-400">{orders.length} 个订单</span>
        </div>
        <div className="mb-4 grid grid-cols-4 gap-2">
          {ORDER_TABS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => toast.info(`${key}订单`, { description: "演示环境：订单筛选即将上线" })}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors ${
                tab === key ? "bg-hc-50" : "hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5 text-gray-500" />
              <span className="text-xs text-gray-600">{key}</span>
            </button>
          ))}
        </div>
        {orders.length > 0 ? (
          <div className="space-y-2">
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hc-100 text-hc-700">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{o.skillTitle}</p>
                  <p className="text-xs text-gray-400">
                    {o.date} {o.time} · {o.mode} · @{o.teacherName}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-hcyellow-50 px-2.5 py-1 text-[11px] font-bold text-hcyellow-700 ring-1 ring-hcyellow-200">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-gray-400">暂无订单，去下一单吧</p>
        )}
        <Link
          to={orders[0] ? `/teach/${orders[0].skillId}` : "/skills"}
          className="mt-3 block rounded-xl bg-hc-500 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-hc-600"
        >
          {orders[0] ? "进入教室上课" : "去找技能"}
        </Link>
      </section>

      {/* 功能菜单 */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {MENU.map(({ to, icon: Icon, title, desc }, i) => (
          <Link
            key={title}
            to={to}
            className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 ${
              i !== 0 ? "border-t border-gray-50" : ""
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hc-50 text-hc-700">
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm font-medium text-ink">
              {title}
              {title === "我的技能" && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {mySkills.length} 个
                </span>
              )}
              {desc && title !== "我的技能" && (
                <span className="ml-2 text-xs font-normal text-gray-400">{desc}</span>
              )}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        ))}
      </section>

      {/* 修改用户名弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改用户名</DialogTitle>
            <DialogDescription>新名字会同步显示在你发布的所有技能上</DialogDescription>
          </DialogHeader>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={12}
            placeholder="输入新用户名"
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"
          />
          <button
            onClick={saveName}
            disabled={savingName}
            className="mt-2 w-full rounded-xl bg-hc-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-hc-600 disabled:opacity-60"
          >
            {savingName ? "保存中…" : "保存"}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

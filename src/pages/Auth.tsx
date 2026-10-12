import { useState } from "react"
import { useNavigate } from "react-router"
import { GraduationCap, Mail, Lock, UserRound, Loader2, CircleAlert } from "lucide-react"
import { toast } from "sonner"
import { useStore } from "@/store"
import { cn } from "@/lib/utils"

type Mode = "login" | "register"

export default function Auth() {
  const nav = useNavigate()
  const { login, register } = useStore()
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setError("")
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("请填写正确的邮箱地址")
      return
    }
    if (password.length < 6) {
      setError("密码至少 6 位")
      return
    }
    if (mode === "register" && !nickname.trim()) {
      setError("给自己起个用户名吧")
      return
    }
    setBusy(true)
    const res =
      mode === "login"
        ? await login(email.trim(), password)
        : await register(email.trim(), password, nickname.trim())
    setBusy(false)
    if (!res.ok) {
      setError(res.message)
      return
    }
    if ("needsConfirm" in res && res.needsConfirm) {
      toast.success(res.message)
      setMode("login")
      return
    }
    toast.success(mode === "login" ? "欢迎回来！" : "注册成功，欢迎加入换才！", {
      description: "去「我的」页面可以修改用户名",
    })
    nav("/me")
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-hc-400 focus:bg-white focus:ring-2 focus:ring-hc-100"

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-hc-500 text-white shadow-lg shadow-hc-500/30">
          <GraduationCap className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-bold text-ink">{mode === "login" ? "登录换才" : "注册换才账号"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "登录后发布技能、同步云端数据" : "注册即可发布技能，和全校同学互换技能"}
        </p>
      </div>

      {/* 登录 / 注册切换 */}
      <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-gray-100 p-1.5">
        {(
          [
            { key: "login", label: "登录" },
            { key: "register", label: "注册" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setMode(key)
              setError("")
            }}
            className={cn(
              "rounded-xl py-2.5 text-sm font-bold transition-all",
              mode === key ? "bg-white text-hc-700 shadow-md" : "text-gray-500 hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {mode === "register" && (
          <div className="relative">
            <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="用户名（显示在技能列表里）"
              maxLength={12}
              className={inputCls}
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱（如 xxx@stu.edu.cn）"
            className={inputCls}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少 6 位）"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className={inputCls}
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            <CircleAlert className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-hc-500 py-3.5 text-base font-bold text-white shadow-lg shadow-hc-500/30 transition-all hover:bg-hc-600 active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? "登录" : "注册并登录"}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          {mode === "login" ? "还没有账号？点上方「注册」免费创建" : "注册即表示同意《换才用户协议》与《隐私政策》"}
        </p>
      </div>
    </div>
  )
}

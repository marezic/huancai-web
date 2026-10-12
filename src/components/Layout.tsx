import { NavLink, Outlet, Link } from "react-router"
import {
  ArrowLeftRight,
  Menu,
  Search,
  MessageCircle,
  Coins,
  LayoutGrid,
  Compass,
  PlusCircle,
  CalendarDays,
  Trophy,
  User,
  BadgeCheck,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/common"
import AIAssistant from "@/components/AIAssistant"
import { useStore } from "@/store"
import { CONVERSATIONS } from "@/data"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/", label: "首页", icon: LayoutGrid },
  { to: "/skills", label: "找技能", icon: Compass },
  { to: "/publish", label: "发布技能", icon: PlusCircle },
  { to: "/messages", label: "消息", icon: MessageCircle, badge: true },
  { to: "/activities", label: "活动", icon: CalendarDays },
  { to: "/leaderboard", label: "排行榜", icon: Trophy },
  { to: "/me", label: "我的", icon: User },
]

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-hc-400 to-hc-600 text-white shadow-md shadow-hc-500/30">
        <ArrowLeftRight className="h-5 w-5" strokeWidth={2.5} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-hcyellow-400" />
      </span>
      <span className="leading-tight">
        <span className="block text-xl font-bold tracking-wide text-ink">换才</span>
        <span className="block text-[11px] text-muted-foreground">换出技能 · 换出未来</span>
      </span>
    </Link>
  )
}

function NavLinks({ onClick, className }: { onClick?: () => void; className?: string }) {
  const { readConvs } = useStore()
  const unread = CONVERSATIONS.filter((c) => !readConvs.includes(c.id)).reduce(
    (sum, c) => sum + c.unread,
    0,
  )
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClick}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-hc-50 text-hc-700 shadow-sm ring-1 ring-hc-200"
                : "text-gray-600 hover:bg-gray-100 hover:text-ink",
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
          {badge && unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const { points } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Logo />
          <div className="hidden flex-1 justify-center lg:flex">
            <NavLinks />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/skills"
              className="hidden h-9 w-52 items-center gap-2 rounded-full bg-gray-100 px-3.5 text-sm text-gray-400 transition-colors hover:bg-gray-200 md:flex"
            >
              <Search className="h-4 w-4" />
              搜索想学的技能 / 达人
            </Link>
            <Link
              to="/points"
              className="inline-flex items-center gap-1.5 rounded-full bg-hcyellow-50 px-3 py-1.5 text-sm font-bold text-hcyellow-700 ring-1 ring-hcyellow-200 transition-transform hover:scale-105"
            >
              <Coins className="h-4 w-4 text-hcyellow-500" />
              {points.toLocaleString()}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none ring-hc-400 focus-visible:ring-2">
                <Avatar name="小明同学" color="#43CD68" size={36} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="font-bold">小明同学</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    ID 123456 · 武汉大学
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/me">
                    <User className="mr-2 h-4 w-4" /> 个人中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/cert">
                    <BadgeCheck className="mr-2 h-4 w-4" /> 技能认证
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/verify">
                    <ShieldCheck className="mr-2 h-4 w-4" /> 校园实名认证
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-400">
                  <LogOut className="mr-2 h-4 w-4" /> 退出登录（演示）
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="rounded-lg p-2 hover:bg-gray-100 lg:hidden">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="mb-6 mt-2">
                  <Logo onClick={() => setOpen(false)} />
                </div>
                <NavLinks
                  onClick={() => setOpen(false)}
                  className="flex-col items-stretch gap-1.5"
                />
                <Link
                  to="/me"
                  onClick={() => setOpen(false)}
                  className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm text-gray-500"
                >
                  个人中心
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-hc-400 to-hc-600 text-white">
              <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-bold text-ink">换才 Huancai</span>
            <span className="text-xs">· 校园技能互换平台</span>
          </div>
          <p className="text-xs text-muted-foreground">
            以「交换、连接、成长」为核心理念 —— 用你的技能，交换世界
          </p>
          <p className="text-xs text-gray-400">
            成长绿 #43CD68 · 连接蓝 #3D8AF7 · 收获黄 #FFC107 ｜ © 2026 换才项目组
          </p>
        </div>
      </footer>

      <AIAssistant />
    </div>
  )
}

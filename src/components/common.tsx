import { Star, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { CERT_STYLE, type CertLevel } from "@/data"

// 彩色圆形头像（设计稿中的首字头像）
export function Avatar({
  name,
  color,
  size = 40,
  className,
}: {
  name: string
  color: string
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold text-white", className)}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.42 }}
    >
      {name.slice(0, 1)}
    </div>
  )
}

// 认证徽章：黄金 / 白银 / 钻石 / 校园
export function CertBadge({ level, className }: { level: CertLevel; className?: string }) {
  const style = CERT_STYLE[level]
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-none", className)}
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      {level}
    </span>
  )
}

// 才分标签
export function PointsTag({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-hcyellow-50 px-2 py-0.5 text-xs font-semibold text-hcyellow-700 ring-1 ring-hcyellow-200",
        className,
      )}
    >
      <Coins className="h-3 w-3 text-hcyellow-500" />
      才分 {value}
    </span>
  )
}

// 评分星星
export function Stars({
  value,
  size = 14,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? "fill-hcyellow-400 text-hcyellow-400" : "text-gray-300"}
        />
      ))}
    </span>
  )
}

// 区块标题（「热门技能 更多›」样式）
export function SectionTitle({
  title,
  extra,
  action,
}: {
  title: string
  extra?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {extra && <p className="mt-0.5 text-xs text-muted-foreground">{extra}</p>}
      </div>
      {action}
    </div>
  )
}

// 才分余额小药丸（导航栏用）
export function PointsPill({ points }: { points: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-hcyellow-50 px-3 py-1.5 text-sm font-bold text-hcyellow-700 ring-1 ring-hcyellow-200">
      <Coins className="h-4 w-4 text-hcyellow-500" />
      {points.toLocaleString()}
    </span>
  )
}

// 页头（返回 + 标题）
export function PageHeader({
  title,
  sub,
  back,
  right,
}: {
  title: string
  sub?: string
  back?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {back}
        <div>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

import { Link } from "react-router"
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Trophy,
  CalendarDays,
  ShieldCheck,
  Coins,
  BadgeCheck,
  MapPin,
  Users,
  MonitorPlay,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, CertBadge, PointsTag, SectionTitle } from "@/components/common"
import { HOT_TAGS, FEATURES, type Skill } from "@/data"
import { useStore } from "@/store"

const FEATURE_ICONS: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  coins: Coins,
  badge: BadgeCheck,
  "map-pin": MapPin,
  users: Users,
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link
      to={`/skills/${skill.id}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
      />
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <h3 className="font-bold text-ink group-hover:text-hc-700">{skill.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{skill.subtitle}</p>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: skill.color }}
        >
          <GraduationCap className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar name={skill.teacher.name} color={skill.color} size={22} />
        @{skill.teacher.name}
        <CertBadge level={skill.teacher.cert} />
        {skill.teacher.distance && (
          <span className="ml-auto inline-flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            {skill.teacher.distance}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
        <PointsTag value={skill.price} />
        <span className="text-xs text-muted-foreground">/课时</span>
        {skill.exchange && (
          <span className="rounded-full bg-hcblue-50 px-2 py-0.5 text-[11px] font-medium text-hcblue-600">
            可技能互换
          </span>
        )}
      </div>
    </Link>
  )
}

export default function Home() {
  const { mySkills, allSkills } = useStore()
  const featured = allSkills.filter((s) => s.hot)

  return (
    <div className="space-y-12">
      {/* Hero —— 设计稿首页头图「用你的技能 交换世界」 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hc-500 via-hc-600 to-hc-700 px-6 py-12 text-white md:px-12 md:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-32 h-72 w-72 rounded-full bg-hcyellow-400/20" />
        <div className="pointer-events-none absolute right-10 top-10 hidden md:block">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <ArrowRight className="h-16 w-16 rotate-[-30deg] opacity-80" />
          </div>
        </div>
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
            <Sparkles className="h-3.5 w-3.5 text-hcyellow-300" />
            武汉大学 · 校园技能互换平台
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
            用你的技能
            <br />
            交换世界
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            以「交换、连接、成长」为核心理念：教别人你会的，学你想学的，
            才分互通、双向认证，让每一次交换都靠谱可见。
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-7 font-bold text-hc-700 hover:bg-hc-50">
              <Link to="/skills">
                立即体验
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/publish">发布我的技能</Link>
            </Button>
          </div>
          <div className="mt-8 flex gap-6 text-sm">
            {[
              ["2,400+", "入驻达人"],
              ["15,000+", "完成交换"],
              ["98%", "好评率"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-xl font-bold">{num}</div>
                <div className="text-xs text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 快捷入口 —— 找技能 / 教技能 / 排行榜 / 线下活动 */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { to: "/skills", label: "找技能", desc: "智能匹配想学", icon: Compass, color: "#43CD68" },
          { to: "/publish", label: "教技能", desc: "发布你能教", icon: GraduationCap, color: "#3D8AF7" },
          { to: "/leaderboard", label: "排行榜", desc: "技能大神榜", icon: Trophy, color: "#FFC107" },
          { to: "/activities", label: "线下活动", desc: "工作坊·技能节", icon: CalendarDays, color: "#FF7A7A" },
        ].map(({ to, label, desc, icon: Icon, color }) => (
          <Link
            key={label}
            to={to}
            className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-bold text-ink">{label}</span>
              <span className="block text-xs text-muted-foreground">{desc}</span>
            </span>
          </Link>
        ))}
      </section>

      {/* 热门技能 —— 首页标签 */}
      <section>
        <SectionTitle
          title="热门技能"
          action={
            <Link to="/skills" className="inline-flex items-center text-sm font-medium text-hc-600 hover:text-hc-700">
              更多 <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="flex flex-wrap gap-2.5">
          {HOT_TAGS.map((tag) => (
            <Link
              key={tag}
              to={`/skills?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-hc-300 hover:bg-hc-50 hover:text-hc-700"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* 推荐课程 —— 设计稿首页「推荐课程」卡片 */}
      <section>
        <SectionTitle
          title="推荐课程"
          extra="由校园达人授课 · 才分结算"
          action={
            <Link to="/skills" className="inline-flex items-center text-sm font-medium text-hc-600 hover:text-hc-700">
              全部课程 <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* 我发布的技能（真实数据：发布后出现在这里） */}
      {mySkills.length > 0 && (
        <section>
          <SectionTitle title="我发布的技能" extra="发布即上架，可在「我的」中管理" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mySkills.slice(0, 4).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* 平台特色 —— 设计稿 P1 核心特色功能 */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <SectionTitle
          title="为什么选择换才"
          extra="校园实名 + 才分闭环 + 认证体系，让技能交换更放心"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(({ icon, title, desc }) => {
            const Icon = FEATURE_ICONS[icon]
            return (
              <div
                key={title}
                className="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-hc-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hc-100 text-hc-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-bold text-ink">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-hcblue-50 p-3 text-xs text-hcblue-700">
          <MonitorPlay className="h-4 w-4 shrink-0" />
          线上视频教室内置互动白板；交易由平台担保托管，争议 48 小时内仲裁。
        </div>
      </section>
    </div>
  )
}

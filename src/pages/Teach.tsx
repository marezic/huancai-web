import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PenTool,
  MoreHorizontal,
  PhoneOff,
  ArrowLeft,
  Presentation,
  MousePointer2,
  Square,
  Type,
  Image as ImageIcon,
  Undo2,
} from "lucide-react"
import { SKILLS } from "@/data"
import { cn } from "@/lib/utils"

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function Teach() {
  const { id } = useParams()
  const skill = SKILLS.find((s) => s.id === id) ?? SKILLS[0]
  const [sec, setSec] = useState(23 * 60 + 45)
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [boardOpen, setBoardOpen] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setSec((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      {/* 教室顶栏 */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#20242B] px-5 py-3.5 text-white">
        <Link
          to={`/skills/${skill.id}`}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/15 transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          退出教室
        </Link>
        <div className="text-center">
          <p className="text-sm font-bold">与 @{skill.teacher.name} 授课中</p>
          <p className="text-xs text-white/60">
            {fmt(sec)} · 已消耗 {Math.floor(sec / 60) * 2 + 10} 才分
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 ring-1 ring-red-500/30">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          录制中
        </span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 视频区 */}
        <div className="relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-b from-[#2A2F38] to-[#20242B]">
          <div className="flex aspect-video flex-col items-center justify-center text-white">
            {/* 讲师画面 */}
            <div className="relative">
              <div
                className={cn(
                  "flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-2xl transition-all",
                  !cam && "opacity-30 grayscale",
                )}
                style={{ backgroundColor: skill.color }}
              >
                {skill.teacher.name.slice(0, 1)}
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-hc-500 px-2.5 py-0.5 text-[11px] font-bold">
                讲师
              </span>
            </div>
            <p className="mt-4 text-sm text-white/70">{skill.teacher.name} 正在讲解…</p>
            {!mic && <p className="mt-1 text-xs text-red-400">你已静音</p>}

            {/* 我的小画面 */}
            <div className="absolute bottom-4 right-4 flex h-24 w-36 items-center justify-center rounded-2xl bg-[#3D4654] shadow-lg ring-1 ring-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hcblue-500 text-lg font-bold">
                我
              </div>
              <span className="absolute bottom-1.5 left-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px]">
                我
              </span>
            </div>
          </div>

          {/* 底部控制条 */}
          <div className="flex items-center justify-center gap-3 bg-[#1B1F26] px-4 py-4">
            <button
              onClick={() => setMic(!mic)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                mic ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-gray-800",
              )}
              title="麦克风"
            >
              {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setCam(!cam)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                cam ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-gray-800",
              )}
              title="摄像头"
            >
              {cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setBoardOpen(!boardOpen)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                boardOpen ? "bg-hc-500 text-white shadow-lg shadow-hc-500/40" : "bg-white/10 text-white hover:bg-white/20",
              )}
              title="白板"
            >
              <PenTool className="h-5 w-5" />
            </button>
            <button
              onClick={() => alert("更多：共享屏幕 / 举手 / 聊天记录（演示）")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
              title="更多"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <Link
              to={`/review/${skill.id}`}
              className="flex h-11 items-center gap-2 rounded-full bg-red-500 px-5 font-bold text-white shadow-lg shadow-red-500/40 transition-all hover:bg-red-600"
              title="结束并挂断"
            >
              <PhoneOff className="h-5 w-5" />
              挂断下课
            </Link>
          </div>
        </div>

        {/* 互动白板 */}
        {boardOpen && (
          <div className="w-full shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:w-80">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <Presentation className="h-4 w-4 text-hc-600" />
                互动白板 · PPT 排版
              </span>
              <span className="flex items-center gap-1 rounded-full bg-hc-50 px-2 py-0.5 text-[11px] font-medium text-hc-700 ring-1 ring-hc-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-hc-500" />
                共享中
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-ink">排版四大原则：</h3>
              <ol className="mt-2 space-y-1.5 text-sm text-gray-600">
                {["对齐", "对比", "重复", "亲密性"].map((p, i) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-hc-100 text-[11px] font-bold text-hc-700">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>

              {/* 白板画布示意 */}
              <div className="relative mt-4 aspect-[4/3] rounded-xl border border-gray-200 bg-[#FAFBFC]">
                <div className="absolute left-3 top-3 h-2 w-16 rounded-full bg-gray-300" />
                <div className="absolute left-3 top-8 h-1.5 w-24 rounded-full bg-gray-200" />
                <div className="absolute left-3 top-12 h-1.5 w-20 rounded-full bg-gray-200" />
                <div className="absolute right-3 top-3 h-20 w-24 rounded-lg border-2 border-hcblue-400 bg-white shadow-sm" />
                <div className="absolute right-6 top-8 h-1.5 w-14 rounded-full bg-hcblue-200" />
                <div className="absolute right-6 top-12 h-1.5 w-10 rounded-full bg-hcblue-200" />
                <span className="absolute bottom-2 right-3 rounded bg-hcblue-50 px-1.5 py-0.5 text-[10px] font-medium text-hcblue-600 ring-1 ring-hcblue-200">
                  对齐
                </span>
              </div>

              {/* 白板工具 */}
              <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 p-2">
                {[MousePointer2, PenTool, Square, Type, ImageIcon, Undo2].map((Icon, i) => (
                  <button
                    key={i}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white hover:text-hc-700",
                      i === 1 && "bg-white text-hc-700 shadow-sm",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

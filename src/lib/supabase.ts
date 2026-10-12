// 换才 · Supabase 云端数据层
// 配置好 SUPABASE_URL 和 SUPABASE_ANON_KEY 后，网站自动启用云端模式：
//   游客打开页面即自动获得匿名账号 → 发布的技能写入云端数据库 → 所有人实时看到
// 不配置（留空字符串）则保持纯演示模式，行为与之前完全一致。
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Skill } from "@/data"

// ============ 在这里填入你的 Supabase 项目凭证 ============
// 获取方式：supabase.com 免费注册 → New Project → Project Settings → API
export const SUPABASE_URL = ""
export const SUPABASE_ANON_KEY = ""
// ===========================================================

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return client
}

export interface SessionInfo {
  userId: string
  nickname: string
}

function randomNickname(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"
  let tail = ""
  for (let i = 0; i < 4; i++) tail += chars[Math.floor(Math.random() * chars.length)]
  return `同学${tail}`
}

/** 确保有一个匿名身份（Supabase 需在后台开启 Anonymous sign-ins），并建档到 profiles 表 */
export async function ensureSession(): Promise<SessionInfo | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data: auth, error: authErr } = await sb.auth.signInAnonymously()
  if (authErr || !auth.user) return null
  const userId = auth.user.id

  const { data: existing } = await sb
    .from("profiles")
    .select("nickname")
    .eq("id", userId)
    .maybeSingle()

  if (existing?.nickname) return { userId, nickname: existing.nickname }

  const nickname = randomNickname()
  await sb.from("profiles").upsert({ id: userId, nickname })
  return { userId, nickname }
}

export interface DbSkillRow {
  id: string
  user_id: string
  nickname: string | null
  title: string
  subtitle: string
  category: string
  description: string | null
  mode: string
  price: number
  exchange: boolean
  color: string
  created_at: string
}

export function dbRowToSkill(row: DbSkillRow): Skill {
  return {
    id: `db-${row.id}`,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category,
    teacher: {
      id: row.user_id,
      name: row.nickname ?? "换才同学",
      school: "校园认证用户",
      cert: "校园认证",
      rating: 5.0,
      lessons: 0,
      distance: "线上",
    },
    price: row.price,
    mode: (row.mode as Skill["mode"]) ?? "均可",
    exchange: row.exchange,
    color: row.color,
    hot: true,
    intro: row.description ?? "",
    slots: ["时间可协商"],
  }
}

/** 拉取全站技能（最新在前） */
export async function fetchRemoteSkills(): Promise<Skill[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb
    .from("skills")
    .select("*")
    .order("created_at", { ascending: false })
  if (error || !data) return []
  return (data as DbSkillRow[]).map(dbRowToSkill)
}

export interface NewSkillPayload {
  title: string
  subtitle: string
  category: string
  description: string
  mode: string
  price: number
  exchange: boolean
  color: string
  nickname: string
}

/** 发布技能到云端，返回映射后的 Skill（失败返回 null） */
export async function insertSkill(
  userId: string,
  payload: NewSkillPayload,
): Promise<Skill | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("skills")
    .insert({ user_id: userId, ...payload })
    .select()
    .single()
  if (error || !data) return null
  return dbRowToSkill(data as DbSkillRow)
}

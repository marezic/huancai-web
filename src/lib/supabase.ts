// 换才 · Supabase 云端数据层
// 配置好 SUPABASE_URL 和 SUPABASE_ANON_KEY 后，网站自动启用云端模式：
//   游客打开页面即自动获得匿名账号 → 发布的技能写入云端数据库 → 所有人实时看到
// 不配置（留空字符串）则保持纯演示模式，行为与之前完全一致。
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Skill } from "@/data"

// ============ 在这里填入你的 Supabase 项目凭证 ============
// 获取方式：supabase.com 免费注册 → New Project → Project Settings → API
export const SUPABASE_URL = "https://dfeiitlfmyhzemlraisc.supabase.co"
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZWlpdGxmbXloemVtbHJhaXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3OTEyMTEsImV4cCI6MjEwNzM2NzIxMX0.j7rtS9jIY4ouNAd_w8B879LiwLTONLDy1ZAGksl2iXM"
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

async function loadProfileNickname(sb: SupabaseClient, userId: string): Promise<string> {
  const { data } = await sb
    .from("profiles")
    .select("nickname")
    .eq("id", userId)
    .maybeSingle()
  return data?.nickname ?? randomNickname()
}

/** 读取本地已持久化的登录会话（supabase-js 自动存 localStorage） */
export async function getExistingSession(): Promise<SessionInfo | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  const user = data.session?.user
  if (!user) return null
  const nickname = await loadProfileNickname(sb, user.id)
  return { userId: user.id, nickname }
}

export interface AuthResult {
  ok: boolean
  message: string
  /** 邮箱确认开启时注册成功但未登录 */
  needsConfirm?: boolean
  session?: SessionInfo
}

/** 注册：邮箱 + 密码 + 用户名（若后台开启了邮箱确认，则注册后需先去邮箱点链接） */
export async function signUp(
  email: string,
  password: string,
  nickname: string,
): Promise<AuthResult> {
  const sb = getSupabase()
  if (!sb) return { ok: false, message: "云端未配置" }
  const { data, error } = await sb.auth.signUp({ email, password })
  if (error) return { ok: false, message: error.message }
  const user = data.user
  if (!user) return { ok: false, message: "注册失败，请重试" }
  const nick = nickname.trim() || randomNickname()
  await sb.from("profiles").upsert({ id: user.id, nickname: nick })
  if (!data.session) {
    return { ok: true, needsConfirm: true, message: "注册成功！请先到邮箱点击确认链接，再回来登录" }
  }
  return { ok: true, message: "注册成功，已自动登录", session: { userId: user.id, nickname: nick } }
}

/** 登录：邮箱 + 密码 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const sb = getSupabase()
  if (!sb) return { ok: false, message: "云端未配置" }
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: "邮箱或密码不正确" }
  const userId = data.user.id
  const nickname = await loadProfileNickname(sb, userId)
  await sb.from("profiles").upsert({ id: userId, nickname })
  return { ok: true, message: "登录成功", session: { userId, nickname } }
}

export async function signOut(): Promise<void> {
  const sb = getSupabase()
  if (sb) await sb.auth.signOut()
}

/** 修改用户名：同步更新档案和自己已发布的技能 */
export async function updateNickname(userId: string, newName: string): Promise<boolean> {
  const sb = getSupabase()
  if (!sb) return false
  const { error } = await sb.from("profiles").update({ nickname: newName }).eq("id", userId)
  if (error) return false
  await sb.from("skills").update({ nickname: newName }).eq("user_id", userId)
  return true
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

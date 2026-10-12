import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import { SEED_TXNS, SKILLS, type Skill, type Txn } from "@/data"
import {
  dbRowToSkill,
  fetchRemoteSkills,
  getExistingSession,
  insertSkill,
  isSupabaseConfigured,
  signIn as sbSignIn,
  signOut as sbSignOut,
  signUp as sbSignUp,
  subscribeSkills,
  updateNickname as sbUpdateNickname,
  type SessionInfo,
} from "@/lib/supabase"

const STORE_KEY = "huancai-store-v1"

export interface Order {
  id: string
  skillId: string
  skillTitle: string
  teacherName: string
  date: string
  time: string
  mode: string
  price: number
  status: "待确认" | "进行中" | "已完成"
  createdAt: string
}

interface StoreState {
  points: number
  txns: Txn[]
  mySkills: Skill[]
  favorites: string[]
  orders: Order[]
  joinedActivities: string[]
  signedDates: string[]
  readConvs: string[]
  verified: boolean
  remoteSkills: Skill[]
  dbReady: boolean
  userLabel: string | null
}

const seedState: StoreState = {
  points: 1280,
  txns: SEED_TXNS,
  mySkills: SKILLS.filter((s) => s.hot).slice(0, 2),
  favorites: [],
  orders: [
    {
      id: "o1",
      skillId: "ppt",
      skillTitle: "PPT高阶设计 · 从入门到进阶",
      teacherName: "设计小能手",
      date: "明天 09/28",
      time: "15:00",
      mode: "线上视频授课",
      price: 150,
      status: "待确认",
      createdAt: "今天 14:32",
    },
  ],
  joinedActivities: ["ai-draw"],
  signedDates: [],
  readConvs: [],
  verified: true,
  remoteSkills: [],
  dbReady: false,
  userLabel: null,
}

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return { ...seedState, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return seedState
}

interface StoreApi extends StoreState {
  allSkills: Skill[]
  addTxn: (title: string, amount: number) => void
  publishSkill: (skill: Skill) => void
  toggleFav: (id: string) => void
  createOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order | null
  joinActivity: (id: string, cost: number, title: string) => boolean
  signIn: () => boolean
  markConvRead: (id: string) => void
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
  register: (
    email: string,
    password: string,
    nickname: string,
  ) => Promise<{ ok: boolean; message: string; needsConfirm?: boolean }>
  logout: () => Promise<void>
  rename: (newName: string) => Promise<boolean>
}

const StoreCtx = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState)
  const sessionRef = useRef<SessionInfo | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  // 云端模式：读取已有登录会话（未登录则以游客身份浏览，仍可看到全站技能）；
  // 未配置云端或请求失败时静默保持演示模式
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false
    ;(async () => {
      const session = await getExistingSession()
      if (cancelled) return
      if (session) {
        sessionRef.current = session
        setState((s) => ({ ...s, dbReady: true, userLabel: session.nickname }))
      }
      const remote = await fetchRemoteSkills()
      if (!cancelled && remote.length) {
        setState((s) => ({ ...s, remoteSkills: remote }))
      }
    })()

    // 实时订阅：别人发新帖 / 改帖 / 删帖时自动更新列表，无需手动刷新
    const unsubscribe = subscribeSkills((event, row) => {
      if (cancelled || !row?.id) return
      setState((s) => {
        if (event === "DELETE") {
          return { ...s, remoteSkills: s.remoteSkills.filter((r) => r.id !== `db-${row.id}`) }
        }
        const skill = dbRowToSkill(row)
        const rest = s.remoteSkills.filter((r) => r.id !== skill.id)
        return { ...s, remoteSkills: [skill, ...rest] }
      })
    })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const addTxn = useCallback((title: string, amount: number) => {
    setState((s) => ({
      ...s,
      points: s.points + amount,
      txns: [
        { id: `tx-${Date.now()}`, title, time: "刚刚", amount },
        ...s.txns,
      ],
    }))
  }, [])

  const publishSkill = useCallback((skill: Skill) => {
    setState((s) => ({ ...s, mySkills: [skill, ...s.mySkills] }))
    // 云端模式：后台同步到 Supabase，成功后以云端数据为准重新置顶
    const session = sessionRef.current
    if (session && isSupabaseConfigured) {
      insertSkill(session.userId, {
        title: skill.title,
        subtitle: skill.subtitle,
        category: skill.category,
        description: skill.intro ?? "",
        mode: skill.mode,
        price: skill.price,
        exchange: skill.exchange,
        color: skill.color,
        nickname: session.nickname,
      })
        .then((remote) => {
          if (remote) {
            setState((s) => ({
              ...s,
              remoteSkills: [remote, ...s.remoteSkills.filter((r) => r.id !== remote.id)],
            }))
          }
        })
        .catch(() => {
          toast.error("云端同步失败", { description: "技能已保存在本设备，稍后可重试" })
        })
    }
  }, [])

  const toggleFav = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id],
    }))
  }, [])

  const createOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt" | "status">): Order | null => {
      let created: Order | null = null
      setState((s) => {
        if (s.points < order.price) return s
        created = {
          ...order,
          id: `o-${Date.now()}`,
          status: "待确认",
          createdAt: "刚刚",
        }
        return {
          ...s,
          points: s.points - order.price,
          orders: [created as Order, ...s.orders],
          txns: [
            {
              id: `tx-${Date.now()}`,
              title: `预约课程 · ${order.skillTitle}`,
              time: "刚刚",
              amount: -order.price,
            },
            ...s.txns,
          ],
        }
      })
      return created
    },
    [],
  )

  const joinActivity = useCallback(
    (id: string, cost: number, title: string): boolean => {
      let ok = false
      setState((s) => {
        if (s.joinedActivities.includes(id)) return s
        if (cost > 0 && s.points < cost) return s
        ok = true
        return {
          ...s,
          points: s.points - cost,
          joinedActivities: [...s.joinedActivities, id],
          txns: cost
            ? [
                {
                  id: `tx-${Date.now()}`,
                  title: `活动报名 · ${title}`,
                  time: "刚刚",
                  amount: -cost,
                },
                ...s.txns,
              ]
            : s.txns,
        }
      })
      return ok
    },
    [],
  )

  const signIn = useCallback((): boolean => {
    const today = new Date().toISOString().slice(0, 10)
    let ok = false
    setState((s) => {
      if (s.signedDates.includes(today)) return s
      ok = true
      return {
        ...s,
        points: s.points + 5,
        signedDates: [...s.signedDates, today],
        txns: [
          { id: `tx-${Date.now()}`, title: "每日签到", time: "刚刚", amount: 5 },
          ...s.txns,
        ],
      }
    })
    return ok
  }, [])

  const markConvRead = useCallback((id: string) => {
    setState((s) =>
      s.readConvs.includes(id) ? s : { ...s, readConvs: [...s.readConvs, id] },
    )
  }, [])

  // ---- 账号体系：注册 / 登录 / 登出 / 改名 ----
  const applySession = useCallback((session: SessionInfo | null) => {
    sessionRef.current = session
    setState((s) => ({ ...s, dbReady: Boolean(session), userLabel: session?.nickname ?? null }))
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await sbSignIn(email, password)
      if (res.ok && res.session) applySession(res.session)
      return res
    },
    [applySession],
  )

  const register = useCallback(
    async (email: string, password: string, nickname: string) => {
      const res = await sbSignUp(email, password, nickname)
      if (res.ok && res.session) applySession(res.session)
      return res
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    await sbSignOut()
    applySession(null)
  }, [applySession])

  const rename = useCallback(
    async (newName: string) => {
      const session = sessionRef.current
      const name = newName.trim()
      if (!session || !name) return false
      const ok = await sbUpdateNickname(session.userId, name)
      if (ok) {
        sessionRef.current = { ...session, nickname: name }
        setState((s) => ({ ...s, userLabel: name }))
      }
      return ok
    },
    [],
  )

  const allSkills = useMemo<Skill[]>(
    () => [...state.remoteSkills, ...SKILLS],
    [state.remoteSkills],
  )

  const api = useMemo<StoreApi>(
    () => ({
      ...state,
      allSkills,
      addTxn,
      publishSkill,
      toggleFav,
      createOrder,
      joinActivity,
      signIn,
      markConvRead,
      login,
      register,
      logout,
      rename,
    }),
    [state, allSkills, addTxn, publishSkill, toggleFav, createOrder, joinActivity, signIn, markConvRead, login, register, logout, rename],
  )

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

export function useToastOk() {
  return useCallback((msg: string) => toast.success(msg), [])
}

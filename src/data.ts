// 换才 · 数据层 —— 对应 PPTX 设计稿 15 屏的全部业务数据
// 色彩体系（设计稿 P1）：主色 成长绿 #43CD68 / 辅助 连接蓝 #3D8AF7 / 点缀 收获黄 #FFC107 / 文字 墨色 #333333 / 背景 浅灰 #F7F8FA

export type CertLevel = "钻石认证" | "黄金认证" | "白银认证" | "校园认证"

export interface Teacher {
  id: string
  name: string
  school: string
  cert: CertLevel
  rating: number
  lessons: number
  distance?: string
}

export interface Skill {
  id: string
  title: string
  subtitle: string
  category: string
  teacher: Teacher
  price: number // 才分/课时
  mode: "在线授课" | "线下见面" | "均可"
  exchange: boolean // 支持技能互换
  color: string // 卡片主题色
  hot?: boolean
  intro?: string
  outline?: { no: string; text: string }[]
  reviewCount?: number
  sampleReview?: { name: string; text: string }
  slots?: string[]
}

export interface Conversation {
  id: string
  name: string
  school?: string
  cert?: CertLevel
  lastMsg: string
  time: string
  unread: number
  color: string
  online?: boolean
}

export interface ChatMsg {
  id: string
  from: "me" | "other" | "system"
  kind: "text" | "file" | "card"
  text?: string
  fileName?: string
  card?: { title: string; meta: string; price: number }
}

export interface Txn {
  id: string
  title: string
  sub?: string
  time: string
  amount: number // 正为赚取，负为支出
}

export interface Activity {
  id: string
  title: string
  time: string
  place: string
  left: number
  cost: number // 0 = 免费
  tag: string
  color: string
}

export interface RankUser {
  rank: number
  name: string
  skills: string
  score: number
  color: string
}

// ---------- 技能与老师 ----------

export const SKILLS: Skill[] = [
  {
    id: "ppt",
    title: "PPT高阶设计",
    subtitle: "从入门到进阶",
    category: "设计",
    teacher: {
      id: "t-design",
      name: "设计小能手",
      school: "武汉大学",
      cert: "黄金认证",
      rating: 5.0,
      lessons: 128,
      distance: "0.8km",
    },
    price: 150,
    mode: "在线授课",
    exchange: true,
    color: "#43CD68",
    hot: true,
    intro:
      "适合想提升PPT设计能力的同学，从基础排版到高级动画，手把手教你做出高颜值PPT。",
    outline: [
      { no: "01", text: "版式基础与排版四原则" },
      { no: "02", text: "配色方案与字体搭配" },
      { no: "03", text: "高级动画与切换效果" },
      { no: "04", text: "实战：高颜值PPT改造" },
    ],
    reviewCount: 128,
    sampleReview: { name: "李同学", text: "老师讲得很细，一次课就做出了满意的PPT！" },
    slots: ["今天 15:00", "明天 10:00", "周六 14:00"],
  },
  {
    id: "ps",
    title: "3天学会PS修图",
    subtitle: "入门到精通",
    category: "设计",
    teacher: {
      id: "t-rain",
      name: "小雨学姐",
      school: "武汉大学",
      cert: "白银认证",
      rating: 4.9,
      lessons: 86,
      distance: "1.5km",
    },
    price: 120,
    mode: "在线授课",
    exchange: false,
    color: "#3D8AF7",
    hot: true,
    intro: "三天速成：抠图、调色、人像精修一次讲透，作业一对一点评。",
    slots: ["今天 19:00", "明天 14:00", "周日 10:00"],
  },
  {
    id: "jp",
    title: "日语口语交流",
    subtitle: "N2→N1提升",
    category: "语言",
    teacher: {
      id: "t-sakura",
      name: "樱花学姐",
      school: "武汉大学",
      cert: "白银认证",
      rating: 4.8,
      lessons: 64,
      distance: "1.2km",
    },
    price: 100,
    mode: "均可",
    exchange: true,
    color: "#FF7A7A",
    hot: true,
    intro: "留日两年，情景式口语陪练，帮你突破 N2 到 N1 的表达瓶颈。",
    slots: ["今天 20:00", "周六 9:00", "周六 16:00"],
  },
  {
    id: "py",
    title: "Python数据分析",
    subtitle: "实战教学",
    category: "编程",
    teacher: {
      id: "t-data",
      name: "数据大佬",
      school: "华中科技大学",
      cert: "钻石认证",
      rating: 5.0,
      lessons: 152,
      distance: "2.5km",
    },
    price: 200,
    mode: "在线授课",
    exchange: true,
    color: "#3D8AF7",
    hot: true,
    intro: "pandas / numpy / 可视化实战，带你做出能写进简历的分析项目。",
    slots: ["明天 15:00", "周三 19:00", "周六 10:00"],
  },
  {
    id: "video",
    title: "短视频剪辑",
    subtitle: "从0到爆款",
    category: "剪辑",
    teacher: {
      id: "t-cut",
      name: "剪辑达人",
      school: "武汉大学",
      cert: "钻石认证",
      rating: 4.9,
      lessons: 97,
      distance: "3.1km",
    },
    price: 120,
    mode: "均可",
    exchange: true,
    color: "#9B7BF7",
    hot: true,
    intro: "剪映 + PR 双软件教学，从脚本到成片，揭秘爆款视频的节奏感。",
    slots: ["今天 16:00", "明天 20:00", "周日 14:00"],
  },
  {
    id: "ielts",
    title: "雅思口语",
    subtitle: "7分冲刺",
    category: "语言",
    teacher: {
      id: "t-english",
      name: "英语角张老师",
      school: "武汉大学",
      cert: "黄金认证",
      rating: 4.9,
      lessons: 210,
      distance: "0.6km",
    },
    price: 130,
    mode: "线下见面",
    exchange: false,
    color: "#2BB3A3",
    intro: "前新东方口语讲师，Part 2 素材库 + 全真模考点评。",
    slots: ["周六 10:00", "周六 15:00", "周日 9:00"],
  },
  {
    id: "guitar",
    title: "吉他弹唱",
    subtitle: "零基础到弹唱",
    category: "音乐",
    teacher: {
      id: "t-guitar",
      name: "老王吉他",
      school: "武汉大学",
      cert: "白银认证",
      rating: 4.7,
      lessons: 45,
      distance: "2.0km",
    },
    price: 90,
    mode: "线下见面",
    exchange: true,
    color: "#F7931E",
    intro: "民谣弹唱入门，和弦转换 + 流行曲目实战，琴我出。",
    slots: ["周五 19:00", "周六 19:00", "周日 16:00"],
  },
]

export const HOT_TAGS = ["PS修图", "PPT制作", "Python", "剪辑", "日语"]

export const CATEGORIES = ["设计", "编程", "语言", "办公", "生活", "音乐"]

// ---------- 消息 ----------

export const NOTICE_CARDS = [
  { key: "booking", label: "预约提醒", count: 2, color: "#43CD68" },
  { key: "system", label: "系统通知", count: 1, color: "#3D8AF7" },
  { key: "social", label: "互动消息", count: 0, color: "#FF7A7A" },
]

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-design",
    name: "设计小能手",
    school: "武汉大学",
    cert: "黄金认证",
    lastMsg: "好的，那我们约明天下午3点～",
    time: "14:32",
    unread: 2,
    color: "#43CD68",
    online: true,
  },
  {
    id: "c-sakura",
    name: "樱花学姐",
    lastMsg: "日语角活动周五晚老地方见！",
    time: "12:08",
    unread: 0,
    color: "#FF7A7A",
  },
  {
    id: "c-system",
    name: "系统通知",
    lastMsg: "你预约的「PPT高阶设计」已确认",
    time: "10:45",
    unread: 1,
    color: "#3D8AF7",
  },
  {
    id: "c-helper",
    name: "换才小助手",
    lastMsg: "恭喜获得60才分新手礼包",
    time: "昨天",
    unread: 0,
    color: "#FFC107",
  },
  {
    id: "c-data",
    name: "数模大佬",
    lastMsg: "Python课的提纲我发你了",
    time: "周三",
    unread: 0,
    color: "#9B7BF7",
  },
]

export const CHAT_THREADS: Record<string, ChatMsg[]> = {
  "c-design": [
    { id: "m1", from: "me", kind: "text", text: "你好～ 看到你发布的PPT课程，想预约明天下午" },
    { id: "m2", from: "other", kind: "text", text: "好的！明天下午3点可以吗？" },
    { id: "m3", from: "me", kind: "text", text: "可以！需要我准备什么吗？" },
    { id: "m4", from: "other", kind: "text", text: "记得提前准备一份你的PPT作品哦" },
    { id: "m5", from: "other", kind: "file", fileName: "作品集-参考模板.pptx" },
    { id: "m6", from: "system", kind: "text", text: "对方发起了预约" },
    {
      id: "m7",
      from: "other",
      kind: "card",
      card: { title: "PPT高阶设计从入门到进阶", meta: "明天 10/27 15:00 · 线上", price: 150 },
    },
    { id: "m8", from: "other", kind: "text", text: "没问题，我们明天见！" },
  ],
  "c-sakura": [
    { id: "s1", from: "other", kind: "text", text: "这周五日语角你来吗？" },
    { id: "s2", from: "me", kind: "text", text: "来！几点开始呀" },
    { id: "s3", from: "other", kind: "text", text: "老时间，晚上六点半，咖啡书吧" },
    { id: "s4", from: "other", kind: "text", text: "日语角活动周五晚老地方见！" },
  ],
  "c-system": [
    { id: "y1", from: "other", kind: "text", text: "你预约的「PPT高阶设计」已确认，明天 15:00 线上授课，请提前 10 分钟进入教室。" },
    { id: "y2", from: "other", kind: "text", text: "上课前可在「我的订单」中查看教室入口。" },
  ],
  "c-helper": [
    { id: "h1", from: "other", kind: "text", text: "欢迎加入换才！校园实名认证已完成，恭喜你获得 60 才分新手礼包 🎁" },
    { id: "h2", from: "other", kind: "text", text: "完成每日签到、发布技能都可以继续赚才分哦～" },
  ],
  "c-data": [
    { id: "d1", from: "me", kind: "text", text: "大佬，数据分析课有提纲吗？" },
    { id: "d2", from: "other", kind: "text", text: "有的，我整理一下发你" },
    { id: "d3", from: "other", kind: "text", text: "Python课的提纲我发你了" },
  ],
}

// ---------- 才分 ----------

export const SEED_TXNS: Txn[] = [
  { id: "t1", title: "完成授课 · PPT高阶设计", time: "今天 14:32", amount: 150 },
  { id: "t2", title: "兑换课程 · 3天学会PS修图", sub: "昨天 20:15", time: "昨天 20:15", amount: -120 },
  { id: "t3", title: "新手礼包 · 学生认证奖励", time: "09/25", amount: 60 },
  { id: "t4", title: "优质评价奖励", time: "09/24", amount: 10 },
]

export const TASKS = [
  { id: "verify", title: "完成学生认证", reward: 60, done: true },
  { id: "profile", title: "完善技能档案", reward: 20, done: false },
  { id: "invite", title: "邀请好友注册", reward: 15, done: false },
  { id: "signin", title: "每日签到", reward: 5, done: false },
]

export const SHOP_ITEMS = [
  { id: "match", title: "优先匹配卡", desc: "技能列表优先展示 7 天", cost: 200, icon: "zap" },
  { id: "ticket", title: "线下活动门票", desc: "技能节 / 工作坊通用", cost: 10, icon: "ticket" },
  { id: "coupon", title: "认证折扣券", desc: "技能认证测评费 8 折", cost: 300, icon: "badge" },
]

// ---------- 排行榜 ----------

export const RANKS: RankUser[] = [
  { rank: 1, name: "剪辑达人", skills: "短视频 · 影视后期", score: 11240, color: "#9B7BF7" },
  { rank: 2, name: "数据大佬", skills: "Python · 数据分析", score: 9860, color: "#3D8AF7" },
  { rank: 3, name: "樱花学姐", skills: "日语 · 翻译", score: 8540, color: "#FF7A7A" },
  { rank: 4, name: "小雨学姐", skills: "PS修图 · 摄影", score: 7820, color: "#43CD68" },
  { rank: 5, name: "英语角张老师", skills: "英语口语 · 雅思", score: 7450, color: "#2BB3A3" },
  { rank: 6, name: "光影捕手", skills: "摄影 · 后期", score: 6980, color: "#F7931E" },
  { rank: 7, name: "老王吉他", skills: "吉他 · 乐理", score: 6320, color: "#E05FA0" },
]

// ---------- 线下活动 ----------

export const ACTIVITIES: Activity[] = [
  {
    id: "ai-draw",
    title: "AI绘图分享会",
    time: "10/12 周日 14:00",
    place: "图书馆 3F 创客空间",
    left: 12,
    cost: 10,
    tag: "工作坊",
    color: "#3D8AF7",
  },
  {
    id: "ppt-fast",
    title: "PPT制作速成班",
    time: "10/15 周三 19:00",
    place: "教学楼 A201",
    left: 5,
    cost: 10,
    tag: "工作坊",
    color: "#43CD68",
  },
  {
    id: "jp-corner",
    title: "日语角 · 自由会话",
    time: "10/17 周五 18:30",
    place: "咖啡书吧",
    left: 20,
    cost: 0,
    tag: "兴趣社群",
    color: "#FF7A7A",
  },
  {
    id: "photo-walk",
    title: "校园光影外拍",
    time: "10/19 周日 15:00",
    place: "樱花大道集合",
    left: 8,
    cost: 10,
    tag: "兴趣社群",
    color: "#F7931E",
  },
  {
    id: "skill-fest",
    title: "校园技能节 · 秋季场",
    time: "10/18 周六 全天",
    place: "大学生活动中心",
    left: 999,
    cost: 0,
    tag: "技能节",
    color: "#9B7BF7",
  },
]

export const ACTIVITY_FILTERS = ["全部", "本周", "工作坊", "技能节", "兴趣社群"]

// ---------- 首页价值点（设计稿 P1 核心特色功能） ----------

export const FEATURES = [
  { icon: "shield", title: "校园实名认证", desc: "学信网 + 学生证双重认证" },
  { icon: "coins", title: "才分积分体系", desc: "学技能赚才分 · 换技能用才分" },
  { icon: "badge", title: "技能认证证书", desc: "测评通过颁发电子证书" },
  { icon: "map-pin", title: "LBS 智能匹配", desc: "基于位置就近找身边人" },
  { icon: "users", title: "线上线下结合", desc: "线上学习 + 线下活动" },
]

export const CERT_STYLE: Record<CertLevel, { bg: string; fg: string }> = {
  钻石认证: { bg: "#EAF2FE", fg: "#276AEB" },
  黄金认证: { bg: "#FFF6DC", fg: "#B68600" },
  白银认证: { bg: "#F0F1F3", fg: "#7A7F87" },
  校园认证: { bg: "#E7F8EE", fg: "#268A46" },
}

-- 换才 · Supabase 数据库初始化脚本
-- 使用方法：supabase.com 免费注册并新建项目后，进入左侧 SQL Editor，
-- 新建一个查询，把本文件全部内容粘贴进去，点击 Run 一次执行即可。

-- 1. 用户档案表（匿名登录后自动建档，昵称自动生成）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '同学',
  created_at timestamptz not null default now()
);

-- 2. 技能表（发布技能时写入，全站可读）
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text,
  title text not null,
  subtitle text not null default '',
  category text not null default '设计',
  description text,
  mode text not null default '均可',
  price int not null default 0,
  exchange boolean not null default true,
  color text not null default '#43CD68',
  created_at timestamptz not null default now()
);

-- 3. 行级安全（RLS）：所有人可读，只有本人能写自己的数据
alter table public.profiles enable row level security;
alter table public.skills enable row level security;

create policy "profiles readable by everyone" on public.profiles
  for select using (true);
create policy "profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

create policy "skills readable by everyone" on public.skills
  for select using (true);
create policy "skills insert own" on public.skills
  for insert with check (auth.uid() = user_id);
create policy "skills update own" on public.skills
  for update using (auth.uid() = user_id);
create policy "skills delete own" on public.skills
  for delete using (auth.uid() = user_id);

import { Routes, Route, Link } from "react-router"
import { StoreProvider } from "@/store"
import { Toaster } from "@/components/ui/sonner"
import Layout from "@/components/Layout"
import Home from "@/pages/Home"
import Skills from "@/pages/Skills"
import SkillDetail from "@/pages/SkillDetail"
import Publish from "@/pages/Publish"
import Booking from "@/pages/Booking"
import Teach from "@/pages/Teach"
import Messages from "@/pages/Messages"
import Chat from "@/pages/Chat"
import Review from "@/pages/Review"
import Points from "@/pages/Points"
import Leaderboard from "@/pages/Leaderboard"
import Activities from "@/pages/Activities"
import Me from "@/pages/Me"
import Cert from "@/pages/Cert"
import Verify from "@/pages/Verify"
import Auth from "@/pages/Auth"

function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl font-bold text-hc-200">404</p>
      <p className="mt-3 text-gray-500">页面不存在或已被移动</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-hc-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-hc-500/30 hover:bg-hc-600"
      >
        返回首页
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/:id" element={<SkillDetail />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/teach/:id" element={<Teach />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/review/:id" element={<Review />} />
          <Route path="/points" element={<Points />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/me" element={<Me />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cert" element={<Cert />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors closeButton />
    </StoreProvider>
  )
}

import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../components/component/ui/Buttton"
import { extractShareCode } from "@/lib/share-code"

/**
 * 桌面端：分享码输入页（公开访问，无需登录）。
 *
 * 用户从「登录页」/「主页侧栏」跳转到此页 → 输入分享码 → 跳转 /share/:code。
 * 返回按钮根据 location.state.from 决定回退到登录页或上一页。
 */
export default function SharePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath: string = location.state?.from || "/login"

  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  // 实时解析输入：当用户粘贴的是完整 URL 时自动提取出 share code，给用户一个预览。
  const parsedCode = useMemo(() => extractShareCode(code), [code])
  const looksLikeUrl = code.trim() !== "" && code.trim() !== parsedCode

  const handleSubmit = () => {
    const finalCode = extractShareCode(code)
    if (!finalCode) {
      setError("请输入分享码")
      return
    }
    setError("")
    navigate(`/share/${encodeURIComponent(finalCode)}`, {
      state: { from: fromPath },
    })
  }

  const handleBack = () => {
    navigate(fromPath)
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* 顶部 */}
      <div className="h-20 flex items-center px-16 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Entelechia Doc
        </h1>
      </div>

      {/* 主体 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-[480px] bg-white rounded-2xl shadow-xl p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">通过分享码访问文档</h2>
            <p className="text-gray-500 text-sm">
              输入分享码或直接粘贴完整分享链接，系统会自动识别。
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              value={code}
              placeholder="请输入分享码或粘贴分享链接"
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
              className="border border-gray-200 rounded-md outline-none transition focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 px-4"
              style={{ height: 48, fontSize: 16 }}
            />

            {looksLikeUrl && (
              <div className="text-xs text-blue-600 px-1 -mt-3">
                已识别到分享链接，将使用分享码：
                <span className="font-mono font-semibold">{parsedCode}</span>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <Button
              height={48}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300"
              onClick={handleSubmit}
            >
              进入文档
            </Button>

            <Button
              variant="outline"
              height={40}
              className="text-gray-600 rounded-md"
              onClick={handleBack}
            >
              返回
            </Button>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="h-16 bg-white flex items-center justify-center text-gray-500 text-sm">
        <p>© 2026 Entelechia Doc.</p>
      </div>
    </div>
  )
}

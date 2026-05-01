import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/component/ui/Buttton"
import { extractShareCode } from "@/lib/share-code"

/**
 * 移动端：分享码输入页（公开访问，无需登录）。
 */
export default function MobileSharePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath: string = location.state?.from || "/mobile/login"

  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  // 与桌面端一致：用户粘贴完整 URL 时实时提取真正的分享码。
  const parsedCode = useMemo(() => extractShareCode(code), [code])
  const looksLikeUrl = code.trim() !== "" && code.trim() !== parsedCode

  const handleSubmit = () => {
    const finalCode = extractShareCode(code)
    if (!finalCode) {
      setError("请输入分享码")
      return
    }
    setError("")
    navigate(`/mobile/share/${encodeURIComponent(finalCode)}`, {
      state: { from: fromPath },
    })
  }

  const handleBack = () => {
    navigate(fromPath)
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
        <Button variant="ghost" size="sm" className="p-2" onClick={handleBack}>
          ←
        </Button>
        <h1 className="text-base font-semibold text-gray-800">通过分享码访问</h1>
        <span className="w-8" />
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <p className="text-gray-500 text-sm mb-4">
          输入分享码或直接粘贴完整分享链接，系统会自动识别。
        </p>
        <input
          type="text"
          value={code}
          placeholder="请输入分享码或粘贴分享链接"
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
          }}
          className="border border-gray-200 rounded-md outline-none transition focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 px-4"
          style={{ height: 44, fontSize: 16 }}
        />

        {looksLikeUrl && (
          <div className="text-xs text-blue-600 mt-2 px-1">
            已识别到分享链接，将使用分享码：
            <span className="font-mono font-semibold">{parsedCode}</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-3 p-3 bg-red-50 rounded-md border border-red-100">
            {error}
          </div>
        )}

        <Button
          height={44}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md mt-6"
          onClick={handleSubmit}
        >
          进入文档
        </Button>
      </div>
    </div>
  )
}

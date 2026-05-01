import { useEffect, useState, useCallback } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import type { JSONContent } from "@tiptap/react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { getSharedDocApi, saveSharedDocApi } from "@/api/share"
import type { SharedDocDetail } from "@/types/share"
import { Button } from "@/components/component/ui/Buttton"

type LoadStatus = "loading" | "ok" | "notfound" | "error"

/**
 * 桌面端：通过分享码访问共享文档。
 *
 * 流程：
 *   1. useParams 取 code → getSharedDocApi 拉取详情（无需登录）。
 *   2. 渲染 SimpleEditor，按 permission 决定是否只读。
 *   3. edit 权限 → 保存调用 saveSharedDocApi（公开 PUT）。
 *   4. 顶部「返回」按钮根据 location.state.from 回退；fallback 到 /login。
 */
export default function SharedDocPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { code = "" } = useParams<{ code: string }>()
  const fromPath: string = location.state?.from || "/login"

  const [status, setStatus] = useState<LoadStatus>("loading")
  const [doc, setDoc] = useState<SharedDocDetail | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setStatus("loading")
      try {
        const resp = await getSharedDocApi(code)
        if (cancelled) return
        if (resp && resp.data) {
          setDoc(resp.data)
          setStatus("ok")
        } else {
          setStatus("notfound")
        }
      } catch (e) {
        if (cancelled) return
        const msg = (e as Error).message || ""
        if (msg.includes("404")) {
          setStatus("notfound")
        } else {
          setErrorMsg(msg || "加载失败")
          setStatus("error")
        }
      }
    }
    if (code) {
      load()
    } else {
      setStatus("notfound")
    }
    return () => {
      cancelled = true
    }
  }, [code])

  const handleBack = () => {
    if (location.state?.from) {
      navigate(fromPath)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/login")
    }
  }

  // edit 权限专用：把保存调用切到分享接口
  const handleCustomSave = useCallback(
    async (content: JSONContent) => {
      if (!code) return
      setSaveStatus("saving")
      try {
        await saveSharedDocApi(code, content)
        setSaveStatus("saved")
      } catch (e) {
        setSaveStatus("error")
        throw e
      }
    },
    [code]
  )

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (status === "notfound") {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-xl font-medium text-gray-700">该分享链接已撤销或不存在</div>
        <Button
          variant="outline"
          height={40}
          className="rounded-md"
          onClick={handleBack}
        >
          返回
        </Button>
      </div>
    )
  }

  if (status === "error" || !doc) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-xl font-medium text-red-500">加载失败</div>
        {errorMsg && <div className="text-sm text-gray-500">{errorMsg}</div>}
        <Button
          variant="outline"
          height={40}
          className="rounded-md"
          onClick={handleBack}
        >
          返回
        </Button>
      </div>
    )
  }

  const isReadOnly = doc.permission === "view"

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* 顶部信息栏 */}
      <div className="h-12 border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-md"
            onClick={handleBack}
          >
            ← 返回
          </Button>
          <div className="font-medium truncate max-w-[400px]">{doc.title}</div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isReadOnly
                ? "bg-gray-100 text-gray-600"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {isReadOnly ? "只读分享" : "可编辑分享"}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {!isReadOnly && (
            <span className="mr-3">
              {saveStatus === "saving" && "保存中..."}
              {saveStatus === "saved" && "已保存"}
              {saveStatus === "error" && <span className="text-red-500">保存失败</span>}
            </span>
          )}
          {doc.updatedAt && new Date(doc.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* 编辑器 */}
      <div className="flex-1 overflow-auto">
        <SimpleEditor
          content={doc.content}
          docTitle={doc.title}
          readOnly={isReadOnly}
          onCustomSave={isReadOnly ? undefined : handleCustomSave}
        />
      </div>
    </div>
  )
}

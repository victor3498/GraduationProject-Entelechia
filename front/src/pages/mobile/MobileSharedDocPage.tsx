import { useEffect, useState, useCallback } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import type { JSONContent } from "@tiptap/react"
import SimpleEditorMobile from "@/components/tiptap-templates/simple/simple-editor-mobile"
import { getSharedDocApi, saveSharedDocApi } from "@/api/share"
import type { SharedDocDetail } from "@/types/share"
import { Button } from "@/components/component/ui/Buttton"

type LoadStatus = "loading" | "ok" | "notfound" | "error"

/**
 * 移动端：通过分享码访问共享文档。
 */
export default function MobileSharedDocPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { code = "" } = useParams<{ code: string }>()
  const fromPath: string = location.state?.from || "/mobile/login"

  const [status, setStatus] = useState<LoadStatus>("loading")
  const [doc, setDoc] = useState<SharedDocDetail | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

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
      navigate("/mobile/login")
    }
  }

  const handleCustomSave = useCallback(
    async (content: JSONContent) => {
      if (!code) return
      await saveSharedDocApi(code, content)
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
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-6">
        <div className="text-lg font-medium text-gray-700 text-center">
          该分享链接已撤销或不存在
        </div>
        <Button variant="outline" height={40} className="rounded-md" onClick={handleBack}>
          返回
        </Button>
      </div>
    )
  }

  if (status === "error" || !doc) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-6">
        <div className="text-lg font-medium text-red-500">加载失败</div>
        {errorMsg && <div className="text-sm text-gray-500">{errorMsg}</div>}
        <Button variant="outline" height={40} className="rounded-md" onClick={handleBack}>
          返回
        </Button>
      </div>
    )
  }

  const isReadOnly = doc.permission === "view"

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <div className="h-14 border-b border-gray-200 flex items-center px-3 justify-between flex-shrink-0">
        <Button variant="ghost" size="sm" className="p-2" onClick={handleBack}>
          ←
        </Button>
        <div className="font-medium text-sm truncate max-w-[200px]">
          {doc.title}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isReadOnly ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"
          }`}
        >
          {isReadOnly ? "只读" : "可编辑"}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <SimpleEditorMobile
          content={doc.content}
          docTitle={doc.title}
          readOnly={isReadOnly}
          onCustomSave={isReadOnly ? undefined : handleCustomSave}
          onReturn={handleBack}
        />
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Button } from "../ui/Buttton"
import {
  createShareApi,
  listSharesApi,
  revokeShareApi,
} from "@/api/share"
import type { ShareInfo, SharePermission } from "@/types/share"

interface ShareDialogProps {
  open: boolean
  documentId: number | null
  documentTitle?: string
  /** 关闭弹窗的回调 */
  onClose: () => void
  /**
   * 移动端 vs 桌面端的链接前缀。默认取 window.location.origin。
   * 桌面端：`${origin}/share/:code`
   * 移动端：`${origin}/mobile/share/:code`
   */
  linkPrefix?: string
}

const PERMISSION_META: Record<
  SharePermission,
  { label: string; desc: string; tone: string }
> = {
  view: {
    label: "仅查看",
    desc: "通过此链接打开的访问者只能阅读，无法修改文档内容。",
    tone: "bg-gray-100 text-gray-700",
  },
  edit: {
    label: "可编辑",
    desc: "通过此链接打开的访问者可以直接修改文档内容并保存。",
    tone: "bg-blue-100 text-blue-700",
  },
}

/**
 * 文档分享管理弹窗：
 *   - 列出当前文档生效的 view / edit 两条分享链接（最多两条）
 *   - 不存在 → 「生成」按钮；存在 → 显示 URL + 复制 + 撤销
 */
export function ShareDialog({
  open,
  documentId,
  documentTitle,
  onClose,
  linkPrefix,
}: ShareDialogProps) {
  const [shares, setShares] = useState<Record<SharePermission, ShareInfo | null>>({
    view: null,
    edit: null,
  })
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<SharePermission | null>(null)
  const [error, setError] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const prefix = linkPrefix ?? `${origin}/share`

  const refresh = async () => {
    if (!documentId) return
    setLoading(true)
    setError("")
    try {
      const resp = await listSharesApi(documentId)
      const list = resp.data || []
      setShares({
        view: list.find((s) => s.permission === "view") || null,
        edit: list.find((s) => s.permission === "edit") || null,
      })
    } catch (e) {
      setError((e as Error).message || "获取分享记录失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && documentId) {
      refresh()
    } else {
      setShares({ view: null, edit: null })
      setError("")
      setCopiedCode(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, documentId])

  const handleGenerate = async (permission: SharePermission) => {
    if (!documentId) return
    setBusy(permission)
    setError("")
    try {
      const resp = await createShareApi(documentId, { permission })
      if (resp.data) {
        setShares((prev) => ({ ...prev, [permission]: resp.data }))
      }
    } catch (e) {
      setError((e as Error).message || "生成分享码失败")
    } finally {
      setBusy(null)
    }
  }

  const handleRevoke = async (permission: SharePermission) => {
    if (!documentId) return
    const target = shares[permission]
    if (!target) return
    if (!window.confirm(`确认撤销「${PERMISSION_META[permission].label}」分享链接？撤销后他人无法再通过该链接访问。`)) return
    setBusy(permission)
    setError("")
    try {
      await revokeShareApi(documentId, target.shareCode)
      setShares((prev) => ({ ...prev, [permission]: null }))
    } catch (e) {
      setError((e as Error).message || "撤销失败")
    } finally {
      setBusy(null)
    }
  }

  const handleCopy = async (info: ShareInfo) => {
    const url = `${prefix}/${info.shareCode}`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement("textarea")
        ta.value = url
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
      }
      setCopiedCode(info.shareCode)
      setTimeout(() => setCopiedCode(null), 1500)
    } catch (e) {
      setError("复制失败，请手动复制")
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[480px] max-w-[92vw] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">分享文档</h3>
            {documentTitle && (
              <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[360px]">
                {documentTitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="px-6 py-5 space-y-5">
          {loading && (
            <div className="text-sm text-gray-500 text-center py-4">加载中...</div>
          )}

          {!loading && (["view", "edit"] as SharePermission[]).map((perm) => {
            const meta = PERMISSION_META[perm]
            const info = shares[perm]
            const url = info ? `${prefix}/${info.shareCode}` : ""

            return (
              <div
                key={perm}
                className="border border-gray-200 rounded-md p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${meta.tone}`}
                  >
                    {meta.label}
                  </span>
                  {info ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      loading={busy === perm}
                      onClick={() => handleRevoke(perm)}
                    >
                      撤销
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      loading={busy === perm}
                      onClick={() => handleGenerate(perm)}
                    >
                      生成链接
                    </Button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-2">{meta.desc}</p>

                {info && (
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={url}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 text-xs font-mono px-2 py-1.5 border border-gray-200 rounded bg-white truncate"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded"
                      onClick={() => handleCopy(info)}
                    >
                      {copiedCode === info.shareCode ? "已复制" : "复制"}
                    </Button>
                  </div>
                )}
              </div>
            )
          })}

          {error && (
            <div className="text-sm text-red-500 p-3 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded"
            onClick={onClose}
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}

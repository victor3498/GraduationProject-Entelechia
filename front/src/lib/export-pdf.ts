import html2pdf from "html2pdf.js"

export interface ExportPdfOptions {
  /** 要导出的根 DOM（一般是 .tiptap.ProseMirror 编辑器节点） */
  element: HTMLElement
  /** 文件名（不含扩展名）。会自动清洗非法字符 */
  filename: string
  /** 页边距（mm）。可传单一数字或 [上, 左, 下, 右] */
  margin?: number | [number, number, number, number]
  /** 渲染清晰度倍率，2~3 之间为最佳平衡（值越大越清晰但越慢） */
  scale?: number
  /** 容器宽度（px）。默认 780，与 .simple-editor-content 一致 */
  contentWidth?: number
  /** 是否在导出包装容器内强制移除 .dark，避免暗色主题影响 PDF */
  forceLightTheme?: boolean
}

/**
 * 将一段 DOM（编辑器内容节点）导出成 PDF。
 *
 * 实现要点：
 *  1) 克隆目标节点并挂到屏外的固定宽度容器，避免 ProseMirror 光标/选区/工具栏入图，
 *     同时保证全局 SCSS 变量与字体生效；
 *  2) 等待 `document.fonts.ready`，避免字体回退；
 *  3) 使用 html2canvas + jsPDF 渲染，开启 CORS 与白底，使用 css/legacy 分页模式。
 */
export async function exportElementToPdf({
  element,
  filename,
  margin = 12,
  scale = 2,
  contentWidth = 780,
  forceLightTheme = true,
}: ExportPdfOptions): Promise<void> {
  if (!element) throw new Error("exportElementToPdf: element is required")

  const clone = element.cloneNode(true) as HTMLElement
  clone.removeAttribute("contenteditable")
  clone
    .querySelectorAll<HTMLElement>("[contenteditable]")
    .forEach((el) => el.removeAttribute("contenteditable"))

  // ProseMirror 给空节点放的占位也一并清掉，避免出现 "Start typing..." 之类
  clone
    .querySelectorAll<HTMLElement>(".ProseMirror-trailingBreak")
    .forEach((el) => el.remove())

  const wrapper = document.createElement("div")
  wrapper.className = "pdf-export-wrapper"
  wrapper.style.cssText = [
    `width: ${contentWidth}px`,
    "padding: 0",
    "margin: 0",
    "background: #ffffff",
    "color: #000000",
    "position: fixed",
    "left: -99999px",
    "top: 0",
    "z-index: -1",
    "pointer-events: none",
  ].join(";")

  // 让克隆出的内容继承 .tiptap.ProseMirror 的全局样式（字体、列表、标题等）
  // element 本身就是带 .tiptap.ProseMirror 类名的节点，clone 已经保留了类名
  wrapper.appendChild(clone)

  if (forceLightTheme) {
    wrapper.classList.remove("dark")
    wrapper.classList.add("light")
  }

  document.body.appendChild(wrapper)

  try {
    if (typeof document !== "undefined" && (document as Document).fonts) {
      try {
        await (document as Document).fonts.ready
      } catch {
        /* ignore font readiness errors */
      }
    }

    const safeName = sanitizeFilename(filename) || "document"

    // 注意：html2pdf.js 包自带的 type.d.ts 没有声明 pagebreak 字段（被 @types 覆盖），
    // 但运行时是支持的，因此这里用 Record<string, unknown> 让 set 接受完整选项。
    const options: Record<string, unknown> = {
      margin,
      filename: `${safeName}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: contentWidth,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    }

    await html2pdf()
      .from(wrapper)
      .set(options as never)
      .save()
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper)
    }
  }
}

/** 去除文件名里的非法字符，防止下载失败 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|\r\n\t]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120)
}

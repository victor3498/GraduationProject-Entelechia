"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { ContentSaveButton } from "@/components/tiptap-ui/contentsave-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"
import { DownloadIcon } from "@/components/tiptap-icons/download-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import { exportElementToPdf } from "@/lib/export-pdf"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"
import type { JSONContent } from "@tiptap/react"
import { saveDocApi } from "@/api/document"

interface SimpleEditorProps {
  content?: JSONContent
  onContentChange?: (content: JSONContent) => void
  docTitle?: string
  onTitleChange?: (title: string) => void
  docId?: number
  onSave?: () => void
  onSaveError?: (error: Error) => void
  /** 只读模式：禁用编辑、隐藏保存按钮等需要写入操作的功能 */
  readOnly?: boolean
  /** 完全隐藏工具栏（一般用于纯查看场景） */
  hideToolbar?: boolean
  /**
   * 自定义保存逻辑。提供时优先于内置 saveDocApi 调用，
   * 用于「分享码编辑」等不通过 docId 走文档接口的场景。
   */
  onCustomSave?: (content: JSONContent) => Promise<void>
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  handleSave,
  handleExportPdf,
  isExporting = false,
  readOnly = false,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  handleSave: () => void
  handleExportPdf: () => void
  isExporting?: boolean
  readOnly?: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
        {!readOnly && <ContentSaveButton onClick={handleSave} />}
        {/* <Button
          data-style="ghost"
          onClick={handleExportPdf}
          disabled={isExporting}
          aria-label="导出 PDF"
          tooltip={isExporting ? "正在生成 PDF..." : "导出为 PDF"}
        >
          <DownloadIcon className="tiptap-button-icon" />
        </Button> */}

      </ToolbarGroup>

      <ToolbarSeparator />



      {/* <ToolbarGroup>
        <ImageUploadButton />
      </ToolbarGroup> */}

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({ content, onContentChange, docTitle, onTitleChange, docId, onSave, onSaveError, readOnly = false, hideToolbar = false, onCustomSave }: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [title, setTitle] = useState(docTitle || "未命名文档")
  const [isExporting, setIsExporting] = useState(false)
  console.log("content传入后:", content);
  const toolbarRef = useRef<HTMLDivElement>(null)
  const editorContentRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<JSONContent | undefined>(content)

  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },


     onUpdate({ editor }) {
    const json = editor.getJSON()
    contentRef.current = json
    if (onContentChange) {
      onContentChange(json)
    }
  },
})

  // 监听content变化，仅在content真正改变时更新编辑器内容
  useEffect(() => {
    if (editor && content && JSON.stringify(content) !== JSON.stringify(contentRef.current)) {
      console.log("content真正变化，更新编辑器内容:", content);
      contentRef.current = content
      editor.commands.setContent(content)
    }
  }, [editor, content]);

  // readOnly 切换时同步 editor 的 editable 状态
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly]);


  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleExportPdf = async () => {
    if (!editor) return;
    if (isExporting) return;

    const root = editorContentRef.current;
    const dom =
      root?.querySelector<HTMLElement>(".tiptap.ProseMirror") ??
      (editor.view.dom as HTMLElement);

    if (!dom) {
      console.warn("导出 PDF 失败：未找到编辑器 DOM");
      return;
    }

    try {
      setIsExporting(true);
      await exportElementToPdf({
        element: dom,
        filename: title || docTitle || "未命名文档",
      });
    } catch (error) {
      console.error("导出 PDF 失败:", error);
      onSaveError?.(error as Error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    if (!editor) return;
    if (readOnly) return;

    try {
      const json = editor.getJSON();

      // 优先使用外部提供的自定义保存逻辑（如分享码 PUT 接口）。
      if (onCustomSave) {
        await onCustomSave(json);
        onSave?.();
        return;
      }

      if (!docId) return;
      const response = await saveDocApi(docId, { content: json });
      if (response.code === 200) {
        onSave?.();
      } else {
        throw new Error(response.message || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      onSaveError?.(error as Error);
    }
  };

  return (
    <div className="simple-editor-wrapper">

      <EditorContext.Provider value={{ editor }}>
        {!hideToolbar && (
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
                handleSave={handleSave}
                handleExportPdf={handleExportPdf}
                isExporting={isExporting}
                readOnly={readOnly}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>
        )}

        <EditorContent
          ref={editorContentRef}
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}

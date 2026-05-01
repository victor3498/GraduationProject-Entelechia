import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/component/ui/Buttton";
import DocumentToolbar from "@/components/component/document/DocumentToolbar";
import { DocList } from "@/components/component/document/DocumentList";
import { createDocApi, deleteDocApi, getDocListApi, starDocApi, getDocDetailApi, saveDocApi, renameDocApi } from "@/api/document";
import type { DocumentItem } from "@/components/component/document/document.types";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor.tsx'
import type { JSONContent } from "@tiptap/react"
import { LogoutIcon } from "@/components/component/svg/logout";
import { SetIcon } from "@/components/component/svg/set";
import { ShareDialog } from "@/components/component/document/ShareDialog";

// 用户数据
const currentUser = {
  id: 1,
  name: "用户",
  avatar: "👤"
};

export default function MobileMainPage() {
  // const navigate = useNavigate();
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "starred">('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [docContent, setDocContent] = useState<JSONContent | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [shareDialogDoc, setShareDialogDoc] = useState<DocumentItem | null>(null);

  const handleShareDocument = (id: number) => {
    const doc = documents.find((d) => d.id === id) || filteredDocuments.find((d) => d.id === id);
    if (doc) {
      setShareDialogDoc(doc);
    }
  };

  // 初始化加载文档
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await getDocListApi();
      const allDocs = response.data || [];
      const docArray = Array.isArray(allDocs) ? allDocs : [];
      const documentItems: DocumentItem[] = docArray.map(item => ({
        id: item.id,
        title: item.title,
        is_starred: item.is_starred,
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at
      }));
      setDocuments(documentItems);
      applyViewMode(documentItems, viewMode);
    } catch (error) {
      console.error("加载文档失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyViewMode = (docs: DocumentItem[], mode: "all" | "starred") => {
    if (mode === "starred") {
      setFilteredDocuments(docs.filter(doc => doc.is_starred));
    } else {
      setFilteredDocuments(docs);
    }
  };

  const handleOpenDocument = async (id: number) => {
    const doc = filteredDocuments.find(d => d.id === id) || documents.find(d => d.id === id);
    if (doc) {
      setLoading(true);
      setError(null);
      try {
        const response = await getDocDetailApi(id);
        const docDetail = response.data;
        
        if (docDetail) {
          let content = docDetail.content;
          let processedContent: JSONContent;
          
          if (!content) {
            processedContent = {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                },
              ],
            };
          } 
          else if (typeof content === 'string') {
            try {
              content = JSON.parse(content);
              if (content && typeof content === 'object') {
                const contentObj = content as JSONContent;
                if (contentObj.type && contentObj.content && Array.isArray(contentObj.content)) {
                  processedContent = contentObj;
                } else {
                  processedContent = {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                      },
                    ],
                  };
                }
              } else {
                processedContent = {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                    },
                  ],
                };
              }
            } catch (parseError) {
              console.error("解析content为JSON失败:", parseError);
              processedContent = {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                  },
                ],
              };
            }
          } 
          else if (content && typeof content === 'object') {
            const contentObj = content as JSONContent;
            if (contentObj.type && contentObj.content && Array.isArray(contentObj.content)) {
              processedContent = contentObj;
            } else {
              processedContent = {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                  },
                ],
              };
            }
          } 
          else {
            processedContent = {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                },
              ],
            };
          }
          
          // 跳转到MobileEditorPage并传递参数
          navigate('/mobile/editor', {
            state: {
              docId: id,
              content: processedContent,
              docTitle: docDetail.title
            }
          });
        } else {
          console.error("文档详情为空");
          setError("文档详情为空");
        }
      } catch (error) {
        console.error("加载文档内容失败:", error);
        setError("加载文档内容失败");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStarDocument = async (id: number) => {
    try {
      const docIndex = documents.findIndex(d => d.id === id);
      if (docIndex !== -1) {
        const currentDoc = documents[docIndex];
        const newStarredStatus = !currentDoc.is_starred;
        
        const updatedDocs = [...documents];
        updatedDocs[docIndex] = {
          ...currentDoc,
          is_starred: newStarredStatus,
          updated_at: new Date().toISOString()
        };
        
        setDocuments(updatedDocs);
        applyViewMode(updatedDocs, viewMode);
        
        if (selectedDoc && selectedDoc.id === id) {
          setSelectedDoc(updatedDocs[docIndex]);
        }
        
        await starDocApi(id, { isStarred: newStarredStatus });
      }
    } catch (error) {
      console.error("标星操作失败:", error);
      loadDocuments();
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm("确定要删除这个文档吗？")) {
      try {
        const updatedDocs = documents.filter(d => d.id !== id);
        setDocuments(updatedDocs);
        applyViewMode(updatedDocs, viewMode);
        
        if (selectedDoc && selectedDoc.id === id) {
          setSelectedDoc(null);
          setCurrentView('list');
        }
        
        await deleteDocApi(id);
      } catch (error) {
        console.error("删除文档失败:", error);
        loadDocuments();
      }
    }
  };

  const handleCreateDocument = async () => {
    const title = prompt("请输入新文档标题", "未命名文档");
    if (title) {
      try {
        const response = await createDocApi({ title });
        const newDoc = response.data;
        
        if (newDoc) {
          const docWithUpdatedAt: DocumentItem = {
            id: newDoc.id,
            title: newDoc.title,
            is_starred: newDoc.is_starred,
            created_at: newDoc.created_at,
            updated_at: newDoc.created_at
          };
          const updatedDocs = [docWithUpdatedAt, ...documents];
          setDocuments(updatedDocs);
          applyViewMode(updatedDocs, viewMode);
        }
      } catch (error) {
        console.error("创建文档失败:", error);
      }
    }
  };

  const handleLogout = () => {
  
    if (window.confirm("确定要退出登录吗？")) {
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  };

  const handleViewModeChange = (mode: "all" | "starred") => {
    setViewMode(mode);
    applyViewMode(documents, mode);
  };

  const handleContentChange = (content: JSONContent) => {
    setDocContent(content);
    setSaveStatus('idle');
  };

  const handleSaveDocument = async () => {
    if (!selectedDoc) return;
    
    setSaveStatus('saving');
    setError(null);
    try {
      await saveDocApi(selectedDoc.id, { content: docContent });
      setSaveStatus('saved');
      
      const updatedDocs = documents.map(doc => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            updated_at: new Date().toISOString()
          };
        }
        return doc;
      });
      setDocuments(updatedDocs);
      applyViewMode(updatedDocs, viewMode);
      
      if (selectedDoc) {
        setSelectedDoc({
          ...selectedDoc,
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("保存文档失败:", error);
      setError("保存文档失败");
      setSaveStatus('error');
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    if (!selectedDoc) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await renameDocApi(selectedDoc.id, { title: newTitle });
      
      const updatedDocs = documents.map(doc => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            title: newTitle,
            updated_at: response.data?.updated_at || new Date().toISOString()
          };
        }
        return doc;
      });
      setDocuments(updatedDocs);
      applyViewMode(updatedDocs, viewMode);
      
      if (selectedDoc) {
        setSelectedDoc({
          ...selectedDoc,
          title: newTitle,
          updated_at: response.data?.updated_at || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("更新文档标题失败:", error);
      setError("更新文档标题失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      {currentView === 'list' && (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            ☰
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Entelechia Doc</h1>
          <Button
            onClick={handleCreateDocument}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            ＋
          </Button>
        </div>
      )}

      {currentView === 'editor' && (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <Button
            onClick={() => setCurrentView('list')}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            ←
          </Button>
          <div className="font-medium text-sm truncate max-w-[200px]">
            {selectedDoc ? selectedDoc.title : "未选择文档"}
          </div>
          <Button
            onClick={handleSaveDocument}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            {saveStatus === 'saving' ? "保存中..." : "保存"}
          </Button>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 侧边栏 */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-48 bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                {currentUser.avatar}
              </div>
              <div>
                <p className="font-medium">User</p>
                <p className="text-xs text-gray-400"></p>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <Button
              onClick={() => {
                handleViewModeChange("all");
                setSidebarOpen(false);
              }}
              variant={viewMode === "all" ? "secondary" : "ghost"}
              size="sm"
              className={`w-full justify-start px-4 py-3 text-left ${viewMode === "all" ? "bg-gray-800" : ""}`}
            >
              📄 所有文档
            </Button>
            
            <Button
              onClick={() => {
                handleViewModeChange("starred");
                setSidebarOpen(false);
              }}
              variant={viewMode === "starred" ? "secondary" : "ghost"}
              size="sm"
              className={`w-full justify-start px-4 py-3 text-left ${viewMode === "starred" ? "bg-gray-800" : ""}`}
            >
              ⭐ 标星文档
            </Button>
            <Button
            onClick={()=>{navigate('/mobile/user')}}
            variant={"ghost"}
            size="sm"
            className={`w-full justify-start px-4 py-3 text-left ${viewMode === "starred" ? "bg-gray-800" : ""}`}
            >
              ⚙️ 用户界面
            </Button>

            <Button
              onClick={() => {
                navigate("/mobile/share", { state: { from: "/mobile" } });
                setSidebarOpen(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-3 text-left"
            >
              🔗 通过分享码访问
            </Button>
          </div>
          
          <div className="absolute bottom-0 w-full border-t border-gray-800">
            <Button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-3 text-left text-red-400"
            >
              <LogoutIcon />
              退出登录
            </Button>
          </div>
        </div>

        {/* 文档列表 */}
        {currentView === 'list' && (
          <div className="flex-1 flex flex-col bg-white">
            {/* 工具栏 */}
            <div className="p-2 border-b border-gray-200">
              <DocumentToolbar
                width="100%"
                height={36}
                onSearch={(list) => {
                  const resultArray = Array.isArray(list) ? list : [];
                  const documentItems: DocumentItem[] = resultArray.map(item => ({
                    id: item.id,
                    title: item.title,
                    is_starred: item.is_starred,
                    created_at: item.created_at,
                    updated_at: item.updated_at || item.created_at
                  }));
                  setFilteredDocuments(documentItems);
                }}
              />
            </div>

            {/* 文档列表 */}
            <div className="flex-1 overflow-y-auto p-3">
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  {viewMode === "starred" ? "暂无标星文档" : "暂无文档"}
                </div>
              ) : (
                <DocList
                  documents={filteredDocuments}
                  width="100%"
                  itemHeight="48px"
                  onOpen={handleOpenDocument}
                  onStar={handleStarDocument}
                  onDelete={handleDeleteDocument}
                  onShare={handleShareDocument}
                />
              )}
            </div>
          </div>
        )}

        {/* 编辑器 */}
        {currentView === 'editor' && (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* 编辑器内容 */}
            <div className="flex-1 overflow-auto">
              {error && (
                <div className="p-4 bg-red-50 text-red-500 border-b border-red-200">
                  {error}
                </div>
              )}
              {selectedDoc ? (
                <SimpleEditor 
                  content={docContent as JSONContent} 
                  docId={selectedDoc.id}
                  onContentChange={handleContentChange}
                  docTitle={selectedDoc.title}
                  onTitleChange={handleTitleChange}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  请选择一个文档开始编辑
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 分享弹窗 */}
      <ShareDialog
        open={shareDialogDoc !== null}
        documentId={shareDialogDoc?.id ?? null}
        documentTitle={shareDialogDoc?.title}
        onClose={() => setShareDialogDoc(null)}
        linkPrefix={`${typeof window !== 'undefined' ? window.location.origin : ''}/mobile/share`}
      />
    </div>
  );
}

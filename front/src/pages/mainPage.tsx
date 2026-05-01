import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/component/ui/Buttton";
import DocumentToolbar from "../components/component/document/DocumentToolbar";
import { DocList } from "../components/component/document/DocumentList";
import { createDocApi, deleteDocApi, getDocListApi, starDocApi, getDocDetailApi, saveDocApi, renameDocApi } from "../api/document";
import type { DocumentItem } from "../components/component/document/document.types";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor.tsx'
import type { JSONContent } from "@tiptap/react"
import { LogoutIcon } from "@/components/component/svg/logout";
import { SetIcon } from "@/components/component/svg/set";
import { ShareIcon } from "@/components/component/svg/share";
import { ShareDialog } from "@/components/component/document/ShareDialog";
import content1  from '../components/tiptap-templates/simple/data/content1.json'




// 用户数据
const currentUser = {
  id: 1,
  name: "用户",
  avatar: "👤"
};


export default function MainPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "starred">('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [docContent, setDocContent] = useState<JSONContent | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 分享弹窗状态：shareDialogDoc 不为 null 即为打开
  const [shareDialogDoc, setShareDialogDoc] = useState<DocumentItem | null>(null);

  // 初始化加载文档
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // 实际API调用
      const response = await getDocListApi();
      // data直接就是数据，没有包装
      const allDocs = response.data || [];
      console.log("所有文档:", allDocs);
      // 确保返回的数据是数组
      const docArray = Array.isArray(allDocs) ? allDocs : [];
      // 转换为DocumentItem数组
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
    console.log("点击了文档，ID:", id);
    // 先找到文档并设置为选中状态
    const doc = filteredDocuments.find(d => d.id === id) || documents.find(d => d.id === id);
    console.log("找到的文档:", doc);
    if (doc) {
      setSelectedDoc(doc);
      setLoading(true);
      setError(null);
      try {
        console.log("开始加载文档内容，ID:", id);
        const response = await getDocDetailApi(id);
        console.log("获取文档详情响应:", response);
        
        // 直接使用response.data获取文档详情
        const docDetail = response.data;
        console.log("文档详情:", docDetail);
        
        if (docDetail) {
          // 更新选中文档的信息
          const updatedDoc: DocumentItem = {
            id: docDetail.id,
            title: docDetail.title,
            is_starred: docDetail.is_starred,
            created_at: docDetail.created_at,
            updated_at: docDetail.updated_at || docDetail.created_at
          };
          setSelectedDoc(updatedDoc);
          
          // 确保content保持JSON格式，并且结构与content1.json一致
          let content = docDetail.content;
          let processedContent: JSONContent;
          
          // 处理content为空的情况
          if (!content) {
            console.log("content为空，使用默认文档结构");
            processedContent = {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                },
              ],
            };
          } 
          // 处理content为字符串的情况
          else if (typeof content === 'string') {
            try {
              content = JSON.parse(content);
              console.log("解析后的JSON内容:", content);
              
              // 验证解析后的content结构
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
              // 如果解析失败，使用默认文档结构
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
          // 处理content为对象的情况
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
          // 其他情况，使用默认文档结构
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
          
          console.log("最终设置的文档内容:", processedContent);
          console.log("content1.json:", content1);
          console.log("docContent:", docContent);
          setDocContent(processedContent);
        } else {
          console.error("文档详情为空");
          setError("文档详情为空");
          // 设置默认文档结构
          setDocContent({
            type: "doc",
            content: [
              {
                type: "paragraph",
              },
            ],
          });
        }
      } catch (error) {
        console.error("加载文档内容失败:", error);
        setError("加载文档内容失败");
        // 设置默认文档结构
        setDocContent({
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        });
      } finally {
        setLoading(false);
        console.log("加载完成");
      }
    } else {
      console.error("未找到文档，ID:", id);
      console.log("filteredDocuments:", filteredDocuments);
      console.log("documents:", documents);
    }
  };

  const handleStarDocument = async (id: number) => {
    try {
      const docIndex = documents.findIndex(d => d.id === id);
      if (docIndex !== -1) {
        const currentDoc = documents[docIndex];
        const newStarredStatus = !currentDoc.is_starred;
        
        // 先更新本地状态
        const updatedDocs = [...documents];
        updatedDocs[docIndex] = {
          ...currentDoc,
          is_starred: newStarredStatus,
          updated_at: new Date().toISOString()
        };
        
        setDocuments(updatedDocs);
        applyViewMode(updatedDocs, viewMode);
        
        // 如果当前选中的文档是刚标星/取消标星的文档，更新选中文档
        if (selectedDoc && selectedDoc.id === id) {
          setSelectedDoc(updatedDocs[docIndex]);
        }
        
        // 实际API调用
        await starDocApi(id, { isStarred: newStarredStatus });
      }
    } catch (error) {
      console.error("标星操作失败:", error);
      // 操作失败时重新加载文档列表以恢复正确状态
      loadDocuments();
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm("确定要删除这个文档吗？")) {
      try {
        // 先更新本地状态
        const updatedDocs = documents.filter(d => d.id !== id);
        setDocuments(updatedDocs);
        applyViewMode(updatedDocs, viewMode);
        
        // 如果删除的是当前选中的文档，清空选中
        if (selectedDoc && selectedDoc.id === id) {
          setSelectedDoc(null);
        }
        
        // 实际API调用
        await deleteDocApi(id);
      } catch (error) {
        console.error("删除文档失败:", error);
        // 操作失败时重新加载文档列表以恢复正确状态
        loadDocuments();
      }
    }
  };

  const handleCreateDocument = async () => {
    const title = prompt("请输入新文档标题", "未命名文档");
    if (title) {
      try {
        // 实际API调用
        const response = await createDocApi({ title });
        const newDoc = response.data;
        
        if (newDoc) {
          // 转换为DocumentItem格式
          const docWithUpdatedAt: DocumentItem = {
            id: newDoc.id,
            title: newDoc.title,
            is_starred: newDoc.is_starred,
            created_at: newDoc.created_at,
            updated_at: newDoc.created_at // 使用created_at作为初始updated_at
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
      // 清除localStorage中的token
      localStorage.removeItem("accessToken");
      // 导航到登录页
      navigate("/login");
    }
  };

  const handleShareDocument = (id: number) => {
    const doc = documents.find((d) => d.id === id) || filteredDocuments.find((d) => d.id === id);
    if (doc) {
      setShareDialogDoc(doc);
    }
  };

  const handleViewModeChange = (mode: "all" | "starred") => {
    setViewMode(mode);
    applyViewMode(documents, mode);
  };

  const handleContentChange = (content: JSONContent) => {
    setDocContent(content);
    setSaveStatus('idle'); // 内容变化后重置保存状态
  };

  const handleSaveDocument = async () => {
    if (!selectedDoc) return;
    
    setSaveStatus('saving');
    setError(null);
    try {
      await saveDocApi(selectedDoc.id, { content: docContent });
      setSaveStatus('saved');
      
      // 更新文档的更新时间
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
      
      // 更新选中文档的更新时间
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
      
      // 更新文档列表中的标题
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
      
      // 更新选中文档的标题
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
    <div className="w-full h-screen flex flex-row bg-gray-50">
      {/* 主容器 */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* 左侧导航栏容器 */}
        <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 flex-shrink-0">
          {/* 用户头像区域 */}
          <div className="relative cursor-pointer">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg hover:bg-gray-600 transition">
              {currentUser.avatar}
            </div>
            
            {/* 用户菜单 */}
            {userMenuOpen && (
              <div className="absolute left-full top-0 ml-2 w-48 bg-white text-gray-900 rounded-md shadow-lg border py-1 z-10">
                <div className="px-4 py-2 border-b">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start px-4 py-2 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  个人设置
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start px-4 py-2 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  账号管理
                </Button>
              </div>
            )}
          </div>

          {/* 导航按钮组 */}
          <div className="flex-1 flex flex-col space-y-4">
            <Button
              onClick={() => handleViewModeChange("all")}
              variant={viewMode === "all" ? "secondary" : "ghost"}
              size="lg"
              width={48}
              height={48}
              className={`rounded-md flex items-center justify-center hover:bg-gray-800 transition ${
                viewMode === "all" ? "bg-gray-800 text-white" : "text-white"
              }`}
              title="所有文档"
            >
              📄
            </Button>
            
            <Button
              onClick={() => handleViewModeChange("starred")}
              variant={viewMode === "starred" ? "secondary" : "ghost"}
              size="lg"
              width={48}
              height={48}
              className={`rounded-md flex items-center justify-center hover:bg-gray-800 transition ${
                viewMode === "starred" ? "bg-gray-800 text-white" : "text-white"
              }`}
              title="标星文档"
            >
              ⭐
            </Button>
            
            <Button
              onClick={handleCreateDocument}
              variant="ghost"
              size="lg"
              width={48}
              height={48}
              className="rounded-md flex items-center justify-center hover:bg-gray-800 transition text-white"
              title="新建文档"
            >
              ＋
            </Button>

            <Button
              onClick={() => navigate("/share", { state: { from: "/" } })}
              variant="ghost"
              size="lg"
              width={48}
              height={48}
              className="rounded-md flex items-center justify-center hover:bg-gray-800 transition text-white"
              title="通过分享码访问"
            >
              <ShareIcon />
            </Button>

            <Button
              onClick={() => navigate("/profile")}
              variant="ghost"
              size="lg"
              width={48}
              height={48}
              className="rounded-md flex items-center justify-center hover:bg-gray-800 transition text-white"
              title="用户设置"
            >
              <SetIcon />
            </Button>
          </div>

          {/* 登出按钮 */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="lg"
            width={48}
            height={48}
            className="rounded-md flex items-center justify-center hover:bg-gray-800 transition mt-auto text-white"
            title="退出登录"
          >
            <LogoutIcon />
          </Button>
        </div>

        {/* 中间文档列表容器 */}
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
          {/* 工具栏区域 */}
          <div className="p-2 border-b border-gray-200">
            <DocumentToolbar
              width="100%"
              height={36}
              onSearch={(list) => {
                // 确保返回的数据是数组
                const resultArray = Array.isArray(list) ? list : [];
                // 转换为DocumentItem数组
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

          {/* 文档列表区域 */}
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
                itemHeight="40px"
                onOpen={handleOpenDocument}
                onStar={handleStarDocument}
                onDelete={handleDeleteDocument}
                onShare={handleShareDocument}
              />
            )}
          </div>
        </div>

        {/* 右侧编辑器容器 */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* 编辑器顶部栏 */}
          <div className="h-12 border-b border-gray-200 flex items-center px-6 justify-between">
            <div className="font-medium flex items-center">
              {selectedDoc ? selectedDoc.title : "未选择文档"}
              {selectedDoc && selectedDoc.is_starred && (
                <span className="ml-2 text-yellow-500">⭐</span>
              )}
              {selectedDoc && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-3 text-blue-600 hover:bg-blue-50 rounded-md"
                  onClick={() => setShareDialogDoc(selectedDoc)}
                  title="分享当前文档"
                  leftIcon={<ShareIcon className="w-4 h-4" />}
                >
                  分享
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {selectedDoc && new Date(selectedDoc.updated_at).toLocaleString()}
            </div>
          </div>

          {/* 编辑器内容区域 */}
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
                // content={content1}
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
      </div>

      {/* 分享弹窗 */}
      <ShareDialog
        open={shareDialogDoc !== null}
        documentId={shareDialogDoc?.id ?? null}
        documentTitle={shareDialogDoc?.title}
        onClose={() => setShareDialogDoc(null)}
      />
    </div>
  );
}


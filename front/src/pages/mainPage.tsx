import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "../components/component/ui/Buttton";
import DocumentToolbar, { type searchDocParams } from "../components/component/document/DocumentToolbar";
import { DocList } from "../components/component/document/DocumentList";
import { createDocApi, deleteDocApi, getDocListApi, starDocApi, searchDocApi } from "../api/document";
import type {  getDocListResult, searchDocType } from "../types/doc";
import type {DocumentItem} from "../components/component/document/document.types"
import type { ApiResponse } from "../types/api";
import { DocumentCard } from "@/components/component/document/DocumentItem";
import content from "@/components/tiptap-templates/simple/data/content.json"
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor.tsx'
import { LogoutIcon } from "@/components/component/svg/logout";





// 用户数据
const currentUser = {
  id: 1,
  name: "用户",
  avatar: "👤"
};

const data = [
        {
            "id": 9,
            "title": "测试文档11",
            "is_starred": true,
            "created_at": "2026-03-16T11:08:31.965Z",
            "updated_at": "2026-03-16T11:12:14.053Z"
        },
        {
            "id": 7,
            "title": "新的文档标题",
            "is_starred": false,
            "created_at": "2026-03-15T02:18:12.875Z",
            "updated_at": "2026-03-16T11:10:46.021Z"
        },
        {
            "id": 13,
            "title": "测试文档15",
            "is_starred": false,
            "created_at": "2026-03-16T11:09:02.089Z",
            "updated_at": "2026-03-16T11:09:02.089Z"
        },
        {
            "id": 12,
            "title": "测试文档14",
            "is_starred": false,
            "created_at": "2026-03-16T11:08:55.924Z",
            "updated_at": "2026-03-16T11:08:55.924Z"
        },
        {
            "id": 11,
            "title": "测试文档13",
            "is_starred": false,
            "created_at": "2026-03-16T11:08:49.573Z",
            "updated_at": "2026-03-16T11:08:49.573Z"
        },
        {
            "id": 10,
            "title": "测试文档12",
            "is_starred": false,
            "created_at": "2026-03-16T11:08:40.388Z",
            "updated_at": "2026-03-16T11:08:40.388Z"
        },
        {
            "id": 14,
            "title": "测试文档16",
            "is_starred": true,
            "created_at": "2026-03-16T11:08:40.388Z",
            "updated_at": "2026-03-16T11:08:40.388Z"
        }
    ]

    const data1={
            "id": 10,
            "title": "测试文档12",
            "is_starred": false,
            "created_at": "2026-03-16T11:08:40.388Z",
            "updated_at": "2026-03-16T11:08:40.388Z"}


export default function MainPage() {
  // const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "starred">("all");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 初始化加载文档
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // 实际API调用
      const response = await getDocListApi();
      const allDocs = response.data?.list || [];
      setDocuments(allDocs);
      applyViewMode(allDocs, viewMode);
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

  const handleSearch = async (params: searchDocParams) => {
    setLoading(true);
    try {
      // 实际API调用
      const response = await searchDocApi(params);
      const results = response.data?.searched_list || [];
      setFilteredDocuments(results as DocumentItem[]);
    } catch (error) {
      console.error("搜索失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocument = (id: number) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setSelectedDoc(doc);
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
          // 为newDoc添加updated_at属性，确保类型匹配
          const docWithUpdatedAt = {
            ...newDoc,
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
      // navigate("/login");
    }
  };

  const handleViewModeChange = (mode: "all" | "starred") => {
    setViewMode(mode);
    applyViewMode(documents, mode);
  };



  return (

    <div className=" w-[100%] h-[900px] flex  flex-row justify-center">
      {/* 左侧导航栏 */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 flex-shrink-0">
        {/* 用户头像 */}
        <div 
          className="relative cursor-pointer"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
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
              >
                个人设置
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left justify-start px-4 py-2 hover:bg-gray-100"
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

      {/* 中间文档列表区域 */}
      <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
        {/* 工具栏 */}
        <div className="p-2 border-b border-gray-200">
          <DocumentToolbar
            width="100%"
            height={36}
            onSearch={(list) => {
              setFilteredDocuments(list as DocumentItem[]);
            }}
          />
        </div>

        {/* 文档列表 */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              {viewMode === "starred" ? "暂无标星文档" : "暂无文档"}
            </div>
          ) : (
            <DocList
              // documents={filteredDocuments}
              documents={data}
              width="100%"
              itemHeight="40px"
              onOpen={handleOpenDocument}
              onStar={handleStarDocument}
              onDelete={handleDeleteDocument}
            />
          )} */}
          <DocList
              // documents={filteredDocuments}
              documents={data}
              width="275px"
              itemHeight="40px"
              onOpen={handleOpenDocument}
              onStar={handleStarDocument}
              onDelete={handleDeleteDocument}
            />
          {/* 新建文档按钮 */}
          {/* <Button
            onClick={handleCreateDocument}
            variant="primary"
            size="md"
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            ＋ 新建文档
          </Button> */}
        </div>
      </div>

      {/* 右侧编辑器区域 */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* 编辑器顶部栏 */}
        <div className="h-12 border-b border-gray-200 flex items-center  px-6">
          <div className="font-medium">
            {selectedDoc ? selectedDoc.title : "未选择文档"}
            {selectedDoc && selectedDoc.is_starred && (
              <span className="ml-2 text-yellow-500">⭐</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {selectedDoc && new Date(selectedDoc.updated_at).toLocaleString()}
          </div>
        </div>

        {/* 编辑器区域 */}
      
 
          <SimpleEditor content={content}/>
       
    

      </div>
    </div>
  );
}


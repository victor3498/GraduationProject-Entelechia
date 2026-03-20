import { useState } from "react"

import { loginApi } from "@/api/auth"

import {
  createDocApi,
  deleteDocApi,
  renameDocApi,
  saveDocApi,
  searchDocApi,
  getDocDetailApi,
  getDocListApi,
  starDocApi,
} from "@/api/document"

export default function DocApiTestPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [docId, setDocId] = useState<number>(1)

  // ================= 登录 =================
  const handleLogin = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await loginApi({
        username: "testuser4",
        password: "testFour",
      })

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 创建文档 =================
  const handleCreateDoc = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await createDocApi({
        title: "测试文档-" + Date.now(),
      })

      setResult(res)

      // 自动把返回 id 存起来，方便继续测试
      if (res.data?.id) {
        setDocId(res.data.id)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 获取文档列表 =================
  const handleGetList = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await getDocListApi()
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 获取文档详情 =================
  const handleGetDetail = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await getDocDetailApi(docId)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 重命名文档 =================
  const handleRename = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await renameDocApi(docId, {
        title: "修改后的标题-" + Date.now(),
      })

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 保存文档内容 =================
  const handleSaveContent = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await saveDocApi(docId, {
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "这是测试内容" }],
            },
          ],
        },
      })

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 搜索文档 =================
  const handleSearch = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await searchDocApi({
        keyword: "测试",
        isStarred: false,
      })

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 收藏文档 =================
  const handleStar = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await starDocApi(docId, {
        isStarred: true,
      })

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================= 删除文档 =================
  const handleDelete = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await deleteDocApi(docId)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>文档 API 测试页面</h2>

      {/* 登录 */}
      <h3>1. 登录获取 accessToken</h3>
      <button onClick={handleLogin} disabled={loading}>
        登录测试
      </button>

      <hr />

      {/* 文档 ID */}
      <h3>当前文档 ID：</h3>
      <input
        type="number"
        value={docId}
        onChange={(e) => setDocId(Number(e.target.value))}
      />

      <hr />

      <h3>2. 创建文档</h3>
      <button onClick={handleCreateDoc}>创建文档</button>

      <h3>3. 获取文档列表</h3>
      <button onClick={handleGetList}>获取列表</button>

      <h3>4. 获取文档详情</h3>
      <button onClick={handleGetDetail}>获取详情</button>

      <h3>5. 重命名文档</h3>
      <button onClick={handleRename}>重命名</button>

      <h3>6. 保存文档内容</h3>
      <button onClick={handleSaveContent}>保存内容</button>

      <h3>7. 搜索文档</h3>
      <button onClick={handleSearch}>搜索</button>

      <h3>8. 收藏文档</h3>
      <button onClick={handleStar}>收藏文档</button>

      <h3>9. 删除文档</h3>
      <button onClick={handleDelete}>删除文档</button>

      <hr />

      {/* 返回结果 */}
      {error && (
        <div style={{ color: "red", marginTop: 20 }}>
          错误信息：{error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>接口返回：</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
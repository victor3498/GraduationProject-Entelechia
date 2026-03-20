import { useState } from "react"
import {
  loginApi,
  registerApi,
  logoutApi,
  changePasswordApi,
} from "@/api/auth"

export default function AuthTestPage() {
  // ===== 通用状态 =====
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ===== 登录测试 =====
  const [loginForm, setLoginForm] = useState({
    username: "testuser4",
    password: "testFour",
  })

  // ===== 注册测试 =====
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
  })

  // ===== 修改密码测试 =====
  const [pwdForm, setPwdForm] = useState({
    oldPassword: "",
    newPassword: "",
  })

  // ===== 登录 =====
  const handleLogin = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await loginApi(loginForm)

      // 保存 token，方便后面测试
    //   if (res.data?.accessToken) {
    //     localStorage.setItem("accessToken", res.data.accessToken)
    //     localStorage.setItem("refreshToken", res.data.refreshToken)
    //   }

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ===== 注册 =====
  const handleRegister = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await registerApi(registerForm)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ===== 退出登录 =====
  const handleLogout = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const refreshToken = localStorage.getItem("refreshToken") || ""

      const res = await logoutApi({
        refreshToken,
      })

      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ===== 修改密码 =====
  const handleChangePassword = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await changePasswordApi(pwdForm)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Auth API 测试面板</h2>

      {/* ================= 登录测试 ================= */}
      <h3>登录测试</h3>

      <input
        placeholder="username"
        value={loginForm.username}
        onChange={(e) =>
          setLoginForm({ ...loginForm, username: e.target.value })
        }
      />
      <br />

      <input
        type="password"
        placeholder="password"
        value={loginForm.password}
        onChange={(e) =>
          setLoginForm({ ...loginForm, password: e.target.value })
        }
      />
      <br />

      <button onClick={handleLogin} disabled={loading}>
        测试登录
      </button>

      <hr />

      {/* ================= 注册测试 ================= */}
      <h3>注册测试</h3>

      <input
        placeholder="username"
        value={registerForm.username}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, username: e.target.value })
        }
      />
      <br />

      <input
        type="password"
        placeholder="password"
        value={registerForm.password}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, password: e.target.value })
        }
      />
      <br />

      <button onClick={handleRegister} disabled={loading}>
        测试注册
      </button>

      <hr />

      {/* ================= 修改密码测试 ================= */}
      <h3>修改密码测试</h3>

      <input
        type="password"
        placeholder="旧密码"
        value={pwdForm.oldPassword}
        onChange={(e) =>
          setPwdForm({ ...pwdForm, oldPassword: e.target.value })
        }
      />
      <br />

      <input
        type="password"
        placeholder="新密码"
        value={pwdForm.newPassword}
        onChange={(e) =>
          setPwdForm({ ...pwdForm, newPassword: e.target.value })
        }
      />
      <br />

      <button onClick={handleChangePassword} disabled={loading}>
        测试修改密码
      </button>

      <hr />

      {/* ================= 退出登录测试 ================= */}
      <h3>退出登录测试</h3>

      <button onClick={handleLogout} disabled={loading}>
        测试退出登录
      </button>

      <hr />

      {/* ================= 返回结果 ================= */}
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
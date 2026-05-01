import { useEffect, useState } from "react"
import { Button } from "@/components/component/ui/Buttton"
import { Input } from "@/components/component/ui/Input"
import { useNavigate } from "react-router-dom"
import { loginApi, registerApi } from "@/api/auth"

/** 本地轮播图片（放到 public/images 下） */
const images = [
  "/image/view1.jpg",
  "/image/view2.jpg",
  "/image/view3.jpg",
  "/image/view4.jpg",
]

export default function LoginOrRes() {
  const navigate = useNavigate()
  /** tab 状态：login | register */
  const [tab, setTab] = useState<"login" | "register">("login")

  /** 轮播 index */
  const [index, setIndex] = useState(0)

  /** 表单状态 */
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  })

  /**输入密码验证状态 */
  const [loginValid, setLoginValid] = useState(false)
  const [registerValid, setRegisterValid] = useState(false)

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  /** 自动轮播 */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  /** 登录 */
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setError("请输入用户名和密码")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await loginApi(loginForm)
      // 存储token到localStorage
      localStorage.setItem("accessToken",response.data.accessToken)
      alert("登录成功")
      // 导航到主页
      navigate("/")
    } catch (e) {
      setError("登录失败，请检查账号密码")
    } finally {
      setLoading(false)
    }
  }

  /** 注册 */
  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.password) {
      setError("请填写完整信息")
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    try {
      setLoading(true)
      setError("")

      await registerApi({
        username: registerForm.username,
        password: registerForm.password,
      })

      alert("注册成功，请登录")
      setTab("login")
    } catch (e) {
      setError("注册失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      {/* 顶部白色区域 */}
      <div className="h-20 flex items-center px-16 bg-white shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight hover:text-blue-600 transition-colors duration-300">
          Entelechia Doc
        </h1>
      </div>

      {/* 中间蓝色区域 */}
      <div className="flex-1 w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
        <div className="w-[800px] h-[500px] bg-white rounded-2xl shadow-xl flex overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* 左侧轮播 */}
          <div className="w-1/2 h-full relative">
            <div className="relative w-full h-full">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* 底部小圆点 */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index ? "bg-white scale-110" : "bg-white/60 hover:bg-white/80"
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>

            {/* 轮播文字叠加 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h3 className="text-white text-lg font-medium mb-2">欢迎使用 Entelechia Doc</h3>
            </div>
          </div>

          {/* 右侧登录 / 注册 */}
          <div className="w-1/2 h-full flex flex-col justify-center px-12 bg-gray-50">
            {/* 标题 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{tab === 'login' ? '欢迎回来' : '创建账号'}</h2>
              <p className="text-gray-500 text-sm">{tab === 'login' ? '请登录您的账号' : '加入我们的平台'}</p>
            </div>

            {/* tab 切换 */}
            <div className="flex mb-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  tab === "login"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                账号登录
              </button>

              <button
                onClick={() => setTab("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  tab === "register"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                账号注册
              </button>
            </div>

            {/* 分享码访问入口 */}
            <div className="mb-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/share", { state: { from: "/login" } })}
                className="text-sm text-blue-600 hover:underline"
              >
                通过分享码访问文档
              </button>
            </div>

            {/* 登录表单 */}
            {tab === "login" && (
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <Input
                    placeholder="请输入用户名"
                    height={48}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        username: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="relative">
                  <Input
                    variant="password"
                    placeholder="请输入密码"
                    height={48}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    onValidChange={(valid, value) => {
                      setLoginValid(valid)
                      setLoginForm({
                        ...loginForm,
                        password: value,
                      })
                    }}
                  />

                </div>

                {/* 跳转注册 */}
                <div className="text-right text-sm text-gray-500">
                  没有账号？
                  <span
                    onClick={() => setTab("register")}
                    className="text-blue-600 font-medium cursor-pointer ml-1 hover:underline transition-colors duration-300"
                  >
                    立即注册
                  </span>
                </div>

                <Button
                  height={48}
                  loading={loading}
                  disabled={!loginValid}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
                  onClick={handleLogin}
                >
                  登录
                </Button>
              </div>
            )}

            {/* 注册表单 */}
            {tab === "register" && (
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <Input
                    placeholder="请输入用户名"
                    height={48}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        username: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="relative">
                  <Input
                    variant="password"
                    placeholder="请输入密码"
                    height={48}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    onValidChange={(valid, value) => {
                      setRegisterValid(valid)
                      setRegisterForm({
                        ...registerForm,
                        password: value,
                      })
                    }}
                  />

                </div>

                <div className="relative">
                  <Input
                    variant="password"
                    placeholder="请再次输入密码"
                    height={48}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />

                </div>

                <Button
                  height={48}
                  loading={loading}
                  disabled={!registerValid}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
                  onClick={handleRegister}
                >
                  注册
                </Button>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md border border-red-100 animate-fade-in">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部白色区域 */}
      <div className="h-20 bg-white flex items-center justify-center text-gray-500 text-sm">
        <p>© 2026 Entelechia Doc. 保留所有权利。</p>
      </div>
    </div>
  )
}
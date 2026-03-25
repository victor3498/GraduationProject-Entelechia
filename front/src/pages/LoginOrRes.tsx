import { useEffect, useState } from "react"
import { Button } from "@/components/component/ui/Buttton"
import { Input } from "@/components/component/ui/Input"
import { loginApi, registerApi } from "@/api/auth"

/** 本地轮播图片（放到 public/images 下） */
const images = [
  "/image/view1.jpg",
  "/image/view2.jpg",
  "/image/view3.jpg",
  "/image/view4.jpg",
]

export default function LoginOrRes() {
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

      await loginApi(loginForm)

      alert("登录成功")
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
    <div className="w-full h-full flex flex-col">
      {/* 顶部白色区域 */}
      <div className="h-20 flex items-center px-16 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">
          Entelechia Doc
        </h1>
      </div>

      {/* 中间蓝色区域 */}
      <div className="flex-1 w-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="w-[735px] h-[490px] bg-green-50 rounded-xl shadow-lg flex p-6 gap-6">

          {/* 左侧轮播 */}
          <div className="w-full h-full rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
               {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
              className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
                      i === index ? "opacity-100" : "opacity-0"
                      }`}
                         />
                       ))}
                     </div>

            {/* 底部小圆点 */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
 </div>
 {/**中间蓝色间隔 */}
  <div className="w-[500px] h-[700px] bg-white p-6 gap-6"></div>
  <div className="w-[500px] h-[700px] bg-yellow-50 rounded-xl shadow-lg flex p-6 gap-6"> 
          {/* 右侧登录 / 注册 */}
          <div className="w-full h-full flex flex-col justify-center px-10">

            {/* tab 切换 */}
            <div className="flex mb-8">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 pb-2 text-sm ${
                  tab === "login"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-400"
                }`}
              >
                账号登录
              </button>

              <button
                onClick={() => setTab("register")}
                className={`flex-1 pb-2 text-sm ${
                  tab === "register"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-400"
                }`}
              >
                账号注册
              </button>
            </div>

            {/* 登录表单 */}
            {tab === "login" && (
              <div className="flex flex-col gap-5">
                <Input
                  placeholder="请输入用户名"
                  height={42}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      username: e.target.value,
                    })
                  }
                />

                <Input
                  variant="password"
                  placeholder="请输入密码"
                  height={42}
                  onValidChange={(valid, value) => {
                      setLoginValid(valid)
                      setLoginForm({
                      ...loginForm,
                      password: value,
                                  })
                  }}
                />

                {/* 跳转注册 */}
                <div className="text-right text-sm text-gray-400">
                  没有账号？
                  <span
                    onClick={() => setTab("register")}
                    className="text-blue-500 cursor-pointer ml-1"
                  >
                    立即注册
                  </span>
                </div>

                <Button
                  height={42}
                  loading={loading}
                  disabled={!loginValid} 
                  onClick={handleLogin}
                >
                  登录
                </Button>
              </div>
            )}

            {/* 注册表单 */}
            {tab === "register" && (
              <div className="flex flex-col gap-5">
                <Input
                  placeholder="请输入用户名"
                  height={42}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      username: e.target.value,
                    })
                  }
                />

                <Input
                  variant="password"
                  placeholder="请输入密码"
                  height={42}
                  onValidChange={(valid, value) => {
                  setRegisterValid(valid)
                  setRegisterForm({
                  ...registerForm,
                   password: value,
                   })
                     }}
                />

                <Input
                  variant="password"
                  placeholder="请再次输入密码"
                  height={42}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />

                <Button
                  height={42}
                  loading={loading}
                  disabled={!registerValid} 
                  onClick={handleRegister}
                >
                  注册
                </Button>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="text-red-500 text-sm mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部白色区域 */}
      <div className="h-20 bg-white" />
    </div>

  )
}
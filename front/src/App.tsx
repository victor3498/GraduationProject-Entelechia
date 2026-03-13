import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor.tsx'
import { Button } from "@/components/component/ui/Buttton";
import Input  from './components/component/ui/Input/Input'

function App() {
  const [count, setCount] = useState(0)

  const handleClick =()=>{
      console.log("button")
  }

  return (
    <>
      <div style={{ padding: 40 }}>

   <Input
  variant="password"
  placeholder="请输入密码"

  width={100}
  height={50}
/>
   
     
      
    </div>
    </>
  )
}

export default App

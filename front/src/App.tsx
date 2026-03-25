import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor.tsx'
import { Button } from "@/components/component/ui/Buttton";
import { DocumentCard } from './components/component/document/DocumentItem'
import Input  from './components/component/ui/Input/Input'
import AuthTestPage from './pages/testPages/authapiTest'
import LoginOrRes from './pages/LoginOrRes'
import MainPage from './pages/mainPage'
import content from "@/components/tiptap-templates/simple/data/content.json"
import DocumentToolbar from './components/component/document/DocumentToolbar'
function App() {

// const data={ "id": 4,
//             "title": "新文档四",
//             "is_starred": true,
//             "created_at": "2026-02-04T01:13:43.267Z",
//             "updated_at": "2026-02-04T01:14:45.408Z"}


//   const [count, setCount] = useState(0)

//   const handleClick =()=>{
//       console.log("button")
//   }

  return (
    <>
      <div >
     <MainPage/>
     {/* <SimpleEditor content={content}/>   */}
      {/* <DocumentToolbar/> */}
    </div>
    </>
  )
}

export default App

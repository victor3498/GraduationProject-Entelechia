import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <SimpleEditor/>
    </>
  )
}

export default App

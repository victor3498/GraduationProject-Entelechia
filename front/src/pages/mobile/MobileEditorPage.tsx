import { useNavigate, useLocation } from 'react-router-dom'
import SimpleEditorMobile from '../../components/tiptap-templates/simple/simple-editor-mobile'
import type { JSONContent } from '@tiptap/react'

export default function MobileEditorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 从location.state中获取传递的参数
  const { docId, content, docTitle } = location.state || {}
  console.log("将要传入的content",content,docId,docTitle)
  const haReturn = () => {
    // 返回到MobileMainPage
    navigate('/mobile')
  }
  
  return (
    <div className="w-full h-screen">
      <SimpleEditorMobile 
        content={content as JSONContent} 
        docId={docId} 
        docTitle={docTitle}
        onReturn={haReturn} 
      />
    </div>
  )
}
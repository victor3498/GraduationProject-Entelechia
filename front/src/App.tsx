import { DeviceAwareRouter } from './router/app-router'
import content1  from './components/tiptap-templates/simple/data/content1.json'
import content  from './components/tiptap-templates/simple/data/content.json'
import SimpleEditorMobile from './components/tiptap-templates/simple/simple-editor-mobile'

function App() {
  return <DeviceAwareRouter />
  // return <SimpleEditorMobile content={content}/>
}

export default App

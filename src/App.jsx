import './App.css'
import LexicalEditor from './LexicalEditor.jsx'

function App() {
  return (
    <main className="app-shell">
      <h1 className="app-title">Lexical Editor</h1>
      <p className="app-subtitle">기본 툴바가 포함된 에디터</p>
      <LexicalEditor />
    </main>
  )
}

export default App

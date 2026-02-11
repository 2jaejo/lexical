import { useState } from 'react'
import './App.css'
import LexicalEditor from './LexicalEditor.jsx'

function App() {
  const [contentText, setContentText] = useState('')
  const [contentHtml, setContentHtml] = useState('')

  const handleContentChange = ({ text, html }) => {
    setContentText(text)
    setContentHtml(html)
  }

  return (
    <main className="app-shell">
      <h1 className="app-title">Lexical Editor</h1>
      <p className="app-subtitle">툴바가 포함된 에디터</p>

      <LexicalEditor onContentChange={handleContentChange} />

      <section className="viewer">
        <div className="viewer-header">
          <h2 className="viewer-title">작성된 내용</h2>
          <span className="viewer-hint">에디터에 입력된 텍스트 미리보기</span>
        </div>
        <div className="viewer-content">
          {contentText.trim().length === 0 ? (
            <span className="viewer-empty">아직 작성된 내용이 없습니다.</span>
          ) : (
            <div
              className="viewer-html"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}
        </div>
      </section>
    </main>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import LexicalEditor from './LexicalEditor.jsx'

function App() {
  // 에디터의 현재 텍스트/HTML 값을 저장
  const [contentText, setContentText] = useState('')
  const [contentHtml, setContentHtml] = useState('')

  // 에디터 내용 변경 시 호출되는 콜백
  const handleContentChange = ({ text, html }) => {
    // 텍스트 원문 저장(빈 상태 체크에 사용)
    setContentText(text)
    // HTML 렌더링용 콘텐츠 저장(서식 포함)
    setContentHtml(html)
  }

  return (
    // 페이지 레이아웃 컨테이너
    <main className="app-shell">
      {/* 제목 */}
      <h1 className="app-title">Lexical Editor</h1>
      {/* 부제목 */}
      <p className="app-subtitle">툴바가 포함된 에디터</p>

      {/* Lexical 에디터 본문 */}
      <LexicalEditor onContentChange={handleContentChange} />

      {/* 에디터 작성 결과 미리보기 */}
      <section className="viewer">
        <div className="viewer-header">
          {/* 미리보기 제목 */}
          <h2 className="viewer-title">작성된 내용</h2>
          {/* 안내 문구 */}
          <span className="viewer-hint">에디터에 입력된 텍스트 미리보기</span>
        </div>
        {/* 미리보기 본문 */}
        <div className="viewer-content">
          {/* 빈 내용일 경우 안내 메시지 표시 */}
          {contentText.trim().length === 0 ? (
            <span className="viewer-empty">아직 작성된 내용이 없습니다.</span>
          ) : (
            // HTML을 그대로 렌더링하여 서식/리스트/색상 표현
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

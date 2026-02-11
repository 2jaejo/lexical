import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { $getRoot } from 'lexical'
import { $generateHtmlFromNodes } from '@lexical/html'
import { HeadingNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import Toolbar from './LexicalToolbar'
import './LexicalEditor.css'

// Lexical 에디터에서 사용할 CSS 클래스 매핑
const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-bold',
    italic: 'editor-italic',
    underline: 'editor-underline',
    strikethrough: 'editor-strikethrough',
    code: 'editor-code',
  },
}

// 에디터 초기 설정 (네임스페이스/테마/노드/에러 핸들링)
const initialConfig = {
  // 동일 페이지에 여러 에디터가 있을 때 구분용 네임스페이스
  namespace: 'MyEditor',
  // 텍스트/문단 스타일 테마 적용
  theme,
  // 사용할 노드 등록 (Heading, List 등)
  nodes: [HeadingNode, ListNode, ListItemNode],
  // Lexical 내부 에러 처리
  onError(error) {
    console.error(error)
  },
}

export default function LexicalEditor({ onContentChange }) {
  // 에디터 내용이 변경될 때마다 호출되는 콜백
  const onChange = (editorState, editor) => {
    // 읽기 전용 트랜잭션에서 에디터 상태를 안전하게 조회
    let nextText = ''
    let nextHtml = ''
    editorState.read(() => {
      const root = $getRoot()
      // 현재 문서의 텍스트 내용
      nextText = root.getTextContent()
      // 현재 문서를 HTML로 변환 (서식/리스트/스타일 포함)
      nextHtml = $generateHtmlFromNodes(editor)
    })
    // 상위 컴포넌트에 텍스트 내용 전달
    if (typeof onContentChange === 'function') {
      onContentChange({ text: nextText, html: nextHtml })
    }
  }

  return (
    // Lexical 에디터 컨텍스트 제공
    <LexicalComposer initialConfig={initialConfig}>
      {/* 툴바 + 에디터 영역 컨테이너 */}
      <div className="editor-shell">
        {/* 서식 툴바 */}
        <Toolbar />
        {/* 콘텐츠 입력 영역 */}
        <div className="editor-container">
          <RichTextPlugin
            // 실제 입력 가능한 영역
            contentEditable={<ContentEditable className="editor-input" />}
            // 내용이 비어 있을 때 표시되는 플레이스홀더
            placeholder={
              <div className="editor-placeholder">입력하세요...</div>
            }
          />
        </div>
      </div>
      {/* 실행 취소/다시 실행 스택 */}
      <HistoryPlugin />
      {/* 리스트 기능 활성화 */}
      <ListPlugin />
      {/* 변경 감지 콜백 연결 */}
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  )
}

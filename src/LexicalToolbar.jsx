import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from '@lexical/selection'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'

export default function Toolbar() {
  // Lexical 에디터 인스턴스 가져오기
  const [editor] = useLexicalComposerContext()

  // 실행 가능 여부 및 현재 선택 상태를 저장
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)

  // 선택된 텍스트의 스타일 값을 저장
  const [textColor, setTextColor] = useState('#111827')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState('16px')
  const [fontFamily, setFontFamily] = useState('Inter, system-ui, sans-serif')

  // 현재 selection 상태를 읽어 툴바 버튼/입력값을 동기화
  const updateToolbar = useCallback(() => {
    // 현재 선택(Selection) 가져오기
    const selection = $getSelection()
    // RangeSelection일 때만 포맷/스타일 정보를 읽을 수 있음
    if ($isRangeSelection(selection)) {
      // 텍스트 포맷 활성 상태 반영
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))
      // 인라인 스타일 값 반영 (없으면 기본값 사용)
      setTextColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#111827'),
      )
      setBackgroundColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#ffffff',
        ),
      )
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '16px'),
      )
      setFontFamily(
        $getSelectionStyleValueForProperty(
          selection,
          'font-family',
          'Inter, system-ui, sans-serif',
        ),
      )
    }
  }, [])

  // 에디터 업데이트 및 selection 변경을 구독
  useEffect(() => {
    return mergeRegister(
      // 문서 상태가 변경될 때마다 툴바 동기화
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      // 커서/선택 범위가 바뀌는 경우 즉시 반영
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      // 실행 취소 가능 여부 구독
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      // 다시 실행 가능 여부 구독
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    )
  }, [editor, updateToolbar])

  // 인라인 텍스트 포맷 토글
  const format = (type) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type)
  }

  // 글자색 적용
  const applyTextColor = (event) => {
    // 컬러 입력값 반영
    const nextColor = event.target.value
    setTextColor(nextColor)
    // 선택 범위에만 스타일 적용
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: nextColor })
      }
    })
  }

  // 배경색 적용
  const applyBackgroundColor = (event) => {
    // 컬러 입력값 반영
    const nextColor = event.target.value
    setBackgroundColor(nextColor)
    // 선택 범위에만 스타일 적용
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'background-color': nextColor })
      }
    })
  }

  // 글자 크기 적용
  const applyFontSize = (event) => {
    // 선택된 글자 크기 반영
    const nextSize = event.target.value
    setFontSize(nextSize)
    // 선택 범위에만 스타일 적용
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': nextSize })
      }
    })
  }

  // 글자체 적용
  const applyFontFamily = (event) => {
    // 선택된 글자체 반영
    const nextFamily = event.target.value
    setFontFamily(nextFamily)
    // 선택 범위에만 스타일 적용
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-family': nextFamily })
      }
    })
  }

  return (
    <div className="toolbar">
      {/* 실행 취소/다시 실행 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        disabled={!canUndo}
        aria-label="Undo"
      >
        ⟲
      </button>
      {/* 다시 실행 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        disabled={!canRedo}
        aria-label="Redo"
      >
        ⟳
      </button>
      <span className="toolbar-separator" />
      {/* 인라인 텍스트 포맷 */}
      <button
        type="button"
        onClick={() => format('bold')}
        className={isBold ? 'active' : ''}
        aria-pressed={isBold}
        aria-label="Bold"
      >
        B
      </button>
      {/* 이탤릭 */}
      <button
        type="button"
        onClick={() => format('italic')}
        className={isItalic ? 'active' : ''}
        aria-pressed={isItalic}
        aria-label="Italic"
      >
        I
      </button>
      {/* 밑줄 */}
      <button
        type="button"
        onClick={() => format('underline')}
        className={isUnderline ? 'active' : ''}
        aria-pressed={isUnderline}
        aria-label="Underline"
      >
        U
      </button>
      {/* 취소선 */}
      <button
        type="button"
        onClick={() => format('strikethrough')}
        className={isStrikethrough ? 'active' : ''}
        aria-pressed={isStrikethrough}
        aria-label="Strikethrough"
      >
        S
      </button>
      {/* 인라인 코드 */}
      <button
        type="button"
        onClick={() => format('code')}
        className={isCode ? 'active' : ''}
        aria-pressed={isCode}
        aria-label="Inline code"
      >
        {'</>'}
      </button>
      <span className="toolbar-separator" />
      {/* 정렬 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        aria-label="Align left"
      >
        <span className="toolbar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <rect x="4" y="5" width="14" height="2" rx="1" />
            <rect x="4" y="10" width="18" height="2" rx="1" />
            <rect x="4" y="15" width="14" height="2" rx="1" />
            <rect x="4" y="20" width="18" height="2" rx="1" />
          </svg>
        </span>
      </button>
      {/* 가운데 정렬 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        aria-label="Align center"
      >
        <span className="toolbar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <rect x="5" y="5" width="14" height="2" rx="1" />
            <rect x="3" y="10" width="18" height="2" rx="1" />
            <rect x="5" y="15" width="14" height="2" rx="1" />
            <rect x="3" y="20" width="18" height="2" rx="1" />
          </svg>
        </span>
      </button>
      {/* 오른쪽 정렬 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        aria-label="Align right"
      >
        <span className="toolbar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <rect x="6" y="5" width="14" height="2" rx="1" />
            <rect x="2" y="10" width="18" height="2" rx="1" />
            <rect x="6" y="15" width="14" height="2" rx="1" />
            <rect x="2" y="20" width="18" height="2" rx="1" />
          </svg>
        </span>
      </button>
      {/* 양쪽 정렬 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        aria-label="Align justify"
      >
        <span className="toolbar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <rect x="2" y="5" width="20" height="2" rx="1" />
            <rect x="2" y="10" width="20" height="2" rx="1" />
            <rect x="2" y="15" width="20" height="2" rx="1" />
            <rect x="2" y="20" width="20" height="2" rx="1" />
          </svg>
        </span>
      </button>
      <span className="toolbar-separator" />
      {/* 리스트 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        aria-label="Bullet list"
      >
        • List
      </button>
      {/* 번호 매기기 리스트 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        aria-label="Numbered list"
      >
        1. List
      </button>
      {/* 리스트 제거 */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND)}
        aria-label="Remove list"
      >
        List ✕
      </button>
      <span className="toolbar-separator" />
      {/* 폰트 설정 */}
      <label className="toolbar-select">
        글자크기
        <select value={fontSize} onChange={applyFontSize} aria-label="Font size">
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
        </select>
      </label>
      {/* 글자체 설정 */}
      <label className="toolbar-select">
        글자체
        <select
          value={fontFamily}
          onChange={applyFontFamily}
          aria-label="Font family"
        >
          <option value="Inter, system-ui, sans-serif">Inter</option>
          <option value="'Noto Sans KR', system-ui, sans-serif">Noto Sans KR</option>
          <option value="'Pretendard', system-ui, sans-serif">Pretendard</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select>
      </label>
      {/* 색상 설정 */}
      <label className="toolbar-color">
        글자색
        <input
          type="color"
          value={textColor}
          onChange={applyTextColor}
          aria-label="Text color"
        />
      </label>
      {/* 배경색 설정 */}
      <label className="toolbar-color">
        배경색
        <input
          type="color"
          value={backgroundColor}
          onChange={applyBackgroundColor}
          aria-label="Background color"
        />
      </label>
    </div>
  )
}

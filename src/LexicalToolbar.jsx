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
  const [editor] = useLexicalComposerContext()

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [textColor, setTextColor] = useState('#111827')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState('16px')
  const [fontFamily, setFontFamily] = useState('Inter, system-ui, sans-serif')

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))
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

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
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

  const format = (type) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type)
  }

  const applyTextColor = (event) => {
    const nextColor = event.target.value
    setTextColor(nextColor)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: nextColor })
      }
    })
  }

  const applyBackgroundColor = (event) => {
    const nextColor = event.target.value
    setBackgroundColor(nextColor)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'background-color': nextColor })
      }
    })
  }

  const applyFontSize = (event) => {
    const nextSize = event.target.value
    setFontSize(nextSize)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': nextSize })
      }
    })
  }

  const applyFontFamily = (event) => {
    const nextFamily = event.target.value
    setFontFamily(nextFamily)
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-family': nextFamily })
      }
    })
  }

  return (
    <div className="toolbar">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        disabled={!canUndo}
        aria-label="Undo"
      >
        ⟲
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        disabled={!canRedo}
        aria-label="Redo"
      >
        ⟳
      </button>
      <span className="toolbar-separator" />
      <button
        type="button"
        onClick={() => format('bold')}
        className={isBold ? 'active' : ''}
        aria-pressed={isBold}
        aria-label="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => format('italic')}
        className={isItalic ? 'active' : ''}
        aria-pressed={isItalic}
        aria-label="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => format('underline')}
        className={isUnderline ? 'active' : ''}
        aria-pressed={isUnderline}
        aria-label="Underline"
      >
        U
      </button>
      <button
        type="button"
        onClick={() => format('strikethrough')}
        className={isStrikethrough ? 'active' : ''}
        aria-pressed={isStrikethrough}
        aria-label="Strikethrough"
      >
        S
      </button>
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
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        aria-label="Bullet list"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        aria-label="Numbered list"
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND)}
        aria-label="Remove list"
      >
        List ✕
      </button>
      <span className="toolbar-separator" />
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
      <label className="toolbar-select">
        글자체
        <select
          value={fontFamily}
          onChange={applyFontFamily}
          aria-label="Font family"
        >
          <option value="Inter, system-ui, sans-serif">Inter</option>
          <option value="'Noto Sans KR', system-ui, sans-serif">
            Noto Sans KR
          </option>
          <option value="'Pretendard', system-ui, sans-serif">
            Pretendard
          </option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select>
      </label>
      <label className="toolbar-color">
        글자색
        <input
          type="color"
          value={textColor}
          onChange={applyTextColor}
          aria-label="Text color"
        />
      </label>
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

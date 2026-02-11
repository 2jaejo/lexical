import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { $getRoot } from 'lexical'
import { HeadingNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import Toolbar from './LexicalToolbar'
import './LexicalEditor.css'

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

const initialConfig = {
  namespace: 'MyEditor',
  theme,
  nodes: [HeadingNode, ListNode, ListItemNode],
  onError(error) {
    console.error(error)
  },
}

export default function LexicalEditor() {
  const onChange = (editorState) => {
    editorState.read(() => {
      const root = $getRoot()
      console.log(root.getTextContent())
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-shell">
        <Toolbar />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">입력하세요...</div>
            }
          />
        </div>
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  )
}

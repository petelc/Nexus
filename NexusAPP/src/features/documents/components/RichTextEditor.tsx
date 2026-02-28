import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import type { EditorState } from 'lexical';
import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string, editorState: EditorState) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

const editorTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {},
};

export const RichTextEditor = ({
  initialContent,
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  autoFocus = false,
}: RichTextEditorProps) => {
  const theme = useTheme();

  const initialConfig = {
    namespace: 'NexusEditor',
    theme: editorTheme,
    onError: (error: Error) => {
      console.error('Lexical Error:', error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editable: !readOnly,
    editorState: initialContent || undefined,
  };

  const handleChange = (editorState: EditorState) => {
    if (onChange) {
      // Convert editor state to JSON string for storage
      const json = JSON.stringify(editorState.toJSON());
      onChange(json, editorState);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <LexicalComposer initialConfig={initialConfig}>
        {!readOnly && <EditorToolbar />}
        <Box sx={{ position: 'relative', minHeight: '400px' }}>
          <RichTextPlugin
            contentEditable={
              <Box
                sx={{
                  position: 'relative',
                  outline: 'none',
                  minHeight: '400px',
                  p: 3,
                  '& .editor-paragraph': {
                    margin: 0,
                    marginBottom: 1,
                    position: 'relative',
                  },
                  '& .editor-heading-h1': {
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '1rem 0',
                  },
                  '& .editor-heading-h2': {
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    margin: '0.75rem 0',
                  },
                  '& .editor-heading-h3': {
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    margin: '0.5rem 0',
                  },
                  '& .editor-quote': {
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    paddingLeft: 2,
                    marginLeft: 0,
                    marginRight: 0,
                    fontStyle: 'italic',
                  },
                  '& .editor-list-ol, & .editor-list-ul': {
                    padding: 0,
                    margin: '0.5rem 0',
                    paddingLeft: 3,
                  },
                  '& .editor-listitem': {
                    margin: '0.25rem 0',
                  },
                  '& .editor-link': {
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  },
                  '& .editor-text-bold': {
                    fontWeight: 700,
                  },
                  '& .editor-text-italic': {
                    fontStyle: 'italic',
                  },
                  '& .editor-text-underline': {
                    textDecoration: 'underline',
                  },
                  '& .editor-text-strikethrough': {
                    textDecoration: 'line-through',
                  },
                  '& .editor-text-code': {
                    backgroundColor: theme.palette.action.hover,
                    padding: '0.125rem 0.25rem',
                    borderRadius: '3px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                  },
                  '& .editor-code': {
                    backgroundColor: theme.palette.action.hover,
                    padding: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    display: 'block',
                    overflow: 'auto',
                  },
                }}
              >
                <ContentEditable
                  style={{
                    minHeight: '400px',
                    outline: 'none',
                  }}
                />
              </Box>
            }
            placeholder={
              <Box
                sx={{
                  position: 'absolute',
                  top: 24,
                  left: 24,
                  color: theme.palette.text.secondary,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {placeholder}
              </Box>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <LinkPlugin />
          <ListPlugin />
          {autoFocus && <AutoFocusPlugin />}
        </Box>
      </LexicalComposer>
    </Box>
  );
};

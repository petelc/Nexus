import { Box } from '@mui/material';
import Editor, { type BeforeMount, OnChange } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '@app/hooks';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string | number;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
}

export const CodeEditor = ({
  value,
  onChange,
  language,
  readOnly = false,
  height = '500px',
  showLineNumbers = true,
  showMinimap = true,
}: CodeEditorProps) => {
  const theme = useTheme();
  const editorFontSize = useAppSelector((state) => state.snippets.editorFontSize);
  const editorWordWrap = useAppSelector((state) => state.snippets.editorWordWrap);

  const nexusTheme = theme.palette.mode === 'dark' ? 'nexus-dark' : 'nexus-light';

  // Define custom themes before the editor mounts so the theme prop can reference them directly.
  // Using beforeMount (not onMount) prevents the brief flash of vs-dark/vs-light red border.
  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('nexus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.palette.background.paper,
        'editor.foreground': theme.palette.text.primary,
        'editor.lineHighlightBackground': theme.palette.action.hover,
        'editor.lineHighlightBorder': '#00000000',
        'editorLineNumber.foreground': theme.palette.text.secondary,
        'editorCursor.foreground': theme.palette.primary.main,
      },
    });

    monaco.editor.defineTheme('nexus-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.palette.background.paper,
        'editor.foreground': theme.palette.text.primary,
        'editor.lineHighlightBackground': theme.palette.action.hover,
        'editor.lineHighlightBorder': '#00000000',
        'editorLineNumber.foreground': theme.palette.text.secondary,
        'editorCursor.foreground': theme.palette.primary.main,
      },
    });
  };

  const handleChange: OnChange = (value) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
        '& .monaco-editor': {
          paddingTop: 1,
        },
      }}
    >
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        beforeMount={handleBeforeMount}
        theme={nexusTheme}
        options={{
          readOnly,
          fontSize: editorFontSize,
          wordWrap: editorWordWrap ? 'on' : 'off',
          lineNumbers: showLineNumbers ? 'on' : 'off',
          minimap: {
            enabled: showMinimap,
          },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          renderWhitespace: 'selection',
          fontFamily: 'Fira Code, Monaco, Courier New, monospace',
          fontLigatures: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          contextmenu: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          matchBrackets: 'always',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoIndent: 'full',
          quickSuggestions: !readOnly,
          suggestOnTriggerCharacters: !readOnly,
          acceptSuggestionOnEnter: readOnly ? 'off' : 'on',
        }}
        loading={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
            }}
          >
            Loading editor...
          </Box>
        }
      />
    </Box>
  );
};

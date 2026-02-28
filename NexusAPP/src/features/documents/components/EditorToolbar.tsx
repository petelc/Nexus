import { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Divider, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  StrikethroughS as StrikethroughIcon,
  Code as CodeIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  FormatQuote as QuoteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from '@mui/icons-material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  $isRootOrShadowRoot,
  $createParagraphNode,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $isHeadingNode, $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote' | 'bullet' | 'number';

const BLOCK_TYPE_OPTIONS: { value: BlockType; label: string }[] = [
  { value: 'paragraph', label: 'Normal' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'quote', label: 'Quote' },
  { value: 'bullet', label: 'Bullet List' },
  { value: 'number', label: 'Numbered List' },
];

export const EditorToolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type === 'bullet' ? 'bullet' : 'number');
      } else if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag as BlockType);
      } else {
        const type = element.getType();
        if (type === 'quote') {
          setBlockType('quote');
        } else {
          setBlockType('paragraph');
        }
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatBlock = useCallback(
    (type: BlockType) => {
      if (type === 'bullet') {
        if (blockType !== 'bullet') {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
      } else if (type === 'number') {
        if (blockType !== 'number') {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
      } else {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (type === 'paragraph') {
              $setBlocksType(selection, () => $createParagraphNode());
            } else if (type === 'quote') {
              $setBlocksType(selection, () => $createQuoteNode());
            } else if (type === 'h1' || type === 'h2' || type === 'h3') {
              $setBlocksType(selection, () => $createHeadingNode(type as HeadingTagType));
            }
          }
        });
      }
    },
    [editor, blockType],
  );

  const handleBlockTypeChange = (event: SelectChangeEvent<BlockType>) => {
    formatBlock(event.target.value as BlockType);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderBottom: 1,
        borderColor: 'divider',
        flexWrap: 'wrap',
      }}
    >
      <IconButton size="small" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <UndoIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <RedoIcon fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Select
        size="small"
        value={blockType}
        onChange={handleBlockTypeChange}
        sx={{ minWidth: 140, '& .MuiSelect-select': { py: 0.5, fontSize: '0.875rem' } }}
      >
        {BLOCK_TYPE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        color={isBold ? 'primary' : 'default'}
      >
        <BoldIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        color={isItalic ? 'primary' : 'default'}
      >
        <ItalicIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        color={isUnderline ? 'primary' : 'default'}
      >
        <UnderlineIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        color={isStrikethrough ? 'primary' : 'default'}
      >
        <StrikethroughIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        color={isCode ? 'primary' : 'default'}
      >
        <CodeIcon fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <IconButton
        size="small"
        onClick={() => formatBlock('bullet')}
        color={blockType === 'bullet' ? 'primary' : 'default'}
      >
        <BulletListIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => formatBlock('number')}
        color={blockType === 'number' ? 'primary' : 'default'}
      >
        <NumberedListIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => formatBlock('quote')}
        color={blockType === 'quote' ? 'primary' : 'default'}
      >
        <QuoteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Extension } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import {
  BlockQuoteIcon,
  BoldIcon,
  ClearMarksIcon,
  CodeBlockIcon,
  CodeIcon,
  EraserIcon,
  FontColorIcon,
  HeadingOneIcon,
  HeadingTwoIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  RedoIcon,
  SeparatorIcon,
  StrikethroughIcon,
  UndoIcon,
  UnlinkIcon,
  UnorderedListIcon,
} from './icons';

type TipTapEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const PURPLE_COLOR = '#958DF1';

/** Cmd+8 toggles bullet list (Google Docs style). */
const ListShortcuts = Extension.create({
  name: 'listShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-8': () => this.editor.chain().focus().toggleBulletList().run(),
      'Mod-Shift-8': () => this.editor.chain().focus().toggleOrderedList().run(),
    };
  },
});

const LinkWithShortcut = Link.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        const editor = this.editor;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return true;
        if (url === '') {
          return editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }
        return editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      },
    };
  },
});

export const TipTapEditor = (props: TipTapEditorProps) => {
  const {
    content,
    onChange,
    placeholder = 'Enter description...',
    disabled = false,
  } = props;

  const lastEmittedHtml = useRef(content || '');

  const editor = useEditor({
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      lastEmittedHtml.current = html;
      onChange(html);
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      LinkWithShortcut,
      ListShortcuts,
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
  });

  useEffect(() => {
    if (!editor || content === undefined) return;
    if (content !== lastEmittedHtml.current) {
      lastEmittedHtml.current = content || '';
      editor.commands.setContent(content || '', false);
    }
  }, [editor, content]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const keepEditorFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className={styles.wrapper}>
      {!disabled && (
        <div className={styles.toolbar}>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={styles.toolbarButton}
          >
            <BoldIcon className={`${styles.icon} ${editor.isActive('bold') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={styles.toolbarButton}
          >
            <ItalicIcon className={`${styles.icon} ${editor.isActive('italic') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={styles.toolbarButton}
          >
            <StrikethroughIcon className={`${styles.icon} ${editor.isActive('strike') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={setLink} className={styles.toolbarButton}>
            <LinkIcon className={`${styles.icon} ${editor.isActive('link') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className={styles.toolbarButton}
          >
            <UnlinkIcon className={`${styles.icon} ${editor.isActive('link') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={styles.toolbarButton}
          >
            <CodeIcon className={`${styles.icon} ${editor.isActive('code') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().unsetAllMarks().run()} className={styles.toolbarButton}>
            <ClearMarksIcon className={styles.icon} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().clearNodes().run()} className={styles.toolbarButton}>
            <EraserIcon className={styles.icon} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={styles.toolbarButton}
          >
            <HeadingOneIcon className={`${styles.icon} ${editor.isActive('heading', { level: 1 }) ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={styles.toolbarButton}
          >
            <HeadingTwoIcon className={`${styles.icon} ${editor.isActive('heading', { level: 2 }) ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().toggleBulletList().run()} className={styles.toolbarButton}>
            <UnorderedListIcon className={`${styles.icon} ${editor.isActive('bulletList') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().toggleOrderedList().run()} className={styles.toolbarButton}>
            <OrderedListIcon className={`${styles.icon} ${editor.isActive('orderedList') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={styles.toolbarButton}>
            <CodeBlockIcon className={`${styles.icon} ${editor.isActive('codeBlock') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().toggleBlockquote().run()} className={styles.toolbarButton}>
            <BlockQuoteIcon className={`${styles.icon} ${editor.isActive('blockquote') ? styles.iconActive : styles.iconInactive}`} />
          </button>
          <button type="button" onMouseDown={keepEditorFocus} onClick={() => editor.chain().focus().setHorizontalRule().run()} className={styles.toolbarButton}>
            <SeparatorIcon className={styles.icon} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={styles.toolbarButton}
          >
            <UndoIcon className={styles.icon} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className={styles.toolbarButton}
          >
            <RedoIcon className={styles.icon} />
          </button>
          <button
            type="button"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setColor(PURPLE_COLOR).run()}
            className={styles.toolbarButton}
          >
            <FontColorIcon
              className={`${styles.icon} ${editor.isActive('textStyle', { color: PURPLE_COLOR }) ? styles.iconActive : styles.iconInactive}`}
            />
          </button>
        </div>
      )}
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
};

const styles = {
  wrapper: `
    overflow-hidden rounded border border-gray-300 bg-white
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
  `,
  toolbar: `
    flex flex-wrap items-center gap-0.5 border-b border-gray-300 bg-gray-50 p-3
  `,
  toolbarButton: `
    rounded p-1.5
    hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
  `,
  icon: `
    w-5 h-5
  `,
  iconActive: `
    text-black
  `,
  iconInactive: `
    text-gray-500
  `,
  editorContent: `
    min-h-[160px] max-w-none px-3 py-3 prose prose-sm text-sm bg-white text-gray-900
    [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:text-gray-900 [&_.ProseMirror.ProseMirror-empty:before]:text-gray-400
  `,
};

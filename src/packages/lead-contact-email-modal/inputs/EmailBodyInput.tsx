'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { CurrentLeadContactEmailActions } from '@/src/store/current';
import type { TiptapContent } from '@/src/model/lead-contact-email';

export const EmailBodyInput = () => {
  const dispatch = useAppDispatch();
  const body = useAppSelector((s) => s.currentLeadContactEmail.body);
  const isInternal = useRef(false);
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Placeholder.configure({ placeholder: 'Write your email…' }),
    ],
    content: body,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: styles.editorInner },
    },
    onUpdate: ({ editor: ed }) => {
      isInternal.current = true;
      dispatch(
        CurrentLeadContactEmailActions.setBody(ed.getJSON() as TiptapContent)
      );
    },
  });

  useEffect(() => {
    if (!editor || !body?.content) return;
    if (isInternal.current) {
      isInternal.current = false;
      return;
    }
    if (!body.content.length) return;
    editor.commands.setContent(body);
  }, [body, editor]);

  const setLink = () => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().unsetLink().run();
      setShowLink(false);
      return;
    }
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    editor?.chain().focus().setLink({ href: url }).run();
    setShowLink(false);
    setLinkUrl('');
  };

  if (!editor) return null;

  const tb = (active: boolean) =>
    `${styles.tbBtn} ${active ? styles.tbOn : ''}`;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Body</span>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={tb(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('underline'))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('link'))}
          onClick={() =>
            editor.isActive('link')
              ? editor.chain().focus().unsetLink().run()
              : setShowLink(!showLink)
          }
        >
          <Link2 className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('highlight'))}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className={styles.tbIcon} />
        </button>
        <span className={styles.div} />
        <button
          type="button"
          className={tb(editor.isActive({ textAlign: 'left' }))}
          onClick={() =>
            editor.chain().focus().setTextAlign('left').run()
          }
        >
          <AlignLeft className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive({ textAlign: 'center' }))}
          onClick={() =>
            editor.chain().focus().setTextAlign('center').run()
          }
        >
          <AlignCenter className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive({ textAlign: 'right' }))}
          onClick={() =>
            editor.chain().focus().setTextAlign('right').run()
          }
        >
          <AlignRight className={styles.tbIcon} />
        </button>
        <span className={styles.div} />
        <button
          type="button"
          className={tb(editor.isActive('bulletList'))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('orderedList'))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('heading', { level: 1 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className={styles.tbIcon} />
        </button>
        <button
          type="button"
          className={tb(editor.isActive('heading', { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className={styles.tbIcon} />
        </button>
      </div>
      {showLink && (
        <div className={styles.linkRow}>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://…"
            className={styles.linkInp}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
            }}
          />
          <button type="button" onClick={setLink} className={styles.linkOk}>
            Apply
          </button>
        </div>
      )}
      <div className={styles.editorBox}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const styles = {
  wrap: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  toolbar: `
    flex flex-wrap items-center gap-0.5 p-2 rounded-t-xl border border-b-0 border-gray-200 bg-gray-50
  `,
  tbBtn: `
    p-1.5 rounded-md text-gray-600 hover:bg-gray-200 border-none bg-transparent cursor-pointer
  `,
  tbOn: `bg-blue-100 text-blue-800`,
  tbIcon: `h-4 w-4`,
  div: `w-px h-5 bg-gray-300 mx-1`,
  linkRow: `flex gap-2 p-2 bg-sky-50 border border-gray-200 border-b-0 rounded-t-lg`,
  linkInp: `
    flex-1 px-2 py-1 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-blue-500
  `,
  linkOk: `
    px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 border-none cursor-pointer
  `,
  editorBox: `
    border border-gray-200 rounded-b-xl min-h-[220px] focus-within:ring-2 focus-within:ring-blue-500/20
  `,
  editorInner: [
    'outline-none p-3 min-h-[220px] prose prose-sm max-w-none',
    '[&_p]:my-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6',
  ].join(' '),
};

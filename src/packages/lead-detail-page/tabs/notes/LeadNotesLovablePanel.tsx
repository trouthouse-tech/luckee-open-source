'use client';

import { useState, useEffect, useMemo } from 'react';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  createLeadNoteThunk,
  deleteLeadNoteThunk,
  getLeadNotesByLeadIdThunk,
} from '@/src/store/thunks/lead-notes';

const formatDate = (iso: string | Date) => {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const LeadNotesLovablePanel = () => {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector(
    (state) => state.leadBuilder.activeLeadDetailTab === 'Notes'
  );
  const leadId = useAppSelector((state) => state.currentLead?.id ?? '');
  const leadNotesRecord = useAppSelector((state) => state.leadNotes);

  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const notes = useMemo(() => {
    return Object.values(leadNotesRecord)
      .filter((n) => n.lead_id === leadId)
      .sort((a, b) => {
        const dateA =
          typeof a.created_at === 'string'
            ? new Date(a.created_at)
            : a.created_at;
        const dateB =
          typeof b.created_at === 'string'
            ? new Date(b.created_at)
            : b.created_at;
        return dateB.getTime() - dateA.getTime();
      });
  }, [leadNotesRecord, leadId]);

  useEffect(() => {
    setHasLoaded(false);
    setNewNote('');
  }, [leadId]);

  useEffect(() => {
    const load = async () => {
      if (!isActive || !leadId || hasLoaded) return;
      setIsLoading(true);
      await dispatch(getLeadNotesByLeadIdThunk(leadId));
      setIsLoading(false);
      setHasLoaded(true);
    };
    load();
  }, [dispatch, leadId, hasLoaded, isActive]);

  if (!isActive || !leadId) return null;

  const handleAdd = async () => {
    if (!newNote.trim() || isSaving) return;
    setIsSaving(true);
    const result = await dispatch(createLeadNoteThunk(leadId, newNote.trim()));
    if (result === 200) {
      setNewNote('');
    }
    setIsSaving(false);
  };

  const handleDelete = async (noteId: string) => {
    await dispatch(deleteLeadNoteThunk(noteId));
  };

  return (
    <div className={styles.tabShell}>
      <div className={styles.wrapper}>
        <div className={styles.addSection}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            rows={3}
            className={styles.textarea}
            disabled={isSaving}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newNote.trim() || isSaving}
            className={styles.addBtn}
          >
            <Plus className={styles.iconBtn} />
            {isSaving ? 'Saving…' : 'Add note'}
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading notes…</div>
        ) : notes.length === 0 ? (
          <div className={styles.empty}>
            <StickyNote className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No notes yet</p>
            <p className={styles.emptyHint}>Add your first note above.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {notes.map((note) => (
              <div key={note.id} className={styles.card}>
                <p className={styles.noteContent}>{note.content}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    {formatDate(note.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    className={styles.deleteBtn}
                    aria-label="Delete note"
                  >
                    <Trash2 className={styles.iconTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  tabShell: `
    rounded-lg border border-gray-200 bg-white p-6
  `,
  wrapper: `space-y-5`,
  addSection: `space-y-2`,
  textarea: `
    w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white
    text-gray-900 placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
    disabled:bg-gray-50 disabled:cursor-not-allowed
  `,
  addBtn: `
    inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg
    bg-blue-600 text-white hover:bg-blue-700 transition-colors
    disabled:opacity-50 disabled:pointer-events-none border-none cursor-pointer
  `,
  iconBtn: `h-4 w-4`,
  loading: `text-center py-8 text-sm text-gray-500`,
  empty: `flex flex-col items-center justify-center py-12 gap-2`,
  emptyIcon: `h-8 w-8 text-gray-300`,
  emptyTitle: `text-base font-medium text-gray-900`,
  emptyHint: `text-sm text-gray-500`,
  list: `grid gap-3`,
  card: `rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-2`,
  noteContent: `text-sm text-gray-900 whitespace-pre-wrap`,
  cardFooter: `flex items-center justify-between`,
  date: `text-xs text-gray-500`,
  deleteBtn: `
    p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  iconTrash: `h-3.5 w-3.5`,
};

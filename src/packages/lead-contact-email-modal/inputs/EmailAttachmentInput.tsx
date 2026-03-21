'use client';

import { type ChangeEvent, useEffect, useState } from 'react';
import { Paperclip, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { CurrentLeadContactEmailActions } from '@/src/store/current';
import { LeadContactEmailAttachmentsActions } from '@/src/store/dumps/leadContactEmailAttachments';
import {
  getAttachmentsByEmailId,
  deleteAttachment,
} from '@/src/api/lead-contact-email-attachments';
import { formatFileSize } from '@/src/utils/files';

const MAX_BYTES = 5 * 1024 * 1024;

export const EmailAttachmentInput = () => {
  const dispatch = useAppDispatch();
  const currentEmail = useAppSelector((s) => s.currentLeadContactEmail);
  const all = useAppSelector((s) => s.leadContactEmailAttachments);
  const attachments = currentEmail.attachment_ids
    .map((id) => all[id])
    .filter(Boolean);
  const pending = currentEmail.pendingAttachmentFile;
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!currentEmail.id) return;
      const res = await getAttachmentsByEmailId(currentEmail.id);
      if (res.success && res.data?.length) {
        dispatch(LeadContactEmailAttachmentsActions.addAttachments(res.data));
        dispatch(
          CurrentLeadContactEmailActions.updateFields({
            attachment_ids: res.data.map((a) => a.id),
          })
        );
      }
    };
    void load();
  }, [currentEmail.id, dispatch]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_BYTES) {
      alert('File too large (max 5MB).');
      return;
    }
    const ok = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!ok.includes(file.type)) {
      alert('Only PDF, PNG, or JPG.');
      return;
    }
    dispatch(CurrentLeadContactEmailActions.setPendingAttachmentFile(file));
  };

  const removePending = () => {
    dispatch(CurrentLeadContactEmailActions.setPendingAttachmentFile(null));
  };

  const removeSaved = async (id: string) => {
    if (!confirm('Remove this attachment?')) return;
    setDeleting(true);
    const res = await deleteAttachment(id);
    if (res.success) {
      dispatch(LeadContactEmailAttachmentsActions.removeAttachment(id));
      dispatch(
        CurrentLeadContactEmailActions.removeAttachmentId(id)
      );
    }
    setDeleting(false);
  };

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Attachments</span>
      <label className={styles.upload}>
        <Paperclip className={styles.clip} />
        <span>Add file (save email first to upload)</span>
        <input
          type="file"
          accept=".pdf,image/png,image/jpeg"
          className={styles.file}
          onChange={onFile}
        />
      </label>
      {pending && (
        <div className={styles.row}>
          <span className={styles.name}>{pending.name}</span>
          <span className={styles.meta}>
            {formatFileSize(pending.size)} — uploads on Save
          </span>
          <button
            type="button"
            onClick={removePending}
            className={styles.del}
          >
            <Trash2 className={styles.delIcon} />
          </button>
        </div>
      )}
      {attachments.map((a) => (
        <div key={a.id} className={styles.row}>
          <span className={styles.name}>{a.file_name}</span>
          <span className={styles.meta}>{formatFileSize(a.file_size_bytes)}</span>
          <button
            type="button"
            disabled={deleting}
            onClick={() => removeSaved(a.id)}
            className={styles.del}
          >
            <Trash2 className={styles.delIcon} />
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  wrap: `space-y-2`,
  label: `text-xs font-medium text-gray-600`,
  upload: `
    relative inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600
    border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50
  `,
  clip: `h-4 w-4`,
  file: `absolute inset-0 opacity-0 cursor-pointer`,
  row: `
    flex flex-wrap items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm
  `,
  name: `font-medium text-gray-800`,
  meta: `text-xs text-gray-500`,
  del: `ml-auto p-1 text-red-600 hover:bg-red-50 rounded border-none bg-transparent cursor-pointer`,
  delIcon: `h-4 w-4`,
};

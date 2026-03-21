import type { TiptapContent } from '@/src/model/lead-contact-email';

/**
 * Flattens TipTap JSON to plain text for previews.
 */
export const tiptapContentToPlainText = (node: TiptapContent | null): string => {
  if (!node) return '';
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text;
  }
  if (!node.content?.length) return '';
  return node.content.map((c) => tiptapContentToPlainText(c as TiptapContent)).join('');
};

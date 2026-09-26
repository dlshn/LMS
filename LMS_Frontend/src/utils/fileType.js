// Notes come from a handful of mime types (see upload.middleware's accept
// list) — map each to a short label + color class for the thumbnail card.
// Actual images render as a real thumbnail; everything else gets a
// file-type badge since browsers can't preview DOC/PPT/PDF content inline
// without a rendering library.
export function getFileDisplay(fileType) {
  if (fileType?.startsWith('image/')) {
    return { kind: 'image', label: 'IMG' };
  }
  if (fileType === 'application/pdf') {
    return { kind: 'pdf', label: 'PDF' };
  }
  if (fileType?.includes('word') || fileType?.includes('wordprocessingml')) {
    return { kind: 'doc', label: 'DOC' };
  }
  if (fileType?.includes('powerpoint') || fileType?.includes('presentationml')) {
    return { kind: 'ppt', label: 'PPT' };
  }
  return { kind: 'file', label: 'FILE' };
}

// "18/03/26, 21:38" — date + time together since a note list has no
// separate column for it like the admin table did.
export function formatUploaded(dateStr) {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date}, ${time}`;
}

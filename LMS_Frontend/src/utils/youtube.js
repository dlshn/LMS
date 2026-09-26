const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function getYoutubeEmbedUrl(url) {
  const match = String(url || '').match(YOUTUBE_ID_REGEX);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function getYoutubeThumbnail(url) {
  const match = String(url || '').match(YOUTUBE_ID_REGEX);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

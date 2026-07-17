export const FORMAT_MAP: Record<string, string[]> = {
  // Images
  png: ["jpg", "jpeg", "webp", "avif", "gif", "tiff"],
  jpg: ["png", "webp", "avif", "gif", "tiff"],
  jpeg: ["png", "jpg", "webp", "avif", "gif", "tiff"],
  webp: ["png", "jpg", "jpeg", "avif", "gif", "tiff"],
  avif: ["png", "jpg", "jpeg", "webp", "gif", "tiff"],
  gif: ["png", "jpg", "jpeg", "webp", "avif", "tiff"],
  tiff: ["png", "jpg", "jpeg", "webp", "avif", "gif"],

  // Documents
  pdf: ["docx"],
  docx: ["pdf"],
  pptx: ["pdf"],
  xlsx: ["pdf"],

  // Audio
  mp3: ["wav", "flac", "ogg", "aac", "m4a"],
  wav: ["mp3", "flac", "ogg", "aac", "m4a"],
  flac: ["mp3", "wav", "ogg", "aac", "m4a"],
  ogg: ["mp3", "wav", "flac", "aac", "m4a"],
  aac: ["mp3", "wav", "flac", "ogg", "m4a"],
  m4a: ["mp3", "wav", "flac", "ogg", "aac"],

  // Video
  mp4: ["mov", "avi", "webm", "mkv", "mp3"],
  mov: ["mp4", "avi", "webm", "mkv"],
  avi: ["mp4", "mov", "webm", "mkv"],
  webm: ["mp4", "mov", "avi", "mkv"],
  mkv: ["mp4", "mov", "avi", "webm"],

  // Archive
  zip: ["7z", "rar", "tar"],
  rar: ["zip", "7z", "tar"],
  "7z": ["zip", "rar", "tar"],
  tar: ["zip", "rar", "7z"],
};
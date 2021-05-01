const MimeTypes = {
  imageTypes: ["image/apng", "image/bmp", "image/gif", "image/x-icon", "image/jpeg", "image/png", "image/webp"],
  audioTypes: ["audio/webm", "audio/wave", "audio/wav", "audio/ogg", "audio/opus", "audio/mpeg", "audio/flac", "audio/aac", "audio/x-wav", "audio/wave", "audio/x-flac", "audio/x-ogg", "audio/x-mpeg"],
  videoTypes: ["video/x-msvideo", "video/mpeg", "video/ogg", "video/mp4", "video/webm", "video/3gpp", "video/quicktime"],
  specialTypes: ["application/pdf"],
  textTypes: ["text/plain", "application/json", "text/markdown", "text/css", "text/csv", "text/html", "text/javascript", "application/xml", "text/xml"],
  previewTypes: [""]
};

MimeTypes.previewTypes = MimeTypes.imageTypes.concat(MimeTypes.audioTypes.concat(MimeTypes.videoTypes.concat(MimeTypes.specialTypes.concat(MimeTypes.textTypes))));

export default MimeTypes;
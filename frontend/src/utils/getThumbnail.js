// frontend/src/utils/getThumbnail.js
export default async function getThumbnail(file, opts = {}) {
  const { frameTime = 0, maxWidth = 800, quality = 0.8 } = opts;
  if (!(file instanceof Blob)) throw new TypeError('file must be a File/Blob');

  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    await once(video, 'loadedmetadata');
    const t = Math.max(0, Math.min(frameTime, (video.duration || 0) - 0.1));
    video.currentTime = isFinite(t) ? t : 0;
    await once(video, 'seeked');

    const w = Math.min(maxWidth, video.videoWidth);
    const h = (video.videoHeight / video.videoWidth) * w;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w);
    canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
function once(target, type) {
  return new Promise((res, rej) => {
    const ok = () => { cleanup(); res(); };
    const err = e => { cleanup(); rej(e); };
    const cleanup = () => { target.removeEventListener(type, ok); target.removeEventListener('error', err); };
    target.addEventListener(type, ok, { once: true });
    target.addEventListener('error', err, { once: true });
  });
}

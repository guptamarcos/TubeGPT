export default function isYouTubeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");
    return [
      "youtube.com",
      "youtu.be",
      "m.youtube.com",
      "music.youtube.com",
    ].includes(hostname);
  } catch {
    return false;
  }
}

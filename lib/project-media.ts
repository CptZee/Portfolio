export function getEmbedUrl(source: string): string | null {
    try {
        const url = new URL(source);
        if (url.protocol !== "https:") return null;
        const youtubeHosts = ["youtube.com", "www.youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com", "youtu.be"];
        if (youtubeHosts.includes(url.hostname)) {
            const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1];
            return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
        }
        if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
            const id = url.pathname.match(/^\/(?:video\/)?(\d+)$/)?.[1];
            return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
        }
    } catch { /* Invalid URLs are not embedded. */ }
    return null;
}

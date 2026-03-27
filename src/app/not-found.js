export default function NotFound(){
    const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || "NewsTamil24X7TV";
    const embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;

    return (
        <div style={{minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 20}}>
            <div style={{textAlign: "center"}}>
                <h1 style={{margin: 0}}>Site Under Construction</h1>
                <p style={{margin: 0}}>Sorry for the inconvenience.</p>
            </div>

            <div style={{width: "100%", maxWidth: 900, aspectRatio: "16/9"}}>
                <iframe
                    title="Live Stream"
                    src={embedUrl}
                    style={{width: "100%", height: "100%", border: 0}}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
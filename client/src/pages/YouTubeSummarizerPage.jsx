import { useState } from "react";
import {
  Link2,
  Sparkles,
  LoaderCircle,
  Trash2,
  Eraser,
} from "lucide-react";
import { toast } from "react-toastify";

import ActionCard from "../components/ActionCard.jsx";
import { getSummary } from "../api/Video.js";
import { Navbar } from "../components/Navbar.jsx";

function isYouTubeUrl(url) {
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

export default function YouTubeSummarizerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async (e) => {
    e.preventDefault();

    if (url === "") {
      toast.error("Please enter a YouTube video URL.");
      return;
    }

    if (!isYouTubeUrl(url)) {
      toast.error("Please enter a valid YouTube video URL.");
      return;
    }

    try {
      setLoading(true);
      setSummary("");

      const res = await getSummary(url);

      setSummary(res?.data?.summary);
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.detail ||
          "Unable to generate summary."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearSummary = () => {
    setSummary("");
  };

  const handleClearAll = () => {
    setSummary("");
    setUrl("");
  };

  return (
    <main className="min-h-screen w-full bg-gray-50">
      
      <Navbar/>
      {/* Main */}

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Summarize Any YouTube Video
          </h1>

          <p className="text-gray-500">
            Get instant summaries, notes,
            quizzes and more from any
            YouTube video.
          </p>
        </div>

        {/* Input */}

        <form
          onSubmit={handleSummarize}
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm mb-3"
        >
          <span className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <Link2 className="w-4.5 h-4.5 text-violet-600" />
          </span>

          <input
            type="text"
            value={url}
            disabled={loading}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className="flex-1 min-w-0 text-sm text-gray-700 placeholder-gray-400 focus:outline-none disabled:bg-white"
          />

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition shrink-0 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Summarize
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mb-14">
          YouTube URL :{" "}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-violet-600 hover:underline break-all"
          >
            {url === "" ? "No URL provided" : url}
          </a>
        </p>

        {/* Loading */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle className="w-14 h-14 text-violet-600 animate-spin mb-6" />

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Extracting Summary...
            </h2>

            <p className="text-gray-500 text-center max-w-md">
              Fetching transcript, analyzing
              content and generating your AI
              summary.
            </p>
          </div>
        )}

        {/* Summary */}

        {!loading && summary && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Video Summary
              </h2>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleClearSummary}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
                >
                  <Eraser className="w-4 h-4" />
                  Clear Summary
                </button>

                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
              {summary}
            </div>
          </div>
        )}

        {!loading && !summary && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              What would you like to do?
            </h2>

            <ActionCard />
          </>
        )}
      </div>
    </main>
  );
}
import {LoaderCircle } from "lucide-react";

export default function Loader({ loading }) {
  return (
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
  )
}
import {Play,User} from "lucide-react";

export function Navbar() {
  return (
    <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center">
          <Play className="w-4 h-4 text-white fill-white" />
        </span>

        <div className="leading-tight">
          <p className="text-base font-semibold text-gray-900">
            Tube <span className="text-violet-600">GPT</span>
          </p>

          <p className="text-xs text-gray-400">
            Summarizer
          </p>
        </div>
      </div>

      <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition">
        <User className="w-4 h-4" />
      </button>
    </div>
  )
}
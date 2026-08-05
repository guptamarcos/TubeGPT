import {FileText,BookOpen ,ListChecks,MessageCircle,HelpCircle, Download } from "lucide-react";

const actions = [
  {
    title: "Summary",
    description: "Get concise summary of the video",
    icon: FileText,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
  {
    title: "Key Points",
    description: "Extract key takeaways and highlights",
    icon: ListChecks,
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  {
    title: "Chat with Video",
    description: "Ask questions and get answers from the video",
    icon: MessageCircle,
    bg: "bg-sky-100",
    color: "text-sky-600",
  },
  {
    title: "Generate Quiz",
    description: "Create quiz questions from the video",
    icon: HelpCircle,
    bg: "bg-amber-100",
    color: "text-amber-600",
  },
  {
    title: "Flashcards",
    description: "Generate flashcards for better learning",
    icon: BookOpen,
    bg: "bg-pink-100",
    color: "text-pink-600",
  },
  {
    title: "Export Notes",
    description: "Export notes as PDF, Markdown or Text",
    icon: Download,
    bg: "bg-violet-100",
    color: "text-violet-600",
  },
];

export function ActionCard() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map(({ title, description, icon: Icon, bg, color }) => (
        <button
          key={title}
          className="flex flex-col items-center text-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-6 hover:border-violet-300 hover:shadow-sm transition cursor-pointer"
        >
          <span
            className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
};

export default ActionCard;
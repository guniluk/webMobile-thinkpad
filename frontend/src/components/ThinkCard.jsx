import { useNavigate } from "react-router";
import { Edit2, Trash2, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { getPaletteForId } from "../lib/colors";

const ThinkCard = ({ note, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const palette = getPaletteForId(note._id);

  const targetDate = note.updatedAt || note.createdAt;
  const formattedDate = targetDate
    ? new Date(targetDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const handleCardClick = () => {
    navigate(`/note/${note._id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(note);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card ${palette.bgGradient} border border-base-300/80 shadow-md hover:shadow-xl ${palette.borderHover} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden relative rounded-3xl backdrop-blur-xs`}
    >
      {/* Top subtle decorative accent bar */}
      <div
        className={`h-1.5 w-full bg-linear-to-r ${palette.glowColor}`}
      />

      <div className="card-body p-6 flex-1 flex flex-col">
        {/* Date & Action Badges */}
        <div className="flex items-center justify-between text-xs text-base-content/60 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-base-content/50" />
            <span>{formattedDate}</span>
          </div>
          <span
            className={`badge badge-sm ${palette.badgeClass} font-semibold transition-transform group-hover:scale-105 gap-1`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            Think
          </span>
        </div>

        {/* Title */}
        <h2 className="card-title text-lg md:text-xl font-bold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
          {note.title}
        </h2>

        {/* Content Preview */}
        <p className="text-base-content/75 text-sm mt-2 line-clamp-4 whitespace-pre-wrap leading-relaxed flex-1">
          {note.content}
        </p>

        {/* Card Footer with Edit, Delete & Detail actions */}
        <div className="card-actions justify-between items-center mt-5 pt-3.5 border-t border-base-200/80">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="btn btn-ghost btn-xs md:btn-sm btn-circle text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={handleEditClick}
              title="수정하기"
              aria-label="수정하기"
            >
              <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs md:btn-sm btn-circle text-base-content/70 hover:text-error hover:bg-error/10 transition-colors"
              onClick={handleDeleteClick}
              title="삭제하기"
              aria-label="삭제하기"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          <span
            className={`text-xs font-bold ${palette.accentColor} flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`}
          >
            자세히 보기 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThinkCard;

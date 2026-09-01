import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeft, PlusCircle, Sparkles, X, PenTool } from "lucide-react";
import { noteApi } from "../lib/api";

const CreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await noteApi.create({
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("새 Think가 성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-base-100 via-primary/5 to-base-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="btn btn-ghost btn-sm sm:btn-md gap-2 rounded-2xl text-base-content/75 hover:text-base-content hover:bg-base-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Form Card with stylish gradient & glow */}
        <div className="card bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 border border-primary/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
          {/* Top Decorative Gradient Line */}
          <div className="h-2 w-full bg-linear-to-r from-primary via-secondary to-accent" />

          <form onSubmit={handleSubmit} className="card-body p-6 sm:p-10 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-base-200/80">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                    새 Think 작성
                  </h1>
                  <span className="badge badge-primary badge-sm font-semibold gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> New
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
                  떠오른 아이디어와 생각을 아름답게 기록해보세요.
                </p>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="label font-bold text-base-content text-sm sm:text-base">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="input input-bordered input-primary w-full text-base sm:text-lg font-medium rounded-2xl bg-base-100/80 shadow-xs focus:ring-2 focus:ring-primary/20"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="label font-bold text-base-content text-sm sm:text-base">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="어떤 생각을 기록하고 싶으신가요? 내용을 작성해보세요..."
                className="textarea textarea-bordered textarea-primary w-full h-64 text-base leading-relaxed rounded-2xl bg-base-100/80 shadow-xs resize-y focus:ring-2 focus:ring-primary/20"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end gap-3 pt-5 border-t border-base-200/80">
              <button
                type="button"
                className="btn btn-ghost btn-sm sm:btn-md gap-1.5 rounded-xl"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
                <span>취소</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md gap-2 rounded-xl shadow-md hover:shadow-lg"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                <span>작성 완료</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

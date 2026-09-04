import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeft, PlusCircle, Sparkles, X, PenTool } from "lucide-react";
import { noteApi } from "../lib/api";
import RateLimitedUI from "../components/RateLimitedUI";

const CreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
      } else {
        toast.error(error.message || "생성에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRateLimited) {
    return <RateLimitedUI onRetry={handleSubmit} message={rateLimitMessage} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-base-100 via-primary/5 to-base-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="gap-2 btn btn-ghost btn-sm sm:btn-md rounded-2xl text-base-content/75 hover:text-base-content hover:bg-base-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Form Card with stylish gradient & glow */}
        <div className="overflow-hidden border shadow-2xl card bg-linear-to-br from-base-100 via-primary/5 to-secondary/5 border-primary/20 rounded-3xl backdrop-blur-md">
          {/* Top Decorative Gradient Line */}
          <div className="w-full h-2 bg-linear-to-r from-primary via-secondary to-accent" />

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 card-body sm:p-10"
          >
            {/* Header */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-base-200/80">
              <div className="p-3 shadow-inner bg-primary/10 text-primary rounded-2xl">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl text-base-content">
                    새 Think 작성
                  </h1>
                  <span className="gap-1 font-semibold badge badge-primary badge-sm">
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
              <label className="text-sm font-bold label text-base-content sm:text-base">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full text-base font-medium shadow-xs input input-bordered input-primary sm:text-lg rounded-2xl bg-base-100/80 focus:ring-2 focus:ring-primary/20"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="text-sm font-bold label text-base-content sm:text-base">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="어떤 생각을 기록하고 싶으신가요? 내용을 작성해보세요..."
                className="w-full h-64 text-base leading-relaxed shadow-xs resize-y textarea textarea-bordered textarea-primary rounded-2xl bg-base-100/80 focus:ring-2 focus:ring-primary/20"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="justify-end gap-3 pt-5 border-t card-actions border-base-200/80">
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
                className="gap-2 shadow-md btn btn-primary btn-sm sm:btn-md rounded-xl hover:shadow-lg"
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

import { Link } from "react-router";
import { Home, AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200/50 flex items-center justify-center p-4">
      <div className="card bg-base-100 border border-base-200 shadow-xl max-w-md w-full text-center p-8 rounded-3xl">
        <div className="mx-auto w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-base-content mb-2">404</h1>
        <h2 className="text-lg font-bold text-base-content/80 mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-sm text-base-content/60 mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          to="/"
          className="btn btn-primary gap-2 mx-auto rounded-xl shadow-md"
        >
          <Home className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

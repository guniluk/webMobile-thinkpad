import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ShieldAlert, RefreshCw, Home, AlertCircle, Clock, ZapOff } from "lucide-react";

const RateLimitedUI = ({ onRetry, message, autoRetrySeconds = 30 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(autoRetrySeconds);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRetryClick = async () => {
    if (!onRetry || isRetrying) return;
    try {
      setIsRetrying(true);
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    if (location.pathname === "/") {
      if (onRetry) {
        handleRetryClick();
      } else {
        window.location.reload();
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-linear-to-b from-base-100 via-base-200/50 to-base-200">
      <div className="card bg-base-100 max-w-xl w-full border border-warning/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
        {/* Top Warning Glow Bar */}
        <div className="h-2 w-full bg-linear-to-r from-warning via-error to-warning animate-pulse" />

        <div className="card-body p-6 sm:p-10 text-center items-center">
          {/* Animated Icon Badge */}
          <div className="relative mb-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-warning/10 text-warning rounded-3xl flex items-center justify-center shadow-inner ring-8 ring-warning/5 animate-bounce">
              <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-error text-error-content p-1.5 rounded-full shadow-md">
              <ZapOff className="w-4 h-4" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="badge badge-warning badge-outline gap-1.5 font-bold uppercase tracking-wider py-3 px-3.5 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>429 Too Many Requests</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            요청 한도 초과 (Rate Limit)
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-base-content/70 mt-2 leading-relaxed max-w-md">
            {message ||
              "단시간에 너무 많은 요청이 발생하여 서버 보호를 위해 일시적으로 접근이 제한되었습니다."}
          </p>

          {/* Countdown & Info Card */}
          <div className="w-full bg-base-200/70 border border-base-300 rounded-2xl p-4 my-6 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-base-content/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span>재시도 대기 시간</span>
              </div>
              <span className="badge badge-neutral font-mono font-bold">
                {timeLeft > 0 ? `${timeLeft}초 후 권장` : "지금 재시도 가능"}
              </span>
            </div>

            {/* Progress bar */}
            <progress
              className="progress progress-warning w-full h-2"
              value={autoRetrySeconds - timeLeft}
              max={autoRetrySeconds}
            />

            <p className="text-xs text-base-content/60 leading-normal">
              💡 <strong>안내:</strong> 백엔드 Upstash Redis Rate Limiter 정책에 따라 분당 요청 수가 제한됩니다. 잠시 후 재시도 버튼을 눌러주세요.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            {onRetry && (
              <button
                type="button"
                onClick={handleRetryClick}
                disabled={isRetrying}
                className="btn btn-warning w-full sm:w-auto gap-2 rounded-xl shadow-md hover:shadow-lg font-semibold"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                />
                <span>{isRetrying ? "다시 시도 중..." : "다시 시도하기"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleGoHome}
              className="btn btn-ghost border-base-300 w-full sm:w-auto gap-2 rounded-xl text-base-content/80 hover:bg-base-200"
            >
              <Home className="w-4 h-4" />
              <span>홈으로 이동</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;

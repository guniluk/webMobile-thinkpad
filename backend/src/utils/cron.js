/**
 * Render Free Tier의 비활성 슬립(15분)을 방지하기 위해
 * 14분(840,000ms)마다 자동으로 /api/health 엔드포인트를 호출하는 Keep-Alive 서비스입니다.
 */
export const startKeepAlive = () => {
  // Render 배포 환경에서는 RENDER_EXTERNAL_URL 환경변수(예: https://xxx.onrender.com)가 자동 제공됩니다.
  const serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

  if (!serverUrl) {
    console.log(
      "ℹ️ [Keep-Alive] RENDER_EXTERNAL_URL / SERVER_URL이 설정되지 않아 로컬 환경에서는 자동 핑을 실행하지 않습니다.",
    );
    return;
  }

  const pingUrl = `${serverUrl.replace(/\/+$/, "")}/api/health`;
  const FOURTEEN_MINUTES = 14 * 60 * 1000; // 14분

  console.log(
    `⏰ [Keep-Alive] 서비스가 시작되었습니다. 14분마다 [${pingUrl}]로 자동 헬스체크 요청을 보냅니다.`,
  );

  const timer = setInterval(async () => {
    try {
      const response = await fetch(pingUrl);
      if (response.ok) {
        console.log(
          `🟢 [Keep-Alive] 자동 헬스체크 성공 (상태 코드: ${response.status}) - ${new Date().toLocaleTimeString("ko-KR")}`,
        );
      } else {
        console.warn(
          `🟡 [Keep-Alive] 헬스체크 응답 이상 (상태 코드: ${response.status})`,
        );
      }
    } catch (error) {
      console.error(`🔴 [Keep-Alive] 헬스체크 요청 실패:`, error.message);
    }
  }, FOURTEEN_MINUTES);

  if (timer.unref) {
    timer.unref();
  }
};

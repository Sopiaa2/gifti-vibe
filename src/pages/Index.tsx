import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[480px] mx-auto flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2">
          <span
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #7C3AED, #A855F7)" }}
          >
            온도
          </span>
          <span className="text-3xl" aria-hidden>🌡️</span>
        </div>

        {/* Slogan */}
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-3">
          콘텐츠의 온도를<br />팬이 정한다
        </h1>
        <p className="text-sm text-muted-foreground mb-12 leading-relaxed">
          좋아하는 유튜버에게 기프티콘으로<br />따뜻한 응원을 전해보세요
        </p>

        {/* Warm visual accent */}
        <div
          className="w-32 h-32 rounded-full mb-12 flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
            boxShadow: "0 20px 50px -12px rgba(124, 58, 237, 0.45)",
          }}
        >
          <span className="text-6xl" aria-hidden>💝</span>
        </div>

        {/* CTAs */}
        <div className="w-full space-y-3">
          <Button
            className="w-full h-14 text-base font-semibold rounded-2xl text-white border-0 shadow-md hover:opacity-95 transition-opacity"
            style={{
              background: "linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)",
              boxShadow: "0 10px 25px -8px rgba(124, 58, 237, 0.5)",
            }}
          >
            좋아하는 유튜버 응원하기 →
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 text-base font-semibold rounded-2xl bg-white hover:bg-muted/40 transition-colors"
            style={{ borderColor: "#7C3AED", color: "#7C3AED" }}
          >
            내 채널 등록하기
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          ondo.lovable.app
        </p>
      </div>
    </main>
  );
}

'use client'

import { Button } from '@/components/ui/button';
import { red } from 'next/dist/lib/picocolors';
import Link from 'next/link';
import { useEffect, useState } from 'react'

export default function Page() {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; duration: string; color: string }>>([])
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: string; top: string; delay: string }>>([])

  useEffect(() => {
    // Tạo confetti
    const colors = ['#00D9FF', '#FF00FF', '#00FF88', '#FFD700', '#FF0055']
    const newConfetti = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 0.8 + 's',
      duration: Math.random() * 2 + 3 + 's',
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setConfetti(newConfetti)

    // Tạo sparkles
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      delay: Math.random() * 2 + 's',
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Background grid effect */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating sparkles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {sparkles.map((sparkle) => (
          <div
            key={`sparkle-${sparkle.id}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              background: "#00D9FF",
              boxShadow: "0 0 10px #00D9FF",
              animation: `twinkle 3s ease-in-out ${sparkle.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {confetti.map((item) => (
          <div
            key={`confetti-${item.id}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: item.left,
              top: "-10px",
              background: item.color,
              boxShadow: `0 0 8px ${item.color}`,
              animation: `fall ${item.duration} linear ${item.delay} forwards`,
            }}
          />
        ))}
      </div>

      {/* Main Content - min-w-0 để flex không kéo rộng, chữ không bị cắt */}
      {/* <div className="text-center z-20 px-4 relative w-full max-w-3xl mx-auto min-w-0">
        {/* Glow background */}
      {/* <div className="absolute inset-0 -z-10 blur-3xl opacity-50">
          <div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
            style={{
              animation: "pulse-glow 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Birthday Cake */}
      {/*<div
          className="mb-8 relative z-10"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <div
            className="text-6xl sm:text-7xl md:text-9xl"
            style={{ animation: "spin 6s linear infinite" }}
          >
            🎂
          </div>
        </div>
        </div> */}

      {/* Main Text - nằm giữa, 1 hàng, giữ màu/animation neon */}
      {/* <div className="text-center flex justify-center ml-5">
          <h1
            className=" relative z-30 font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 leading-tight px-2 whitespace-nowrap"
            style={{
              fontSize: "clamp(0.95rem, calc((100vw - 1.5rem) / 14), 4.5rem)",
              animation:
                "title-glow 3s ease-in-out infinite, slide-down 0.8s ease-out",
              textShadow: "0 0 8px rgba(0, 217, 255, 0.3)",
            }}
          >
            CHÚC MỪNG SINH NHẬT!
          </h1>
        </div>

        <p
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
          style={{
            animation:
              "fade-in-up 1s ease-out 0.3s both, pulse-text 2s ease-in-out 0.5s infinite",
            textShadow: "0 0 25px rgba(255, 0, 85, 0.6)",
          }}
        >
          Đinh Thị Khánh Linh
          <br />
          30/04/2005
        </p>

        <p
          className="text-lg sm:text-xl md:text-2xl font-semibold mb-10"
          style={{
            color: "#00D9FF",
            animation:
              "fade-in-up 1s ease-out 0.4s both, pulse-text 2s ease-in-out 0.6s infinite",
            textShadow: "0 0 20px rgba(0, 217, 255, 0.6)",
          }}
        >
          Hôm nay là ngày đặc biệt của bạn
        </p>

        {/* Animated Balloons */}
      {/* <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[0, 0.1, 0.2, 0.3, 0.4].map((delay) => (
            <div
              key={delay}
              className="text-4xl sm:text-5xl md:text-6xl"
              style={{
                animation: `float 4s ease-in-out infinite, sway 3s ease-in-out ${delay}s infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              🎈
            </div>
          ))}
        </div>

        {/* Message Box */}
      {/* <div
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl mb-10 w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto backdrop-blur-sm"
          style={{
            animation:
              "slide-up 0.8s ease-out 0.5s both, glow-border 3s ease-in-out infinite 1s",
            boxShadow: "0 0 30px rgba(0, 217, 255, 0.3)",
          }}
        >
          <p className="text-lg leading-relaxed" style={{ color: "#E0E0E0" }}>
            Chúc bạn có một ngày tuyệt vời, đầy vui vẻ và hạnh phúc! <br />
            <br />
            Hy vọng tất cả những điều tốt đẹp nhất sẽ đến với bạn. <br />
            <br />
            <span
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400"
              style={{
                textShadow: "0 0 20px rgba(255, 0, 85, 0.5)",
              }}
            >
              Sinh nhật vui vẻ! 🎉
            </span>
          </p>
        </div>

        {/* Animated Party Elements */}
      {/* <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-3xl sm:text-4xl md:text-6xl">
          {["🎊", "🎉", "🎁", "🎉", "🎊"].map((emoji, i) => (
            <span
              key={i}
              style={{
                animation: `bounce-pulse 0.6s ease-in-out ${i * 0.1}s infinite, rotate 4s linear infinite`,
                display: "inline-block",
                textShadow: "0 0 20px rgba(255, 0, 85, 0.6)",
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div> */}
      <div className="h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center z-20 px-4 relative w-full max-w-3xl mx-auto min-w-0 flex flex-col justify-center h-full">
          {/* Glow background */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>

          {/* Birthday Cake */}
          <div
            className="mb-4"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <div
              className="text-5xl sm:text-6xl md:text-7xl"
              style={{ animation: "spin 6s linear infinite" }}
            >
              🎂
            </div>
          </div>

          {/* Main Text */}
          <div className="flex justify-center">
            <h1
              className="font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 leading-tight px-2"
              style={{
                fontSize: "clamp(1.2rem, 5vw, 3rem)",
                animation:
                  "title-glow 3s ease-in-out infinite, slide-down 0.8s ease-out",
              }}
            >
              CHÚC MỪNG SINH NHẬT!
            </h1>
          </div>

          {/* Name */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Đinh Thị Khánh Linh
            <br />
            30/04/2005
          </p>

          {/* Sub text */}
          <p className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-cyan-400">
            Hôm nay là ngày đặc biệt của Em!
          </p>

          {/* Balloons */}
          <div className="flex justify-center gap-3 mb-4 text-3xl sm:text-4xl">
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay) => (
              <div
                key={delay}
                style={{
                  animation: `float 4s ease-in-out infinite, sway 3s ease-in-out ${delay}s infinite`,
                }}
              >
                🎈
              </div>
            ))}
          </div>

          {/* Message Box */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500 rounded-2xl p-4 shadow-lg mb-4 max-w-xl mx-auto">
            <p className="text-sm sm:text-base leading-relaxed text-gray-200">
              Chúc có một ngày sinh nhật thật tuyệt vời!
              <br />
              <br />
              Hy vọng tất cả những điều tốt đẹp nhất sẽ đến với Em!              <br />
              <br />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                Sinh nhật vui vẻ! 🎉
              </span>
            </p>
            {/* Button link to page kl */}
            <div className="flex justify-center items-center mt-10">
              <Button
                asChild
                className="relative overflow-hidden px-6 py-3 text-white font-semibold text-lg rounded-2xl 
  bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400
  shadow-lg hover:scale-105 transition-all duration-300">
                <Link href="/kl" className="flex items-center gap-2">
                  🎉 Bấm vào đây! 🎂
                  {/* hiệu ứng sparkle */}
                  <span className="absolute inset-0 bg-white opacity-10 blur-xl animate-pulse"></span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer icons */}
          <div className="flex justify-center gap-4 text-2xl sm:text-3xl">
            {["🎊", "🎉", "🎁", "🎉", "🎊"].map((emoji, i) => (
              <span
                key={i}
                style={{
                  animation: `bounce-pulse 0.6s ease-in-out ${i * 0.1}s infinite`,
                }}
              >
                {emoji}
              </span>
            ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) translateX(100px);
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        @keyframes spin {
          from {
            transform: rotateZ(0deg);
          }
          to {
            transform: rotateZ(360deg);
          }
        }

        @keyframes title-glow {
          0%,
          100% {
            opacity: 1;
            text-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
          }
          50% {
            opacity: 0.94;
            text-shadow: 0 0 14px rgba(255, 0, 85, 0.35);
          }
        }

        @keyframes pulse-text {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-pulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotateZ(0deg);
          }
          to {
            transform: rotateZ(360deg);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }

        @keyframes glow-border {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(0, 217, 255, 0.3),
              inset 0 0 20px rgba(0, 217, 255, 0.1);
          }
          50% {
            box-shadow:
              0 0 40px rgba(255, 0, 85, 0.4),
              inset 0 0 20px rgba(255, 0, 85, 0.1);
          }
        }
      `}</style>
    </div>
</div>
  );
}

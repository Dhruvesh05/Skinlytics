import { motion } from "motion/react";

export function Hero({ onAnalyzeClick }: { onAnalyzeClick: () => void }) {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-20 md:px-16">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1767360963892-3353defd6584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Minimal skincare"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-slate-950/75 to-black" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.14),transparent_45%)]" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-4xl space-y-8 text-center"
      >
        <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100/90 backdrop-blur-xl">
          AI-Powered Skincare Intelligence
        </p>
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
          Skinlytix
        </h1>
        <p className="mx-auto max-w-3xl bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-2xl text-transparent md:text-4xl">
          Intelligent skincare, personalized by AI
        </p>
        <p className="mx-auto max-w-xl text-lg text-gray-300">
          Analyze your skin and discover ingredients tailored to you
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAnalyzeClick}
          className="mt-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95"
        >
          Analyze My Skin
        </motion.button>
      </motion.div>
    </section>
  );
}

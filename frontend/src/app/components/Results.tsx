import { motion } from "motion/react";

interface ResultsProps {
  ingredient: string;
  cluster: string;
  confidence: number;
}

export function Results({ ingredient, cluster, confidence }: ResultsProps) {
  const safeConfidence = Math.min(100, Math.max(0, confidence));

  return (
    <section className="px-6 py-20 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-black/30 px-6 py-12 shadow-2xl backdrop-blur-xl md:px-10"
      >
        <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
          Your Personalized Results
        </h2>
        <p className="mx-auto mb-14 max-w-2xl text-center text-lg text-gray-400">
          A targeted recommendation built from your skin profile, sensitivity, and concern pattern.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
          >
            <p className="mb-3 text-sm uppercase tracking-wider text-gray-400">
              Recommended Ingredient
            </p>
            <h3 className="mb-4 text-3xl font-semibold text-white">{ingredient}</h3>
            <p className="leading-relaxed text-gray-300">
              AI-selected active ingredient optimized for your unique skin profile
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
          >
            <p className="mb-3 text-sm uppercase tracking-wider text-gray-400">
              Skin Profile
            </p>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2 text-white shadow-lg shadow-emerald-900/30">
              <span>{cluster}</span>
            </div>
            <p className="leading-relaxed text-gray-300">
              Your skin falls into this scientifically-backed profile cluster
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 via-white/5 to-teal-500/10 p-8 shadow-xl shadow-emerald-900/20 backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/25"
          >
            <p className="mb-3 text-sm uppercase tracking-wider text-gray-300">
              Confidence Score
            </p>
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold text-white">{safeConfidence}</span>
                <span className="text-2xl text-gray-300">%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${safeConfidence}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                />
              </div>
            </div>
            <p className="leading-relaxed text-gray-300">
              ML model prediction accuracy for this recommendation
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

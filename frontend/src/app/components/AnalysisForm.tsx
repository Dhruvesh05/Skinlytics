import { motion } from "motion/react";
import { useState } from "react";

interface AnalysisFormProps {
  onSubmit: (data: {
    skinType: string;
    sensitivity: string;
    concern: string;
  }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function AnalysisForm({ onSubmit, isLoading = false, error }: AnalysisFormProps) {
  const [skinType, setSkinType] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [concern, setConcern] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skinType && sensitivity && concern) {
      onSubmit({ skinType, sensitivity, concern });
    }
  };

  return (
    <section className="px-6 py-20 md:px-16" id="analysis">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl md:p-12">
          <h2 className="text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
            Your Skin Profile
          </h2>
          <p className="mb-10 mt-3 text-center text-lg text-gray-400">
            Help us understand your unique skin needs
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-base text-gray-100">Skin Type</label>
              <div className="grid grid-cols-2 gap-3">
                {["Oily", "Dry", "Combination", "Normal"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSkinType(type)}
                    className={`rounded-2xl border px-6 py-4 transition-all duration-300 ease-in-out hover:-translate-y-1 ${
                      skinType === type
                        ? "border-emerald-300/60 bg-gradient-to-br from-emerald-500/70 to-teal-500/70 text-white shadow-lg shadow-emerald-900/30"
                        : "border-white/15 bg-white/5 text-gray-100 hover:border-emerald-300/40 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-base text-gray-100">Sensitivity Level</label>
              <div className="grid grid-cols-3 gap-3">
                {["Low", "Medium", "High"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSensitivity(level)}
                    className={`rounded-2xl border px-6 py-4 transition-all duration-300 ease-in-out hover:-translate-y-1 ${
                      sensitivity === level
                        ? "border-emerald-300/60 bg-gradient-to-br from-emerald-500/70 to-teal-500/70 text-white shadow-lg shadow-emerald-900/30"
                        : "border-white/15 bg-white/5 text-gray-100 hover:border-emerald-300/40 hover:bg-white/10"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-base text-gray-100">Primary Skin Concern</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Acne",
                  "Dark Spots",
                  "Fine Lines",
                  "Redness",
                  "Dullness",
                  "Large Pores",
                ].map((concernOption) => (
                  <button
                    key={concernOption}
                    type="button"
                    onClick={() => setConcern(concernOption)}
                    className={`rounded-2xl border px-6 py-4 transition-all duration-300 ease-in-out hover:-translate-y-1 ${
                      concern === concernOption
                        ? "border-emerald-300/60 bg-gradient-to-br from-emerald-500/70 to-teal-500/70 text-white shadow-lg shadow-emerald-900/30"
                        : "border-white/15 bg-white/5 text-gray-100 hover:border-emerald-300/40 hover:bg-white/10"
                    }`}
                  >
                    {concernOption}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!skinType || !sensitivity || !concern || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                "Get Recommendation"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

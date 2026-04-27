import { motion } from "motion/react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";

const dataPoints = [
  { name: "Niacinamide", value: 94 },
  { name: "Retinol", value: 87 },
  { name: "Vitamin C", value: 82 },
  { name: "Hyaluronic", value: 79 },
  { name: "Peptides", value: 71 },
];

const insights = [
  {
    metric: "Skin Compatibility",
    value: "98%",
    description: "Based on your profile analysis",
  },
  {
    metric: "Ingredient Efficacy",
    value: "94%",
    description: "Clinical study success rate",
  },
  {
    metric: "Profile Matches",
    value: "2,847",
    description: "Similar users in our database",
  },
];

export function Insights() {
  return (
    <section className="px-6 py-20 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
          Data-Driven Insights
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
          Advanced analytics powering your personalized recommendations
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {insights.map((insight, index) => {
            const gradients = [
              "from-emerald-500/20 via-white/5 to-teal-500/20 border-emerald-300/20",
              "from-orange-500/20 via-white/5 to-amber-400/20 border-orange-300/20",
              "from-indigo-500/20 via-white/5 to-cyan-400/20 border-indigo-300/20"
            ];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl border bg-gradient-to-br ${gradients[index]} p-8 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl`}
              >
                <p className="mb-2 text-sm uppercase tracking-wider text-gray-300">
                  {insight.metric}
                </p>
                <p className="mb-2 text-4xl font-semibold text-white">{insight.value}</p>
                <p className="text-sm text-gray-300">{insight.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl md:p-10"
        >
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">
            Performance Overview
          </p>
          <h3 className="mb-8 text-3xl font-semibold text-white">
            Ingredient Match Scores
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPoints} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#D1D5DB", fontSize: 14 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#D1D5DB", fontSize: 14 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {dataPoints.map((entry, index) => {
                  const colors = ["#34D399", "#14B8A6", "#60A5FA", "#A78BFA", "#F59E0B"];
                  return (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={colors[index]}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </section>
  );
}

import { motion } from "motion/react";
import { generateRoutine } from "../../utils/routineGenerator";

interface RoutineBuilderProps {
  skinType?: string;
  sensitivity?: string;
  concern?: string;
  ingredients?: string;
}

export function RoutineBuilder({ skinType, sensitivity, concern, ingredients }: RoutineBuilderProps) {
  const routine = generateRoutine({
    skinType: skinType ?? "Normal",
    concern: concern ?? "Acne",
    sensitivity: sensitivity ?? "Low",
    ingredients: ingredients ?? "",
  });

  const routineSteps = [
    { time: "AM", steps: routine.AM },
    { time: "PM", steps: routine.PM },
  ];
  
  return (
    <section className="px-6 py-20 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl"
      >
        <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
          Your Daily Routine
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
          A science-backed skincare routine tailored to your profile
        </p>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {routineSteps.map((routine, routineIndex) => (
            <motion.div
              key={routine.time}
              initial={{ opacity: 0, x: routineIndex === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${
                  routine.time === "AM"
                    ? "bg-gradient-to-br from-amber-300 to-orange-500"
                    : "bg-gradient-to-br from-indigo-400 to-teal-500"
                }`}>
                  {routine.time}
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {routine.time === "AM" ? "Morning" : "Evening"} Routine
                </h3>
              </div>

              <div className="space-y-4">
                {routine.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + stepIndex * 0.1 }}
                    className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-all duration-300 ease-in-out hover:-translate-y-1"
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm text-white transition-all duration-300 ${
                      routineIndex === 0
                        ? "border-amber-300/40 bg-amber-400/20 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-amber-300 group-hover:to-orange-500"
                        : "border-teal-300/40 bg-teal-400/20 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-indigo-400 group-hover:to-teal-500"
                    }`}>
                      {stepIndex + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="mb-1 text-white">{step.step}</p>
                      <div className="h-px w-full bg-white/10" />
                      <p className="mt-2 text-sm text-gray-400">{step.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

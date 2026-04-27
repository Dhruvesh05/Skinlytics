export type RoutineSkinType = "Oily" | "Dry" | "Combination" | "Normal";
export type RoutineConcern =
  | "Acne"
  | "Dark Spots"
  | "Redness"
  | "Dullness"
  | "Fine Lines"
  | "Large Pores";
export type RoutineSensitivity = "Low" | "Medium" | "High";

export interface RoutineInput {
  skinType: RoutineSkinType | string;
  concern: RoutineConcern | string;
  sensitivity: RoutineSensitivity | string;
  ingredients: string;
}

export interface RoutineStep {
  title: string;
  step: string;
  duration: string;
  note: string;
}

type RoutineTime = "AM" | "PM";

interface InternalRoutineStep extends RoutineStep {
  priority: number;
  order: number;
}

interface RoutinePlan {
  AM: InternalRoutineStep[];
  PM: InternalRoutineStep[];
}

const MAX_STEPS_PER_ROUTINE = 5;

const BANNED_TERMS = ["retinol", "strong exfoliation", "daily aha", "aha", "aha daily", "salicylic acid > 2%"];

const SOOTHING_TERMS = ["aloe", "centella", "ceramide"];

function normalize(value: string | undefined | null): string {
  return (value ?? "").trim().toLowerCase();
}

function includesTerm(source: string, term: string): boolean {
  return normalize(source).includes(normalize(term));
}

function createPlan(): RoutinePlan {
  return { AM: [], PM: [] };
}

function addStep(
  plan: RoutinePlan,
  time: RoutineTime,
  step: string,
  note: string,
  priority: number
): void {
  const normalizedStep = normalize(step);

  if (plan[time].some((item) => normalize(item.step) === normalizedStep)) {
    return;
  }

  plan[time].push({
    step,
    note,
    priority,
    order: plan[time].length,
  });
}

function addBaseRoutine(plan: RoutinePlan): void {
  addStep(plan, "AM", "Cleanser", "Removes overnight buildup and prepares skin.", 10);
  addStep(plan, "AM", "Moisturizer", "Supports hydration and barrier function.", 40);
  addStep(plan, "AM", "Sunscreen", "Protects skin from UV damage.", 50);

  addStep(plan, "PM", "Cleanser", "Removes sunscreen, oil, and daily debris.", 10);
  addStep(plan, "PM", "Moisturizer", "Seals in hydration overnight.", 40);
}

function addSkinTypePersonalization(plan: RoutinePlan, skinType: string): void {
  const normalizedSkinType = normalize(skinType);

  if (normalizedSkinType === "oily") {
    addStep(plan, "AM", "Oil Control Treatment", "Helps reduce excess sebum and shine.", 20);
  }

  if (normalizedSkinType === "dry") {
    addStep(plan, "AM", "Hydration Serum", "Adds extra hydration before moisturizer.", 20);
    addStep(plan, "PM", "Hydration Serum", "Replenishes moisture overnight.", 20);
    addStep(plan, "PM", "Ceramide Repair Cream", "Supports the barrier with rich repair lipids.", 35);
  }

  if (normalizedSkinType === "combination") {
    addStep(plan, "AM", "Balancing Serum", "Keeps the routine lightweight and balanced.", 20);
    addStep(plan, "PM", "Balancing Treatment", "Supports oily and dry zones without overloading skin.", 20);
  }
}

function addConcernPersonalization(plan: RoutinePlan, concern: string, skinType: string): void {
  const normalizedConcern = normalize(concern);
  const normalizedSkinType = normalize(skinType);

  if (normalizedConcern === "acne") {
    if (normalizedSkinType === "oily") {
      addStep(plan, "PM", "Salicylic Acid / BHA (PM)", "Targets breakouts and clogged pores at night.", 25);
    }

    addStep(plan, "AM", "Niacinamide", "Supports oil control and barrier balance.", 20);
    return;
  }

  if (normalizedConcern === "redness") {
    addStep(plan, "AM", "Soothing Toner", "Helps calm visible redness.", 15);
    addStep(plan, "PM", "Centella Serum", "Prioritizes calming recovery overnight.", 20);
    return;
  }

  if (normalizedConcern === "dark spots") {
    addStep(plan, "AM", "Vitamin C (AM)", "Brightens and helps fade uneven tone.", 15);
    return;
  }

  if (normalizedConcern === "dullness") {
    addStep(plan, "PM", "Gentle Exfoliation (2-3x/week)", "Supports brightness without daily irritation.", 25);
    return;
  }

  if (normalizedConcern === "fine lines") {
    addStep(plan, "PM", "Retinol (PM)", "Supports overnight renewal and texture improvement.", 25);
    return;
  }

  if (normalizedConcern === "large pores") {
    addStep(plan, "AM", "Niacinamide", "Helps refine the look of pores.", 15);
  }
}

function addIngredientPersonalization(plan: RoutinePlan, ingredients: string, sensitivity: string): void {
  const normalizedIngredients = normalize(ingredients);
  const highSensitivity = normalize(sensitivity) === "high";

  if (highSensitivity) {
    if (SOOTHING_TERMS.some((term) => normalizedIngredients.includes(term))) {
      addStep(plan, "AM", "Soothing Gel", "Keeps the routine calming and low-irritation.", 18);
      addStep(plan, "PM", "Barrier Repair Cream", "Supports skin recovery overnight.", 35);
    } else {
      addStep(plan, "AM", "Barrier Cream", "Focuses on barrier support for sensitive skin.", 18);
      addStep(plan, "PM", "Barrier Repair Cream", "Supports skin recovery overnight.", 35);
    }

    return;
  }

  if (normalizedIngredients.includes("salicylic")) {
    addStep(plan, "PM", "Salicylic Acid / BHA (PM)", "Ingredient-led exfoliation for acne-prone skin.", 25);
  }

  if (normalizedIngredients.includes("niacinamide")) {
    addStep(plan, "AM", "Niacinamide", "Supports oil control and barrier balance.", 15);
    addStep(plan, "PM", "Niacinamide", "Keeps treatment support in the evening.", 15);
  }

  if (normalizedIngredients.includes("hyaluronic acid")) {
    addStep(plan, "AM", "Hyaluronic Acid Serum", "Boosts moisture retention before sunscreen.", 20);
    addStep(plan, "PM", "Hyaluronic Acid Serum", "Restores hydration overnight.", 20);
  }

  if (normalizedIngredients.includes("retinol")) {
    addStep(plan, "PM", "Retinol (PM)", "Night-only renewal support.", 25);
  }

  if (normalizedIngredients.includes("vitamin c")) {
    addStep(plan, "AM", "Vitamin C (AM)", "Best used in the morning for antioxidant protection.", 15);
  }

  if (normalizedIngredients.includes("aloe") || normalizedIngredients.includes("centella")) {
    addStep(plan, "AM", "Aloe Soothing Gel", "Calms skin in the morning routine.", 15);
    addStep(plan, "PM", "Calming Gel", "Adds a soothing finish at night.", 15);
  }
}

function applySafetyOverrides(plan: RoutinePlan, skinType: string, concern: string, sensitivity: string): void {
  const normalizedSkinType = normalize(skinType);
  const normalizedConcern = normalize(concern);
  const normalizedSensitivity = normalize(sensitivity);

  if (normalizedSensitivity === "high") {
    plan.AM = plan.AM.filter((item) => !/(retinol|bha|salicylic acid|exfoliation|acid)/i.test(item.step));
    plan.PM = plan.PM.filter((item) => !/(retinol|bha|salicylic acid|exfoliation|acid)/i.test(item.step));

    addStep(plan, "AM", "Centella Serum", "Calms reactive skin and reduces irritation.", 16);
    addStep(plan, "PM", "Ceramide Repair Cream", "Reinforces the barrier overnight.", 34);
  }

  if (normalizedConcern === "redness") {
    plan.AM = plan.AM.filter((item) => !/(retinol|acid|exfoliation|bha)/i.test(item.step));
    plan.PM = plan.PM.filter((item) => !/(retinol|acid|exfoliation|bha)/i.test(item.step));
    addStep(plan, "AM", "Calming Toner", "Prioritizes redness relief and comfort.", 14);
    addStep(plan, "PM", "Barrier Cream", "Helps restore comfort without harsh actives.", 34);
  }

  if (normalizedSkinType === "dry") {
    plan.AM = plan.AM.filter((item) => !/exfoliation/i.test(item.step));
    plan.PM = plan.PM.filter((item) => !/exfoliation/i.test(item.step));
    addStep(plan, "AM", "Hyaluronic Acid Serum", "Adds moisture before moisturizer.", 20);
    addStep(plan, "PM", "Ceramide Repair Cream", "Locks in hydration and supports the barrier.", 34);
  }

  if (normalizedSkinType === "oily" && normalizedConcern === "acne") {
    addStep(plan, "PM", "Niacinamide", "Balances oil and supports acne control.", 22);
    addStep(plan, "PM", "Salicylic Acid / BHA (PM)", "Allows PM exfoliation for acne-prone oily skin.", 25);
  }
}

function validatePlan(plan: RoutinePlan): void {
  const bannedPattern = new RegExp(BANNED_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");

  plan.AM = plan.AM.filter((item) => !bannedPattern.test(item.step));
  plan.PM = plan.PM.filter((item) => !bannedPattern.test(item.step));

  const dedupe = (items: InternalRoutineStep[]): InternalRoutineStep[] => {
    const seen = new Set<string>();

    return items.filter((item) => {
      const key = normalize(item.step);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  plan.AM = dedupe(plan.AM).slice(0, MAX_STEPS_PER_ROUTINE);
  plan.PM = dedupe(plan.PM).slice(0, MAX_STEPS_PER_ROUTINE);
}

function toRoutineSteps(items: InternalRoutineStep[]): RoutineStep[] {
  return items
    .sort((a, b) => a.priority - b.priority || a.order - b.order)
    .map(({ step, note }) => ({
      title: step,
      step,
      duration: "~1 min",
      note,
    }));
}

function finalize(plan: RoutinePlan): {
  morning: RoutineStep[];
  evening: RoutineStep[];
  AM: RoutineStep[];
  PM: RoutineStep[];
} {
  validatePlan(plan);

  const morning = toRoutineSteps(plan.AM).slice(0, MAX_STEPS_PER_ROUTINE);
  const evening = toRoutineSteps(plan.PM).slice(0, MAX_STEPS_PER_ROUTINE);

  return {
    morning,
    evening,
    AM: morning,
    PM: evening,
  };
}

export function generateRoutine({ skinType, concern, sensitivity, ingredients }: RoutineInput): {
  morning: RoutineStep[];
  evening: RoutineStep[];
  AM: RoutineStep[];
  PM: RoutineStep[];
} {
  const plan = createPlan();

  addBaseRoutine(plan);
  addSkinTypePersonalization(plan, skinType);
  addConcernPersonalization(plan, concern, skinType);
  addIngredientPersonalization(plan, ingredients, sensitivity);
  applySafetyOverrides(plan, skinType, concern, sensitivity);
  validatePlan(plan);

  return finalize(plan);
}

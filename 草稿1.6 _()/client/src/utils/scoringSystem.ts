export function calculateDiagnosisScore(score: number) {
  return score;
}

export function calculateToolUsageScore(count: number) {
  return Math.min(100, count * 10);
}

export function calculateQuestionScore(count: number) {
  return Math.min(100, count * 5);
}

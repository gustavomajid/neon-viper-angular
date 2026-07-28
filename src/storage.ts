const BEST_SCORE_KEY = "neon-viper-best-score";

export function loadBestScore(
  storage: Pick<Storage, "getItem"> = localStorage,
): number {
  try {
    const value = Number.parseInt(storage.getItem(BEST_SCORE_KEY) ?? "0", 10);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(
  score: number,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  try {
    storage.setItem(BEST_SCORE_KEY, String(Math.max(0, Math.floor(score))));
  } catch {
    // Storage can be unavailable in privacy modes; gameplay should still work.
  }
}

export function clearBestScore(
  storage: Pick<Storage, "removeItem"> = localStorage,
): void {
  try {
    storage.removeItem(BEST_SCORE_KEY);
  } catch {
    // Ignore storage failures and reset the in-memory score.
  }
}

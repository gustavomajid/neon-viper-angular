import { describe, expect, it, vi } from "vitest";
import { clearBestScore, loadBestScore, saveBestScore } from "./storage";

describe("best score persistence", () => {
  it("loads a valid saved score", () => {
    expect(loadBestScore({ getItem: () => "120" })).toBe(120);
  });

  it("falls back to zero for invalid or unavailable storage", () => {
    expect(loadBestScore({ getItem: () => "not-a-score" })).toBe(0);
    expect(
      loadBestScore({
        getItem: () => {
          throw new Error("blocked");
        },
      }),
    ).toBe(0);
  });

  it("saves a normalized score", () => {
    const setItem = vi.fn();
    saveBestScore(42.9, { setItem });
    expect(setItem).toHaveBeenCalledWith("neon-viper-best-score", "42");
  });

  it("clears the stored best score", () => {
    const removeItem = vi.fn();
    clearBestScore({ removeItem });
    expect(removeItem).toHaveBeenCalledWith("neon-viper-best-score");
  });
});

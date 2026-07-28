import { describe, expect, it } from "vitest";
import {
  BOARD_SIZE,
  MINIMUM_SPEED,
  POINTS_PER_FOOD,
  createInitialState,
  getSpeed,
  isSelfCollision,
  placeFood,
  queueDirection,
  stepGame,
  type GameState,
  type Point,
} from "./game";

function playingState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...createInitialState(() => 0),
    status: "playing",
    ...overrides,
  };
}

describe("snake movement", () => {
  it.each([
    ["up", { x: 10, y: 9 }],
    ["down", { x: 10, y: 11 }],
    ["left", { x: 9, y: 10 }],
    ["right", { x: 11, y: 10 }],
  ] as const)("moves %s", (direction, expected) => {
    const state = playingState({
      direction,
      snake: [{ x: 10, y: 10 }],
      food: { x: 0, y: 0 },
    });
    expect(stepGame(state).state.snake[0]).toEqual(expected);
  });

  it("rejects an immediate reverse turn", () => {
    const state = playingState({ direction: "right" });
    expect(queueDirection(state, "left")).toBe(state);
  });

  it("buffers legal rapid turns and caps the queue", () => {
    let state = playingState({ direction: "right" });
    state = queueDirection(state, "up");
    state = queueDirection(state, "left");
    state = queueDirection(state, "down");
    expect(state.queuedDirections).toEqual(["up", "left"]);
  });
});

describe("scoring and collisions", () => {
  it("grows the snake and updates the score after eating", () => {
    const state = playingState({ food: { x: 11, y: 10 } });
    const result = stepGame(state, () => 0);
    expect(result.ateFood).toBe(true);
    expect(result.state.snake).toHaveLength(4);
    expect(result.state.score).toBe(POINTS_PER_FOOD);
  });

  it("ends the game on wall collision", () => {
    const state = playingState({
      snake: [{ x: BOARD_SIZE - 1, y: 4 }],
      direction: "right",
    });
    expect(stepGame(state).state.status).toBe("gameover");
  });

  it("ends the game on bottom-wall collision", () => {
    const state = playingState({
      snake: [{ x: 12, y: BOARD_SIZE - 1 }],
      direction: "down",
      food: { x: 0, y: 0 },
    });
    expect(stepGame(state).state.status).toBe("gameover");
  });

  it("ends the game on self collision", () => {
    const snake: Point[] = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
    ];
    const state = playingState({ snake, direction: "down" });
    expect(stepGame(state).state.status).toBe("gameover");
    expect(isSelfCollision({ x: 2, y: 3 }, snake.slice(1))).toBe(true);
  });

  it("allows moving into the cell vacated by the tail", () => {
    const state = playingState({
      snake: [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 1, y: 2 },
      ],
      direction: "left",
      food: { x: 8, y: 8 },
    });
    expect(stepGame(state).state.status).toBe("playing");
  });
});

describe("food and speed", () => {
  it("never places food on the snake", () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    for (const random of [0, 0.2, 0.5, 0.999]) {
      expect(snake).not.toContainEqual(placeFood(snake, () => random));
    }
  });

  it("accelerates as score rises and respects the cap", () => {
    expect(getSpeed(20)).toBeLessThan(getSpeed(0));
    expect(getSpeed(100_000)).toBe(MINIMUM_SPEED);
  });
});

describe("restart behavior", () => {
  it("creates a fresh initial state", () => {
    const restarted = createInitialState(() => 0);
    expect(restarted.score).toBe(0);
    expect(restarted.status).toBe("idle");
    expect(restarted.snake).toHaveLength(3);
    expect(restarted.queuedDirections).toEqual([]);
  });
});

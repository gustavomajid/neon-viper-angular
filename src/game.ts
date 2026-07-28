export const BOARD_SIZE = 20;
export const STARTING_SPEED = 145;
export const MINIMUM_SPEED = 64;
export const SPEED_STEP = 7;
export const POINTS_PER_FOOD = 10;

export type Direction = "up" | "down" | "left" | "right";
export type GameStatus = "idle" | "countdown" | "playing" | "paused" | "gameover";

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  queuedDirections: Direction[];
  score: number;
  status: GameStatus;
}

export interface StepResult {
  state: GameState;
  ateFood: boolean;
}

export const directionVectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposites: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isOpposite(a: Direction, b: Direction): boolean {
  return opposites[a] === b;
}

export function createInitialState(random: () => number = Math.random): GameState {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  return {
    snake,
    food: placeFood(snake, random),
    direction: "right",
    queuedDirections: [],
    score: 0,
    status: "idle",
  };
}

export function queueDirection(state: GameState, next: Direction): GameState {
  if (state.status !== "playing") return state;

  const lastDirection =
    state.queuedDirections[state.queuedDirections.length - 1] ?? state.direction;
  if (next === lastDirection || isOpposite(lastDirection, next)) return state;
  if (state.queuedDirections.length >= 2) return state;

  return {
    ...state,
    queuedDirections: [...state.queuedDirections, next],
  };
}

export function placeFood(snake: Point[], random: () => number = Math.random): Point {
  const openCells: Point[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const point = { x, y };
      if (!snake.some((segment) => pointsEqual(segment, point))) {
        openCells.push(point);
      }
    }
  }

  if (openCells.length === 0) return { x: -1, y: -1 };
  const index = Math.min(Math.floor(random() * openCells.length), openCells.length - 1);
  return openCells[index] ?? openCells[0]!;
}

export function isWallCollision(point: Point): boolean {
  return point.x < 0 || point.y < 0 || point.x >= BOARD_SIZE || point.y >= BOARD_SIZE;
}

export function isSelfCollision(head: Point, body: Point[]): boolean {
  return body.some((segment) => pointsEqual(head, segment));
}

export function getSpeed(score: number): number {
  const level = Math.floor(score / (POINTS_PER_FOOD * 2));
  return Math.max(MINIMUM_SPEED, STARTING_SPEED - level * SPEED_STEP);
}

export function stepGame(
  state: GameState,
  random: () => number = Math.random,
): StepResult {
  if (state.status !== "playing") return { state, ateFood: false };

  const [queuedDirection, ...remainingQueue] = state.queuedDirections;
  const direction = queuedDirection ?? state.direction;
  const vector = directionVectors[direction];
  const currentHead = state.snake[0]!;
  const newHead = {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };
  const ateFood = pointsEqual(newHead, state.food);
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);

  if (isWallCollision(newHead) || isSelfCollision(newHead, collisionBody)) {
    return {
      ateFood: false,
      state: {
        ...state,
        direction,
        queuedDirections: [],
        status: "gameover",
      },
    };
  }

  const snake = [newHead, ...state.snake];
  if (!ateFood) snake.pop();

  return {
    ateFood,
    state: {
      ...state,
      snake,
      food: ateFood ? placeFood(snake, random) : state.food,
      direction,
      queuedDirections: remainingQueue,
      score: ateFood ? state.score + POINTS_PER_FOOD : state.score,
    },
  };
}

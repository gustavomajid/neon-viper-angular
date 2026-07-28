import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
  signal,
} from "@angular/core";
import {
  BOARD_SIZE,
  createInitialState,
  getSpeed,
  pointsEqual,
  queueDirection,
  stepGame,
  type Direction,
  type GameState,
} from "../game";
import { clearBestScore, loadBestScore, saveBestScore } from "../storage";

const KEY_DIRECTIONS: Readonly<Record<string, Direction | undefined>> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  readonly game = signal<GameState>(createInitialState());
  readonly bestScore = signal(0);
  readonly countdown = signal(3);
  readonly isNewBest = signal(false);
  readonly confirmReset = signal(false);
  readonly cells = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => ({
    x: index % BOARD_SIZE,
    y: Math.floor(index / BOARD_SIZE),
  }));

  readonly headRotation = computed(
    () =>
      ({ right: 0, down: 90, left: 180, up: 270 })[this.game().direction] ?? 0,
  );

  readonly stateLabel = computed(() => {
    switch (this.game().status) {
      case "playing":
        return "In motion";
      case "paused":
        return "Paused";
      case "gameover":
        return "Run ended";
      case "countdown":
        return "Get ready";
      default:
        return "Ready";
    }
  });

  private countdownTimer?: ReturnType<typeof setInterval>;
  private touchStart?: { x: number; y: number };

  constructor() {
    effect((onCleanup) => {
      const current = this.game();
      if (current.status !== "playing") return;

      const timer = setTimeout(() => {
        const result = stepGame(this.game());
        const next = result.state;

        if (next.score > this.bestScore()) {
          this.bestScore.set(next.score);
          saveBestScore(next.score);
          this.isNewBest.set(true);
        }

        this.game.set(next);
      }, getSpeed(current.score));

      onCleanup(() => clearTimeout(timer));
    });
  }

  ngOnInit(): void {
    this.bestScore.set(loadBestScore());
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  startGame(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.isNewBest.set(false);
    this.confirmReset.set(false);
    this.countdown.set(3);
    this.game.set({ ...createInitialState(), status: "countdown" });

    this.countdownTimer = setInterval(() => {
      const value = this.countdown();
      if (value <= 1) {
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        this.countdownTimer = undefined;
        this.countdown.set(0);
        this.game.update((current) => ({ ...current, status: "playing" }));
      } else {
        this.countdown.set(value - 1);
      }
    }, 650);
  }

  togglePause(): void {
    this.game.update((current) => {
      if (current.status === "playing") return { ...current, status: "paused" };
      if (current.status === "paused") return { ...current, status: "playing" };
      return current;
    });
  }

  changeDirection(direction: Direction): void {
    this.game.update((current) => queueDirection(current, direction));
  }

  resetBestScore(): void {
    clearBestScore();
    this.bestScore.set(0);
    this.isNewBest.set(false);
    this.confirmReset.set(false);
  }

  cellClass(cell: { x: number; y: number }): string {
    const current = this.game();
    const segmentIndex = current.snake.findIndex((segment) =>
      pointsEqual(segment, cell),
    );
    const classes = ["board-cell"];

    if (segmentIndex === 0) classes.push("snake", "snake--head");
    else if (segmentIndex > 0) classes.push("snake", "snake--body");
    if (pointsEqual(current.food, cell)) classes.push("food");

    return classes.join(" ");
  }

  scoreText(score: number): string {
    return String(score).padStart(3, "0");
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent): void {
    const direction = KEY_DIRECTIONS[event.code];
    if (direction) {
      event.preventDefault();
      this.changeDirection(direction);
      return;
    }

    if (event.code === "Space" || event.code === "KeyP") {
      event.preventDefault();
      const status = this.game().status;
      if (status === "idle" || status === "gameover") this.startGame();
      else this.togglePause();
    }
  }

  @HostListener("document:visibilitychange")
  handleVisibilityChange(): void {
    if (!document.hidden) return;
    this.game.update((current) =>
      current.status === "playing" ? { ...current, status: "paused" } : current,
    );
  }

  handleTouchStart(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    if (touch) this.touchStart = { x: touch.clientX, y: touch.clientY };
  }

  handleTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    if (!touch || !this.touchStart) return;

    const x = touch.clientX - this.touchStart.x;
    const y = touch.clientY - this.touchStart.y;
    this.touchStart = undefined;
    if (Math.max(Math.abs(x), Math.abs(y)) < 24) return;

    this.changeDirection(
      Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : y > 0 ? "down" : "up",
    );
  }
}

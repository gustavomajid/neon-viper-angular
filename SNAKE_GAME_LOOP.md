# Codex Build Loop: Polished Angular Snake Game

## Mission

Build a complete, polished Snake game using Angular and TypeScript.
Work autonomously in an implementation-and-verification loop until the game
meets every requirement below.

Do not stop after producing a basic prototype. Create a game that feels
responsive, looks intentional, works on desktop and mobile, and is ready to
run locally.

## Build loop

Repeat this cycle until all acceptance criteria pass:

1. Inspect the existing project and preserve working conventions.
2. Choose the smallest useful implementation milestone.
3. Implement that milestone.
4. Run formatting, linting, type checking, tests, and a production build.
5. Launch the game and inspect the actual rendered result.
6. Test the affected gameplay manually.
7. Fix errors, regressions, visual problems, and weak interactions.
8. Review the diff and compare the result against every acceptance criterion.
9. Continue with the next milestone.

If browser automation or screenshots are available, use them to test the real
interface at desktop and mobile sizes. Check the browser console for errors.

Continue without asking for approval for ordinary implementation decisions.
Stop only when:

- all acceptance criteria pass; or
- a genuine blocker requires credentials, unavailable software, or a product
  decision that cannot be inferred safely.

When blocked, explain the exact blocker, what was attempted, and the smallest
decision or action needed from the user.

## Technical foundation

- Use Angular standalone components with TypeScript.
- Use Angular Signals for local reactive state.
- Use the current Angular application builder.
- Keep gameplay logic separate from presentation components.
- Prefer a clean, maintainable component structure over one large component.
- Avoid unnecessary dependencies.
- Do not use a backend; save local preferences and the high score in
  `localStorage`.
- Make the game deterministic enough for its core logic to be unit tested.
- Use semantic HTML and accessible controls.

If starting from an empty directory, scaffold an Angular standalone application
first and add suitable scripts for development, type checking, testing, linting,
and production builds.

## Core gameplay

Implement all of the following:

- A snake moving on a fixed grid.
- Arrow-key and WASD controls.
- Food that never spawns on the snake.
- Snake growth after eating food.
- A score that increases when food is eaten.
- Increasing speed as the score rises, capped at a fair maximum speed.
- Collision with walls and the snake's own body.
- Start, pause, resume, restart, and game-over states.
- A short countdown before a new game starts.
- Prevention of an immediate 180-degree turn.
- Reliable input buffering so rapid turns feel responsive without allowing
  illegal movement.
- A visible current score and persistent best score.
- Best-score storage in `localStorage`.
- A clear way to reset the best score, with confirmation.

## Mobile and input support

- Add touch-friendly on-screen directional controls.
- Support swipe gestures on the game board.
- Prevent gameplay gestures and keys from scrolling the page unexpectedly.
- Make controls large enough to use comfortably on a phone.
- Pause automatically when the page loses visibility, when appropriate.

## Visual direction

Create a premium arcade aesthetic rather than a generic tutorial layout.

- Use a dark, atmospheric background with restrained gradients and subtle
  texture.
- Give the game board strong visual hierarchy and a crisp grid.
- Use a distinctive snake treatment with a clearly recognizable head.
- Make food visually prominent and appealing.
- Use one vibrant accent palette consistently.
- Use expressive typography with sensible fallbacks.
- Add polished states for hover, focus, active, disabled, pause, and game over.
- Use subtle motion for food, score changes, overlays, and transitions.
- Keep animations performant and honor `prefers-reduced-motion`.
- Avoid excessive glow, visual noise, or animation that harms readability.
- Ensure sufficient contrast and do not communicate state by color alone.

The layout should look composed at approximately 1440px, 768px, and 390px
viewport widths. The entire game must remain usable without horizontal
overflow.

## Interface

Include:

- A concise game title and one-line instruction.
- Current score and best score.
- The game board as the primary focal point.
- Start/pause/resume and restart controls.
- Keyboard-control hints on desktop.
- Touch controls on devices where they are useful.
- A pause overlay.
- A polished game-over overlay showing the score, best score, and restart
  action.
- A tasteful indication when a new best score is achieved.
- A small sound toggle if sound effects are implemented.

Keep supporting text brief. The screen should feel like a game, not a settings
dashboard.

## Sound

Sound is optional, but if included:

- Use subtle effects for eating food, game over, and a new high score.
- Provide an obvious mute control.
- Default to a respectful volume.
- Do not require external media services.
- Do not autoplay intrusive audio.

## Code quality

- Model game state explicitly.
- Keep movement, collision, food placement, speed calculation, and scoring
  logic in testable functions.
- Clean up timers, event listeners, and reactive effects correctly.
- Avoid stale closures and multiple concurrent game loops.
- Add comments only where behavior is not obvious from the code.
- Do not leave placeholder content, dead code, TODOs, debug logs, or known
  warnings.

## Tests

At minimum, test:

- movement in each direction;
- rejection of illegal reverse movement;
- snake growth and score updates;
- wall collision;
- self-collision;
- food placement outside the snake;
- speed progression and its cap;
- best-score persistence behavior; and
- restart/reset behavior.

Also perform manual gameplay checks:

- keyboard play;
- pause and resume;
- rapid direction changes;
- game over and restart;
- best-score updates;
- page refresh persistence;
- touch controls or emulation;
- narrow mobile layout; and
- reduced-motion behavior.

## Acceptance criteria

The task is complete only when:

- the development command starts the game successfully;
- the production build succeeds;
- linting, type checking, and automated tests pass;
- there are no runtime errors or relevant console warnings;
- the complete game is playable with keyboard and touch controls;
- score and persistent best score work correctly;
- all game states and controls work reliably;
- the interface is responsive and visually polished;
- focus states and keyboard navigation are usable;
- reduced-motion preferences are respected;
- the final diff contains no accidental files or unrelated changes; and
- the README explains setup, commands, controls, and gameplay briefly.

## Final review loop

Before reporting completion:

1. Play several full rounds.
2. Deliberately test wall and self collisions.
3. Test fast alternating input.
4. Verify pause does not create duplicate timers.
5. Verify restart completely resets transient state.
6. Verify the best score survives a reload.
7. Inspect desktop and mobile screenshots.
8. Improve any area that still looks like an unfinished starter template.
9. Run the full validation suite one final time.
10. Review the final diff for bugs, regressions, accessibility problems, and
    unnecessary complexity.

## Completion report

When finished, provide:

- a concise summary of what was built;
- the main files created or changed;
- the commands used to validate the project;
- the final test, type-check, lint, and build results;
- a short description of manual gameplay and responsive checks; and
- any remaining limitation, only if one genuinely remains.

Do not claim a check passed unless it was actually run.

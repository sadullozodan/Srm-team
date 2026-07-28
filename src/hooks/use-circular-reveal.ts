"use client";

import { useCallback, useRef } from "react";

/**
 * Circular-bubble theme reveal.
 *
 * 1. Capture old theme background + button center.
 * 2. Switch theme instantly (new palette paints behind).
 * 3. Overlay covers screen with OLD background.
 * 4. mask-image creates a transparent hole at center that GROWS outward,
 *    revealing the new UI underneath like a bubble opening from the button.
 * 5. Remove overlay when done.
 */
export function useCircularReveal(switchTheme: () => void) {
  const running = useRef(false);

  const trigger = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (running.current) return;
      running.current = true;

      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const maxR =
        Math.hypot(
          Math.max(cx, window.innerWidth - cx),
          Math.max(cy, window.innerHeight - cy),
        ) + 40;

      const isDark = document.documentElement.classList.contains("dark");
      const oldBg = isDark ? "#0d0f16" : "#f2f4f5";

      // Switch theme — new palette paints behind the overlay
      switchTheme();

      // Overlay with OLD background, mask makes a growing transparent hole
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:99999;pointer-events:none;
        background:${oldBg};
        -webkit-mask-image:radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, transparent 0px, black 1px);
        mask-image:radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, transparent 0px, black 1px);
      `;
      document.body.appendChild(overlay);

      const duration = 500;
      const start = performance.now();

      function tick(now: number) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const r = ease * maxR;
        const grad = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, transparent ${r}px, black ${r + 1}px)`;
        overlay.style.maskImage = grad;
        overlay.style.webkitMaskImage = grad;

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          overlay.remove();
          running.current = false;
        }
      }

      requestAnimationFrame(tick);
    },
    [switchTheme],
  );

  return trigger;
}

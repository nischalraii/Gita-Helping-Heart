import { useEffect } from "react";

/**
 * Adds the `in` class to `.reveal` elements as they scroll into view, including
 * elements mounted after the first render (e.g. filtered activity cards).
 * Elements already visible (or when IO is unsupported) are shown immediately.
 */
export function useReveal(): void {
  useEffect(() => {
    const supported = "IntersectionObserver" in window;

    const io = supported
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("in");
                io?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
        )
      : null;

    const reveal = (el: HTMLElement): void => {
      if (io) {
        io.observe(el);
        return;
      }
      el.classList.add("in");
    };

    document.querySelectorAll<HTMLElement>(".reveal").forEach(reveal);

    // Catch `.reveal` nodes mounted after the first render, such as cards in a
    // filtered grid.
    const mo = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }
          if (node.classList.contains("reveal")) {
            reveal(node);
          }
          node.querySelectorAll<HTMLElement>(".reveal").forEach(reveal);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, []);
}

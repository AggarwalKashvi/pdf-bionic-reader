export function enableBionicTextLayer(container) {
  if (!container) return;

  const apply = () => {
    const spans = container.querySelectorAll("span");

    spans.forEach(span => {
      // Prevent re-processing
      if (span.dataset.bionicApplied === "true") return;

      const text = span.textContent;
      if (!text || text.length < 3) return;
      if (!/[a-zA-Z]/.test(text)) return;

      const cut = Math.ceil(text.length * 0.5);
      span.innerHTML =
        `<strong>${text.slice(0, cut)}</strong>${text.slice(cut)}`;

      span.dataset.bionicApplied = "true";
    });
  };

  // 1️⃣ Apply immediately (if spans already exist)
  apply();

  // 2️⃣ Re-apply whenever PDF.js mutates the layer
  const observer = new MutationObserver(() => {
    apply();
  });

  observer.observe(container, {
    childList: true,
    subtree: true
  });
}

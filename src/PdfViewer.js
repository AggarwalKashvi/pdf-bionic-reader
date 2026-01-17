import * as pdfjsLib from "pdfjs-dist";

console.log("PdfViewer.js loaded");

// ✅ Stable worker via CDN
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export async function renderPDF(file, container) {
  console.log("renderPDF called");
  container.innerHTML = "";

  const pdf = await pdfjsLib.getDocument(
    await file.arrayBuffer()
  ).promise;

  console.log("Total pages:", pdf.numPages);

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    console.log("Rendering page", pageNum);

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.4 });

    // ---- Page wrapper ----
    const pageDiv = document.createElement("div");
    pageDiv.className = "page";
    pageDiv.style.position = "relative";
    pageDiv.style.margin = "24px auto";
    pageDiv.style.width = `${viewport.width}px`;

    // ---- Canvas (PDF visuals) ----
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    pageDiv.appendChild(canvas);
    container.appendChild(pageDiv);

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    // ---- Text layer ----
    const textLayerDiv = document.createElement("div");
    textLayerDiv.className = "textLayer";
    pageDiv.appendChild(textLayerDiv);

    const textContent = await page.getTextContent();

    pdfjsLib.renderTextLayer({
      textContent,
      container: textLayerDiv,
      viewport,
      textDivs: []
    });

    // ---- Bionic Reading (per word) ----
    requestAnimationFrame(() => {
      const spans = textLayerDiv.querySelectorAll("span");

      spans.forEach(span => {
        const text = span.textContent;
        if (!text || !/[a-zA-Z]/.test(text)) return;

        const words = text.split(/(\s+)/); // keep spaces

        const bionicText = words
          .map(word => {
            // Skip spaces
            if (!/[a-zA-Z]/.test(word)) return word;

            const strength = window.__NEUROFLOW__?.getBionicStrength?.() ?? 0.4;
            const cut = Math.ceil(word.length * strength);
            return `<strong>${word.slice(0, cut)}</strong>${word.slice(cut)}`;
          })
          .join("");

        span.innerHTML = bionicText;
      });
    });
  }
}

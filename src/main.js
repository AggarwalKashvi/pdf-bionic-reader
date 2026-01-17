import { renderPDF } from "./PdfViewer.js";

console.log("main.js loaded");

const input = document.getElementById("pdfInput");
const viewer = document.getElementById("viewer");

input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log("PDF selected:", file.name);
    renderPDF(file, viewer);
  }
});

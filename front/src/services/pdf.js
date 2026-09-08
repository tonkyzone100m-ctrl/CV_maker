export async function downloadCVAsPDF(
  element,
  fileName = "my-cv.pdf"
) {
  if (!element) {
    throw new Error("CV preview element was not found.");
  }

  // Load html2pdf only when the user actually downloads the CV.
  const { default: html2pdf } = await import("html2pdf.js");

  const options = {
    margin: 0,

    filename: fileName,

    image: {
      type: "jpeg",
      quality: 0.98,
    },

    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },

    pagebreak: {
      mode: ["css", "legacy"],
    },
  };

  await html2pdf()
    .set(options)
    .from(element)
    .save();
}
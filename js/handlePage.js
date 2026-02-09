export const showPage = (pageId) => {
  document
    .querySelectorAll("section")
    .forEach((section) => (section.style.display = "none"));

  const page = document.getElementById(pageId);

  if (page.classList.contains("quiz-select-page")) {
    page.style.display = "flex";
  } else {
    page.style.display = "block";
  }
};

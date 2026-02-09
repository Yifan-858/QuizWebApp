import { showPage } from "./handlePage.js";
import { renderQuizCard } from "./handleRender.js";

const deleteQuizPage = document.getElementById("delete-quiz-page");
const deleteQuizContainer = document.createElement("div");
deleteQuizPage.appendChild(deleteQuizContainer);

const renderDeleteQuizList = (quizzes) => {
  deleteQuizContainer.innerHTML = "";

  quizzes.forEach((quiz) => {
    const quizRow = document.createElement("div");
    quizRow.classList.add("admin-quiz-row");

    const title = document.createElement("p");
    title.textContent = quiz.Title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteQuiz(quiz.id, quizzes));

    quizRow.appendChild(title);
    quizRow.appendChild(deleteBtn);
    deleteQuizContainer.appendChild(quizRow);
  });
};

const deleteQuiz = (quizId, quizzes) => {
  const confirmed = confirm("Are you sure you want to delete this quiz?");
  if (!confirmed) return;

  quizzes = quizzes.filter((q) => q.id !== quizId);

  //save
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  renderQuizCard(quizzes);
  renderDeleteQuizList(quizzes);
};

export const handleDeleteQuiz = (quizzes) => {
  showPage("delete-quiz-page");
  renderDeleteQuizList(quizzes);
};

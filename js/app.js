import { renderQuizCard } from "./handleRenderQuizFlow.js";
import { showPage } from "./handlePage.js";
import { handleDeleteQuiz } from "./handleDelete.js";
import { handleLoginClick, loginContainer } from "./handleAdmin.js";
import {
  quizAddSubmit,
  addQuizForm,
  renderUpdateQuizList,
  updateQuizContainer,
} from "./handleAddUpdate.js";

let quizzes = [];

const homeTitle = document.getElementById("home-title");
homeTitle.addEventListener("click", () => showPage("quiz-select-page"));

//----------------------Load Quiz Data---------------------//
const loadQuiz = async () => {
  try {
    const responses = await Promise.all([
      fetch("data/quizData1.json"),
      fetch("data/quizData2.json"),
    ]);

    const data = await Promise.all(responses.map((res) => res.json()));

    quizzes = data.map((quiz, index) => {
      return {
        ...quiz,
        id: `${index + 1}`,
      };
    });

    if (!localStorage.getItem("quizzes")) {
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
    }

    renderQuizCard(quizzes);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
  }
};

showPage("admin-page");
loadQuiz();

//----------------------Handle Admin Interface---------------------//
const submitBtn = document.createElement("button");
submitBtn.classList.add("submit-btn");
submitBtn.textContent = "Login";
submitBtn.type = "button";
submitBtn.addEventListener("click", () => handleLoginClick());
loginContainer.appendChild(submitBtn);

const adminPage = document.getElementById("admin-page");

const actionCotainer = document.createElement("div");
actionCotainer.classList.add("action-container");
adminPage.appendChild(actionCotainer);

const actionLabel = document.createElement("h4");
actionLabel.textContent = "Quiz Action";
actionLabel.classList.add("action-lable");
actionCotainer.appendChild(actionLabel);

//Add UI

const handleAddQuiz = () => {
  showPage("add-quiz-page");
};

const addQuizBtn = document.createElement("button");
addQuizBtn.textContent = "Add";
addQuizBtn.addEventListener("click", () => handleAddQuiz());
actionCotainer.appendChild(addQuizBtn);

//Update UI

const handleUpdateQuiz = () => {
  showPage("update-quiz-page");
  updateQuizContainer.innerHTML = "";
  renderUpdateQuizList();
};

const updateQuizBtn = document.createElement("button");
updateQuizBtn.textContent = "Update";
updateQuizBtn.addEventListener("click", () => handleUpdateQuiz(quizzes));
actionCotainer.appendChild(updateQuizBtn);

//Delete UI

const deleteQuizBtn = document.createElement("button");
deleteQuizBtn.textContent = "Delete";
deleteQuizBtn.addEventListener("click", () => handleDeleteQuiz(quizzes));
actionCotainer.appendChild(deleteQuizBtn);

//Action Submit button//
export const quizSubmitBtn = document.createElement("button");
quizSubmitBtn.textContent = "Submit Quiz";
quizSubmitBtn.classList.add("quiz-submit-button");

quizSubmitBtn.addEventListener("click", (e) => quizAddSubmit(e, quizzes));
addQuizForm.appendChild(quizSubmitBtn);

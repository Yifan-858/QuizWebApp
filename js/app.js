import { renderQuizCard } from "./handleRender.js";
import { showPage } from "./handlePage.js";
import { handleDeleteQuiz } from "./handleDelete.js";
import { handleLoginClick, loginContainer } from "./handleAdmin.js";

let quizzes = [];
let editingQuizId = null;

const homeTitle = document.getElementById("home-title");
homeTitle.addEventListener("click", () => showPage("quiz-select-page"));

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

//-Add//
const handleAddQuiz = () => {
  showPage("add-quiz-page");
};

const addQuizBtn = document.createElement("button");
addQuizBtn.textContent = "Add";
addQuizBtn.addEventListener("click", () => handleAddQuiz());
actionCotainer.appendChild(addQuizBtn);

const addQuizPage = document.getElementById("add-quiz-page");

const addQuizForm = document.createElement("div");
addQuizForm.classList.add("add-quiz-form");
addQuizPage.appendChild(addQuizForm);

const titleLabel = document.createElement("p");
titleLabel.textContent = "Quiz Title";
addQuizForm.appendChild(titleLabel);

const titleInput = document.createElement("input");
titleInput.type = "text";
addQuizForm.appendChild(titleInput);

const questionsContainer = document.createElement("div");
questionsContainer.classList.add("questions-container");
addQuizForm.appendChild(questionsContainer);

const createQuestionForm = () => {
  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question-form");

  const qLabel = document.createElement("p");
  qLabel.textContent = "Question:";
  questionContainer.appendChild(qLabel);

  const qInput = document.createElement("input");
  qInput.type = "text";
  qInput.placeholder = "Enter question text";
  questionContainer.appendChild(qInput);

  const answersContainer = document.createElement("div");
  answersContainer.classList.add("answers-container");

  for (let i = 0; i < 4; i++) {
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.placeholder = `Answer ${i + 1}`;
    answerInput.classList.add("answer-input");
    answersContainer.appendChild(answerInput);
  }

  questionContainer.appendChild(answersContainer);

  const correctLabel = document.createElement("p");
  correctLabel.textContent = "Correct answer (1-4):";
  questionContainer.appendChild(correctLabel);

  const correctInput = document.createElement("input");
  correctInput.type = "number";
  correctInput.min = 1;
  correctInput.max = 4;
  correctInput.placeholder = "Correct answer number";
  questionContainer.appendChild(correctInput);

  questionsContainer.appendChild(questionContainer);
};

const addQuestionBtn = document.createElement("button");
addQuestionBtn.textContent = "Add Question";
addQuestionBtn.addEventListener("click", () => createQuestionForm());
addQuizForm.appendChild(addQuestionBtn);

const quizSubmitBtn = document.createElement("button");
quizSubmitBtn.textContent = "Submit Quiz";
quizSubmitBtn.classList.add("quiz-submit-button");
quizSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    alert("Quiz must have a title");
    return;
  }

  const questionForms = questionsContainer.querySelectorAll(".question-form");
  if (questionForms.length === 0) {
    alert("Add at least one question");
    return;
  }

  const questions = [];

  questionForms.forEach((qForm, qIndex) => {
    const qInput = qForm.querySelector("input[type=text]");
    const answerInputs = qForm.querySelectorAll(".answer-input");
    const correctInput = qForm.querySelector("input[type=number]");

    const statement = qInput.value.trim();
    const answers = [];

    for (let i = 0; i < answerInputs.length; i++) {
      const val = answerInputs[i].value.trim();
      if (val === "") {
        alert("All answers must be filled");
        return;
      }
      answers.push(val);
    }

    if (!correctInput.value) {
      alert("Choose correct answer");
      return;
    }

    questions.push({
      id: qIndex + 1,
      Statement: statement,
      Answers: answers,
      CorrectAnswer: parseInt(correctInput.value, 10),
    });
  });

  if (editingQuizId) {
    // UPDATE
    const quizIndex = quizzes.findIndex((q) => q.id === editingQuizId);
    quizzes[quizIndex].Title = title;
    quizzes[quizIndex].Questions = questions;
  } else {
    // ADD
    quizzes.push({
      id: Date.now().toString(),
      Title: title,
      Questions: questions,
    });
  }

  //save to localstorage
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  renderQuizCard(quizzes);

  editingQuizId = null;
  quizSubmitBtn.textContent = "Submit Quiz";
  titleInput.value = "";
  questionsContainer.innerHTML = "";

  showPage("admin-page");
});

addQuizForm.appendChild(quizSubmitBtn);

//Update
const updateQuizPage = document.getElementById("update-quiz-page");
const updateQuizContainer = document.createElement("div");
updateQuizContainer.classList.add("update-quiz-container");
updateQuizPage.appendChild(updateQuizContainer);

const editQuiz = (quizId) => {
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return;

  showPage("add-quiz-page");

  titleInput.value = quiz.Title;
  questionsContainer.innerHTML = "";

  quiz.Questions.forEach((question) => {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-form");

    const qInput = document.createElement("input");
    qInput.type = "text";
    qInput.value = question.Statement;
    questionContainer.appendChild(qInput);

    const answersContainer = document.createElement("div");

    for (let i = 0; i < question.Answers.length; i++) {
      const aInput = document.createElement("input");
      aInput.type = "text";
      aInput.value = question.Answers[i];
      aInput.classList.add("answer-input");
      answersContainer.appendChild(aInput);
    }

    questionContainer.appendChild(answersContainer);

    const correctInput = document.createElement("input");
    correctInput.type = "number";
    correctInput.value = question.CorrectAnswer;
    questionContainer.appendChild(correctInput);

    questionsContainer.appendChild(questionContainer);
  });

  editingQuizId = quizId;
  quizSubmitBtn.textContent = "Update Quiz";
};

const renderUpdateQuizList = () => {
  updateQuizContainer.innerHTML = "";

  quizzes.forEach((quiz) => {
    const quizRow = document.createElement("div");
    quizRow.classList.add("admin-quiz-row");
    updateQuizContainer.appendChild(quizRow);

    const title = document.createElement("p");
    title.textContent = quiz.Title;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editQuiz(quiz.id));

    quizRow.appendChild(title);
    quizRow.appendChild(editBtn);
  });
};

const handleUpdateQuiz = () => {
  showPage("update-quiz-page");
  updateQuizContainer.innerHTML = "";
  renderUpdateQuizList();
};

const updateQuizBtn = document.createElement("button");
updateQuizBtn.textContent = "Update";
updateQuizBtn.addEventListener("click", () => handleUpdateQuiz());
actionCotainer.appendChild(updateQuizBtn);

//-Delete//

const deleteQuizBtn = document.createElement("button");
deleteQuizBtn.textContent = "Delete";
deleteQuizBtn.addEventListener("click", () => handleDeleteQuiz(quizzes));
actionCotainer.appendChild(deleteQuizBtn);

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

showPage("quiz-select-page");
loadQuiz();

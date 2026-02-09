import { renderQuizCard, getQuizzes } from "./handleRenderQuizFlow.js";
import { quizSubmitBtn } from "./app.js";
import { showPage } from "./handlePage.js";

let editingQuizId = null;

const addQuizPage = document.getElementById("add-quiz-page");

export const addQuizForm = document.createElement("div");
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

export const quizAddSubmit = (e, quizzes) => {
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

    const correctIndex = parseInt(correctInput.value, 10) - 1;

    questions.push({
      id: qIndex + 1,
      Statement: statement,
      Answers: answers,
      CorrectAnswer: correctIndex,
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
};

//Update
const updateQuizPage = document.getElementById("update-quiz-page");
export const updateQuizContainer = document.createElement("div");
updateQuizContainer.classList.add("update-quiz-container");
updateQuizPage.appendChild(updateQuizContainer);

const editQuiz = (quizId, quizzes) => {
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

export const renderUpdateQuizList = () => {
  updateQuizContainer.innerHTML = "";
  const quizzes = getQuizzes();

  quizzes.forEach((quiz) => {
    const quizRow = document.createElement("div");
    quizRow.classList.add("admin-quiz-row");
    updateQuizContainer.appendChild(quizRow);

    const title = document.createElement("p");
    title.textContent = quiz.Title;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editQuiz(quiz.id, quizzes));

    quizRow.appendChild(title);
    quizRow.appendChild(editBtn);
  });
};

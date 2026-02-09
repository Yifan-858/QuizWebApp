import { showPage } from "./handlePage.js";

let currentQuestionIndex = 0;
let userScore = 0;
let scoreBar = null;
let selectedQuiz = null;

//----------Handle Score----------//
const scoreCount = (selectedAnswer, correctAnswer) => {
  if (selectedAnswer == correctAnswer) {
    userScore++;
  }
};

const showScore = (container, questionsLength) => {
  container.innerHTML = "";
  const resultElement = document.createElement("p");
  resultElement.classList.add("result-element");
  resultElement.textContent = "Quiz finished! See your result👇 ";

  scoreBar = document.createElement("p");
  scoreBar.classList.add("score-bar");
  scoreBar.textContent = `${userScore} / ${questionsLength}`;

  container.appendChild(resultElement);
  container.appendChild(scoreBar);
};

//----------Render Question----------//
const renderSingleQuestion = (questions, container) => {
  container.innerHTML = "";

  const currentQuestion = questions[currentQuestionIndex];
  const questionCard = document.createElement("div");
  questionCard.classList.add("question-card");

  const questionText = document.createElement("h3");

  questionText.classList.add("question-text");
  questionText.textContent = currentQuestion.Statement;
  questionCard.appendChild(questionText);

  const questionAnswerContainer = document.createElement("div");
  questionAnswerContainer.classList.add("question-answer-container");
  questionCard.appendChild(questionAnswerContainer);

  currentQuestion.Answers.forEach((a, index) => {
    const questionAnswerBtn = document.createElement("button");
    questionAnswerBtn.classList.add("question-answer-btn");
    questionAnswerBtn.textContent = a;

    questionAnswerBtn.addEventListener("click", () => {
      scoreCount(index, currentQuestion.CorrectAnswer);

      currentQuestionIndex++;

      if (currentQuestionIndex >= questions.length) {
        showScore(container, questions.length);
      } else {
        renderSingleQuestion(questions, container);
      }
    });

    questionAnswerContainer.appendChild(questionAnswerBtn);
  });

  container.appendChild(questionCard);
};

export const renderQuestionContainer = (questions) => {
  const questionPage = document.getElementById("question-page");
  questionPage.innerHTML = "";
  currentQuestionIndex = 0;
  userScore = 0;

  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question-container");
  questionPage.appendChild(questionContainer);

  const exitBtn = document.createElement("button");
  exitBtn.classList.add("home-btn");
  exitBtn.textContent = "< Homepage";
  exitBtn.addEventListener("click", () => showPage("quiz-select-page"));
  questionContainer.appendChild(exitBtn);

  const questionContent = document.createElement("div");
  questionContent.classList.add("question-content");
  questionContainer.appendChild(questionContent);

  renderSingleQuestion(questions, questionContent);
};

//----------Render Quiz----------//
const handleQuizClick = (quizId, quizzes) => {
  selectedQuiz = quizzes.find((quiz) => quiz.id == quizId);
  showPage("question-page");

  renderQuestionContainer(selectedQuiz.Questions);
};

export const renderQuizCard = (quizzes) => {
  const quizCardContainer = document.getElementById("quiz-card-container");
  quizCardContainer.innerHTML = "";

  quizzes.forEach((quiz) => {
    const quizCard = document.createElement("div");
    quizCard.classList.add("quiz-card");
    quizCardContainer.appendChild(quizCard);

    const quizTitle = document.createElement("h3");
    quizTitle.textContent = quiz.Title;
    quizCard.appendChild(quizTitle);
    console.log(quiz);

    const countContainer = document.createElement("div");
    countContainer.classList.add("count-container");
    quizCard.appendChild(countContainer);

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start Quiz >";
    startBtn.addEventListener("click", () => handleQuizClick(quiz.id, quizzes));
    quizCard.appendChild(startBtn);

    const countIcon = document.createElement("i");
    countIcon.classList.add("fa-regular");
    countIcon.classList.add("fa-square");
    countContainer.appendChild(countIcon);

    const questionCount = document.createElement("h4");
    questionCount.textContent = quiz.Questions.length + " questions";
    countContainer.appendChild(questionCount);
  });
};

//Get quizzez from localStorage
export const getQuizzes = () => {
  return JSON.parse(localStorage.getItem("quizzes")) || [];
};

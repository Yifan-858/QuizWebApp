let quizzes = [];
let selectedQuiz = null;
let currentQuestionIndex = 0;
let userScore = 0;
let scoreBar = null;

//----------------------Handle SPA---------------------//
const showPage = (pageId) => {
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

//----------------------Handle UI render---------------------//
//-----------------------------------//
//----------Handel Score----------//
//-----------------------------------//

const scoreCount = (selectedAnswer, correctAnswer) => {
  if (selectedAnswer == correctAnswer) {
    userScore++;
  }
};

const showScore = (container) => {
  container.innerHTML = "";
  const resultElement = document.createElement("p");
  resultElement.classList.add("result-element");
  resultElement.textContent = "Quiz finished! Your result:";
  container.appendChild(resultElement);
};

//-----------------------------------//
//----------Render Question----------//
//-----------------------------------//
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
      scoreBar.textContent = `${userScore} / ${questions.length}`;
      currentQuestionIndex++;

      if (currentQuestionIndex >= questions.length) {
        showScore(container);
      } else {
        renderSingleQuestion(questions, container);
      }
    });

    questionAnswerContainer.appendChild(questionAnswerBtn);
  });

  container.appendChild(questionCard);
};

const renderQuestionContainer = (questions) => {
  const questionPage = document.getElementById("question-page");
  questionPage.innerHTML = "";
  currentQuestionIndex = 0;
  userScore = 0;

  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question-container");
  questionPage.appendChild(questionContainer);

  const exitBtn = document.createElement("button");
  exitBtn.textContent = "< Homepage";
  exitBtn.addEventListener("click", () => showPage("quiz-select-page"));
  questionContainer.appendChild(exitBtn);

  const questionContent = document.createElement("div");
  questionContent.classList.add("question-content");
  questionContainer.appendChild(questionContent);

  renderSingleQuestion(questions, questionContent);

  scoreBar = document.createElement("p");
  scoreBar.classList.add("score-bar");
  scoreBar.textContent = `${userScore} / ${questions.length}`;
  questionContainer.appendChild(scoreBar);
};

//-----------------------------------//
//----------Render Quiz----------//
//-----------------------------------//
const handleQuizClick = (quizId) => {
  selectedQuiz = quizzes.find((quiz) => quiz.id == quizId);
  showPage("question-page");
  renderQuestionContainer(selectedQuiz.Questions);
};

const renderQuizCard = (quizzes) => {
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
    const questionCount = document.createElement("h4");
    questionCount.textContent = quiz.Questions.length;
    quizCard.appendChild(questionCount);

    const startBtn = document.createElement("button");
    startBtn.textContent = ">";
    startBtn.addEventListener("click", () => handleQuizClick(quiz.id));
    quizCard.appendChild(startBtn);
  });
};

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

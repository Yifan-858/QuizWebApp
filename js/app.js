let quizzes = [];
let selectedQuiz = null;
let currentQuestionIndex = 0;
let userScore = 0;
let scoreBar = null;
let editingQuizId = null;

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

const homeTitle = document.getElementById("home-title");
homeTitle.addEventListener("click", () => showPage("quiz-select-page"));

//----------------------Handle Load Reusable---------------------//

const saveQuizzesToStorage = () => {
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
};

const loadQuizzesFromStorage = () => {
  const stored = localStorage.getItem("quizzes");
  if (stored) {
    quizzes = JSON.parse(stored);
  }
};

//----------------------Handle UI render---------------------//
//-----------------------------------//
//----------Handle Score----------//
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
  resultElement.textContent = "Quiz finished! See your result below 👇";
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
  exitBtn.classList.add("home-btn");
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

    const countContainer = document.createElement("div");
    countContainer.classList.add("count-container");
    quizCard.appendChild(countContainer);

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start Quiz >";
    startBtn.addEventListener("click", () => handleQuizClick(quiz.id));
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

//----------------------Handle Admin Login---------------------//
const admin = { userName: "Yifan", password: "123456" };
const handleAdminClick = () => {
  showPage("admin-login-page");
};

const handleLoginClick = () => {
  if (
    userNameInput.value == admin.userName &&
    passwordInput.value == admin.password
  ) {
    showPage("admin-page");
  } else {
    alert("Invalid Login");
  }
};

const adminLoginBtn = document.getElementById("admin-login-btn");
adminLoginBtn.addEventListener("click", () => handleAdminClick());

const adminLoginPage = document.getElementById("admin-login-page");

const loginContainer = document.createElement("div");
loginContainer.classList.add("login-container");
adminLoginPage.appendChild(loginContainer);

const userNameLabel = document.createElement("p");
userNameLabel.textContent = "User Name";
loginContainer.appendChild(userNameLabel);

const userNameInput = document.createElement("input");
userNameInput.type = "text";
loginContainer.appendChild(userNameInput);

const passwordLabel = document.createElement("p");
passwordLabel.textContent = "Password";
loginContainer.appendChild(passwordLabel);

const passwordInput = document.createElement("input");
passwordInput.type = "password";
loginContainer.appendChild(passwordInput);

const submitBtn = document.createElement("button");
submitBtn.classList.add("submit-btn");
submitBtn.textContent = "Login";
submitBtn.type = "button";
submitBtn.addEventListener("click", () => handleLoginClick());
loginContainer.appendChild(submitBtn);

const renderAdminPage = () => {};

//----------------------Handle Admin Interface---------------------//
const adminPage = document.getElementById("admin-page");

const actionCotainer = document.createElement("div");
actionCotainer.classList.add("action-container");
adminPage.appendChild(actionCotainer);

const actionLabel = document.createElement("h4");
actionLabel.textContent = "Quiz Action";
actionLabel.classList.add("action-lable");
actionCotainer.appendChild(actionLabel);

const handleAddQuiz = () => {
  showPage("add-quiz-page");
};

const addQuizBtn = document.createElement("button");
addQuizBtn.textContent = "Add";
addQuizBtn.addEventListener("click", () => handleAddQuiz());
actionCotainer.appendChild(addQuizBtn);

//-Add//
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

  saveQuizzesToStorage();
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

const deleteQuizPage = document.getElementById("delete-quiz-page");
const deleteQuizContainer = document.createElement("div");
deleteQuizPage.appendChild(deleteQuizContainer);

const renderDeleteQuizList = () => {
  deleteQuizContainer.innerHTML = "";

  quizzes.forEach((quiz) => {
    const quizRow = document.createElement("div");
    quizRow.classList.add("admin-quiz-row");

    const title = document.createElement("p");
    title.textContent = quiz.Title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteQuiz(quiz.id));

    quizRow.appendChild(title);
    quizRow.appendChild(deleteBtn);
    deleteQuizContainer.appendChild(quizRow);
  });
};

const handleDeleteQuiz = () => {
  showPage("delete-quiz-page");
  renderDeleteQuizList();
};

const deleteQuiz = (quizId) => {
  const confirmed = confirm("Are you sure you want to delete this quiz?");
  if (!confirmed) return;

  quizzes = quizzes.filter((q) => q.id !== quizId);

  saveQuizzesToStorage();
  renderQuizCard(quizzes);
  renderDeleteQuizList();
};

const deleteQuizBtn = document.createElement("button");
deleteQuizBtn.textContent = "Delete";
deleteQuizBtn.addEventListener("click", () => handleDeleteQuiz());
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

showPage("admin-page");
loadQuiz();

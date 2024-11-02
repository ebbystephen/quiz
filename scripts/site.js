let quizzes = [];
let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let correctAnswers = 0;

document.addEventListener('DOMContentLoaded', () => {
  fetch('quizzes.json')
    .then(response => response.json())
    .then(data => {
      quizzes = data.quizzes;
      displayQuizList();
    });
});

function displayQuizList() {
  const quizList = document.getElementById('quiz-list');
  quizList.innerHTML = '';
  quizzes.forEach((quiz, index) => {
    const quizItem = document.createElement('div');
    quizItem.textContent = quiz.title;
    quizItem.classList.add('quiz-item');
    quizItem.onclick = () => startQuiz(index);
    quizList.appendChild(quizItem);
  });
}

function startQuiz(index) {
  currentQuizIndex = index;
  currentQuestionIndex = 0;
  correctAnswers = 0;
  document.getElementById('quiz-list').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  loadQuestion();
}

function loadQuestion() {
  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];
  document.getElementById('quiz-title').textContent = quiz.title;
  document.getElementById('question').textContent = question.question;
  const options = document.getElementById('options');
  options.innerHTML = '';
  question.options.forEach(option => {
    const optionItem = document.createElement('li');
    const optionButton = document.createElement('button');
    optionButton.textContent = option;
    optionButton.onclick = () => selectOption(option, optionButton);
    optionItem.appendChild(optionButton);
    options.appendChild(optionItem);
  });
}

function selectOption(selectedOption) {
  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];
  if (selectedOption === question.answer) {
    correctAnswers++;
  button.style.backgroundColor = 'green';
    button.style.color = 'white';
  } else {
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
  }
  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestionIndex++;
  const quiz = quizzes[currentQuizIndex];
  if (currentQuestionIndex < quiz.questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('quiz-container').style.display = 'none';
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.textContent = `You answered ${correctAnswers} out of ${quizzes[currentQuizIndex].questions.length} questions correctly.`;
}

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
      showModal(); // Show the modal on page load
    });
});

function displayQuizList() {
  const quizList = document.getElementById('quiz-list');
  quizList.innerHTML = '';
  quizzes.forEach((quiz, index) => {
    const quizItem = document.createElement('div');    
    quizItem.textContent = `${quiz.title} (${quiz.questions.length} questions)`;
    quizItem.classList.add('quiz-item');
    quizItem.onclick = () => startQuiz(index);
    quizList.appendChild(quizItem);
  });
}

function startQuiz(index) {
  currentQuizIndex = index;
  currentQuestionIndex = 0;
  correctAnswers = 0;
  document.getElementById('quiz-prompt').style.display = 'none'; // Hide the prompt
  document.getElementById('quiz-list').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  loadQuestion();
}

function loadQuestion() {
  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];
  document.getElementById('quiz-title').innerHTML = `
    <span id="quiz-title-text">${quiz.title}</span>
    <span id="question-count"> (${quiz.questions.length} questions)</span>
  `;
  document.getElementById('question').textContent = question.question;
  const options = document.getElementById('options');
  options.innerHTML = '';
  shuffleArray(question.options).forEach(option => {
    const optionItem = document.createElement('li');
    const optionButton = document.createElement('button');
    optionButton.textContent = option;
    optionButton.onclick = () => selectOption(option, optionButton);
    optionItem.appendChild(optionButton);
    options.appendChild(optionItem);
  });
 
  // Update the question ordinal display
  document.getElementById('question-ordinal').textContent = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
}

function selectOption(selectedOption, button) {
  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];
  const nextButton = document.getElementById('next-button');
  
  if (selectedOption === question.answer) {
    correctAnswers++;
  button.style.backgroundColor = 'green';
    button.style.color = 'white';
  } else {
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
  }
  
  // Disable the next button
  nextButton.disabled = true;

 setTimeout(() => {
    nextButton.disabled = false;
    nextQuestion();
  }, 1000);
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
  result.innerHTML = `
    <div class="result-circle">${correctAnswers}/${quizzes[currentQuizIndex].questions.length}</div>
    <div>You answered ${correctAnswers} out of ${quizzes[currentQuizIndex].questions.length} questions correctly.</div>
    <br><a href="#" onclick="goToMainPage()">Go to main page</a>
  `;
}


function goToMainPage() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('quiz-list').style.display = 'block';  
  document.getElementById('quiz-prompt').style.display = 'block'; // Show the prompt
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function showModal() {
  const dontShowAgain = localStorage.getItem('dontShowPopup');
  if (!dontShowAgain) {
    document.getElementById('popup-modal').style.display = 'block';
  }
}

function closeModal() {
  const dontShowAgainCheckbox = document.getElementById('dont-show-again');
  if (dontShowAgainCheckbox.checked) {
    localStorage.setItem('dontShowPopup', 'true');
  }
  document.getElementById('popup-modal').style.display = 'none';
}
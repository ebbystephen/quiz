let quizzes = [];
let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let shareText='';

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

  // Disable options if the question has already been answered
  const optionButtons = document.querySelectorAll('#options button');
  optionButtons.forEach(btn => {
    if (btn.textContent === question.answer) {
      btn.disabled = true;
      btn.style.backgroundColor = 'green';
      btn.style.color = 'white';
    } else {
      btn.disabled = true;
      btn.style.backgroundColor = 'red';
      btn.style.color = 'white';
    }
  });
 
  // Update the question ordinal display
  document.getElementById('question-ordinal').textContent = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
}

function selectOption(selectedOption, button) {
  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];
  const nextButton = document.getElementById('next-button');
  const optionButtons = document.querySelectorAll('#options button');

  // Disable all option buttons
  optionButtons.forEach(btn => btn.disabled = true);
  
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

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

function showResult() {
  const quiz = quizzes[currentQuizIndex];
  document.getElementById('quiz-container').style.display = 'none';
  const result = document.getElementById('result');
  result.style.display = 'block';
  document.getElementById('result-container').style.display = 'block';
   result.innerHTML = `
    <div class="result-title">${quiz.title}</div>
    <div class="result-circle">${correctAnswers}/${quiz.questions.length}</div>
    <div>You answered ${correctAnswers} out of ${quiz.questions.length} questions correctly.</div>
    <br><a href="#" onclick="goToMainPage()">Go to main page</a>
  `;
  shareText = `I scored ${correctAnswers} out of ${quiz.questions.length} in the ${quiz.title} quiz!`;
}


function goToMainPage() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('result-container').style.display = 'none';
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

document.getElementById('share-button').addEventListener('click', function() {
    //const text = "This is the text to be converted into an image";
    const canvas = document.getElementById('text-canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 200;
    
    // Set background color
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    context.fillStyle = '#000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw text on canvas
    context.fillText(shareText, canvas.width / 2, canvas.height / 2);
    
    // Convert canvas to data URL
    const imageUrl = canvas.toDataURL('image/png');
    
    // Create a link to share the image
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Check out this achievement: ' + imageUrl)}`;
    window.open(whatsappUrl, '_blank');
});

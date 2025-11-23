// ==========================
// CORRECT ANSWERS
// ==========================
const answers = {
  "quiz1-q1": true,
  "quiz1-q2": "c",
  "quiz1-q3": "d",
  "quiz1-q4": "b",
  "quiz2-q1": "b",
  "quiz2-q2": "b",
  "quiz2-q3": "b",
  "quiz2-q4": "a",
  "quiz3-q1": "a",
  "quiz3-q2": "b",
  "quiz3-q3": "a",
  "quiz3-q4": "b"
};

// ==========================
// TEXT FOR ANSWER FEEDBACK
// ==========================
const answerText = {
  "quiz1-q1": "An octopus has three hearts",
  "quiz1-q2": "Skin is the largest organ in the body",
  "quiz1-q3": "Canberra is the capital of Australia",
  "quiz1-q4": "The Amazon River flows primarily through Brazil",
  "quiz2-q1": "Mars is known as the red planet",
  "quiz2-q2": "Water boils at 100°C",
  "quiz2-q3": "Plants absorb carbon dioxide for photosynthesis",
  "quiz2-q4": "The chemical symbol for water is H2O",
  "quiz3-q1": "Paris is the capital of France",
  "quiz3-q2": "Egypt is in Africa",
  "quiz3-q3": "The Nile River is the longest in the world",
  "quiz3-q4": "India has the largest population in the world"
};

// ==========================
// TRACK SUBMITTED QUESTIONS
// ==========================
const submittedQuestions = {};

// ==========================
// HANDLE SINGLE QUESTION SUBMISSION
// ==========================
document.querySelectorAll('.check').forEach(button => {
  button.addEventListener('click', function() {
    const q = this.dataset.q;
    const form = this.closest('form');
    const options = form.elements[q];
    const qNum = q.split('-q')[1];
    const feedback = document.getElementById(`${q.split('-')[0]}-ans${qNum}`);

    // Check if question has already been submitted
    if (submittedQuestions[q]) {
      feedback.textContent = "You already submitted this question";
      feedback.className = "answer incorrect show";
      return;
    }

    let selected = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].checked) {
        selected = options[i].value === "true" ? true : options[i].value;
      }
    }

    if (selected === null) {
      feedback.textContent = "Please select an answer!";
      feedback.className = "answer incorrect show";
      return;
    }

    if (selected === answers[q]) {
      feedback.textContent = "Correct! " + answerText[q];
      feedback.className = "answer correct show";
    } else {
      feedback.textContent = "Incorrect. " + answerText[q];
      feedback.className = "answer incorrect show";
    }

    // Disable radio buttons after submission
    for (let i = 0; i < options.length; i++) {
      options[i].disabled = true;
    }

    // Mark question as submitted
    submittedQuestions[q] = true;
  });
});

// ==========================
// HANDLE FINAL SCORE (WITH INTEGER PERCENTAGE)
// ==========================
document.querySelectorAll('button[id$="final"]').forEach(button => {
  button.addEventListener('click', function() {
    const quizId = this.id.replace('-final', '');
    const form = document.getElementById(quizId).querySelector('form');
    let score = 0;
    let total = 0;
    let allAnswered = true;

    Object.keys(answers).forEach(q => {
      if (q.startsWith(quizId)) {
        total++;
        if (!submittedQuestions[q]) {
          allAnswered = false;
        } else {
          const options = form.elements[q];
          for (let i = 0; i < options.length; i++) {
            if (options[i].checked) {
              const selected = options[i].value === "true" ? true : options[i].value;
              if (selected === answers[q]) score++;
            }
          }
        }
      }
    });

    const resultDiv = document.getElementById('result');

    if (!allAnswered) {
      resultDiv.textContent = "Please submit all questions before getting the final score";
      resultDiv.className = "answer incorrect show";
    } else {
      const percentage = Math.round((score / total) * 100);
      resultDiv.textContent = `Your final score: ${score} / ${total} (${percentage}%)`;
      resultDiv.className = "answer correct show";
    }
  });
});

// ==========================
// HANDLE QUIZ RESET
// ==========================
document.querySelectorAll('button[id$="resetBtn"]').forEach(button => {
  button.addEventListener('click', function() {
    const quizId = this.id.replace('-resetBtn', '');
    const form = document.getElementById(quizId).querySelector('form');
    form.reset();

    // Clear feedback and reset submitted state, enable radio buttons
    Object.keys(answers).forEach(q => {
      if (q.startsWith(quizId)) {
        const qNum = q.split('-q')[1];
        const feedback = document.getElementById(`${quizId}-ans${qNum}`);
        feedback.textContent = '';
        feedback.className = "answer";
        submittedQuestions[q] = false;

        const options = form.elements[q];
        for (let i = 0; i < options.length; i++) {
          options[i].disabled = false;
        }
      }
    });

    // Clear the final score
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';
    resultDiv.className = 'answer';
  });
});

// ==========================
// HANDLE QUIZ SELECTION
// ==========================
document.querySelectorAll('#quiz-buttons button').forEach(button => {
  button.addEventListener('click', function() {
    const selectedQuiz = this.dataset.quiz;
    document.querySelectorAll('.quiz-container').forEach(q => q.style.display = 'none');
    document.getElementById(selectedQuiz).style.display = 'block';

    // Clear previous score
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';
    resultDiv.className = 'answer';
  });
});

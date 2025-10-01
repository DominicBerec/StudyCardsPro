function addQuestion() {
    document.getElementById('questionModal').classList.remove('hidden');
}

function closeQuestion() {
    document.getElementById('questionModal').classList.add('hidden');
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
    editingCardId = null;
}


function updateCardCount() {
    const count = Object.keys(questions).length;
    const cardCountElement = document.getElementById('cardCount');
    cardCountElement.textContent = `${count} card${count !== 1 ? 's' : ''}`;
    
    
    if (count === 0) {
        cardCountElement.style.background = '#6c757d';
    } else if (count <= 5) {
        cardCountElement.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
    } 
    else if (5 <= count && count <= 10) {
        cardCountElement.style.background = 'linear-gradient(45deg, #eb3734, #c4281a)';
    } else {
        cardCountElement.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
}

let questions = {};
let cardsPerColumn = 3;
let currentColumn = null;
let cardsInCurrentColumn = 0;
let editingCardId = null;

function updateExistingCard(cardId, newQuestion, newAnswer) {
    let cardContainer = document.querySelector(`[data-question-id="${cardId}"]`);
    if (cardContainer) {
        let questionElement = cardContainer.querySelector('.question-text');
        let answerElement = cardContainer.querySelector('.answer-text');
        
        questionElement.innerHTML = `
            <i class="fas fa-question-circle" style="color: #667eea; margin-right: 8px;"></i>
            ${newQuestion}
        `;
        
        answerElement.innerHTML = `
            <i class="fas fa-lightbulb" style="color: #28a745; margin-right: 8px;"></i>
            ${newAnswer}
        `;
    }
}

function saveQuestion() {
    let question = document.getElementById("question").value.trim();
    let answer = document.getElementById("answer").value.trim();

    if (!question || !answer) {
        alert('Please fill in both question and answer fields.');
        return;
    }

    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";
    document.getElementById('questionModal').classList.add('hidden');

    let questionContainer = document.getElementById("questionContainer");

    if (editingCardId !== null) {
    
        questions[editingCardId] = { question: question, answer: answer };
        updateExistingCard(editingCardId, question, answer);
        editingCardId = null;
        updateCardCount();
        return;
    }

   
    let questionId = Date.now(); 
    questions[questionId] = { question: question, answer: answer };

   
    if (!currentColumn || cardsInCurrentColumn >= cardsPerColumn) {
        currentColumn = document.createElement("div");
        currentColumn.className = "column";
        questionContainer.appendChild(currentColumn);
        cardsInCurrentColumn = 0;
    }

    let container = document.createElement("div");
    container.className = "question-container";
    container.setAttribute('data-question-id', questionId);

    let questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
        <div class="question-text">
            <i class="fas fa-question-circle" style="color: #667eea; margin-right: 8px;"></i>
            ${question}
        </div>
        <a href="#" class="show-answer">
            <i class="fas fa-eye"></i> Show Answer
        </a>
        <div class="answer-text" style="display: none;">
            <i class="fas fa-lightbulb" style="color: #28a745; margin-right: 8px;"></i>
            ${answer}
        </div>
        <div class="card-actions">
            <button class="btn btn-secondary edit-question" style="padding: 6px 12px; font-size: 0.9rem;">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger delete-question" style="padding: 6px 12px; font-size: 0.9rem;">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    container.appendChild(questionDiv);

    let showAnswerLinks = questionDiv.querySelectorAll('.show-answer');
    showAnswerLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let answerElement = this.nextElementSibling;
            if (answerElement.style.display === 'none') {
                answerElement.style.display = 'block';
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Answer';
            } else {
                answerElement.style.display = 'none';
                this.innerHTML = '<i class="fas fa-eye"></i> Show Answer';
            }
        });
    });
    
    let editButtons = questionDiv.querySelectorAll('.edit-question');
    editButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            let cardContainer = this.closest('.question-container');
            let questionId = cardContainer.getAttribute('data-question-id');
            
            
            editingCardId = questionId;
            
            
            let questionData = questions[questionId];
            document.getElementById("question").value = questionData.question;
            document.getElementById("answer").value = questionData.answer;
            document.getElementById('questionModal').classList.remove('hidden');
        });
    });

    let deleteButtons = questionDiv.querySelectorAll('.delete-question');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this flashcard?')) {
                let cardContainer = this.closest('.question-container');
                let questionId = cardContainer.getAttribute('data-question-id');
                delete questions[questionId];
                
                let columnContainer = cardContainer.parentNode;
                cardContainer.remove();
                
                cardsInCurrentColumn--;
                if (columnContainer.children.length === 0) {
                    columnContainer.remove();
                    if (columnContainer === currentColumn) {
                        currentColumn = null;
                        cardsInCurrentColumn = 0;
                    }
                }
                
                updateCardCount();
                
           
                if (Object.keys(questions).length === 0) {
                    questionContainer.classList.add("hidden");
                }
            }
        });
    });

    currentColumn.appendChild(container);
    cardsInCurrentColumn++;

    questionContainer.classList.remove("hidden");
    updateCardCount();
}
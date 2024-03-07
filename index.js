const apiUrl = 'https://opentdb.com/api.php?amount=30';

const categories = [
	{ text: 'Random', urlParam: '' },
	{ text: 'General Knowledge', urlParam: '&category=9' },
	{ text: 'Books', urlParam: '&category=10' },
	{ text: 'Films', urlParam: '&category=11' },
	{ text: 'Music', urlParam: '&category=12' },
	{ text: 'Musicals & Theatre', urlParam: '&category=13' },
	{ text: 'Television', urlParam: '&category=14' },
	{ text: 'Video Games', urlParam: '&category=15' },
	{ text: 'Board Games', urlParam: '&category=16' },
	{ text: 'Science & Nature', urlParam: '&category=17' },
	{ text: 'Computers', urlParam: '&category=18' },
	{ text: 'Math', urlParam: '&category=19' },
	{ text: 'Mythology', urlParam: '&category=20' },
	{ text: 'Sports', urlParam: '&category=21' },
	{ text: 'Geography', urlParam: '&category=22' },
	{ text: 'History', urlParam: '&category=23' },
	{ text: 'Politics', urlParam: '&category=24' },
	{ text: 'Art', urlParam: '&category=25' },
	{ text: 'Celebrities', urlParam: '&category=26' },
	{ text: 'Animals', urlParam: '&category=27' },
	{ text: 'Cars', urlParam: '&category=28' },
	{ text: 'Comics', urlParam: '&category=29' },
	{ text: 'Gadgets', urlParam: '&category=30' },
	{ text: 'Anime & Manga', urlParam: '&category=31' },
	{ text: 'Cartoons & Animations', urlParam: '&category=32' },
];

const difficulty = [
	{ text: 'Random', urlParam: '' },
	{ text: 'Easy', urlParam: '&difficulty=easy' },
	{ text: 'Medium', urlParam: '&difficulty=medium' },
	{ text: 'Hard', urlParam: '&difficulty=hard' },
];

const types = [
	{ text: 'Random', urlParam: '' },
	{ text: 'Multiple Choice', urlParam: '&type=multple' },
	{ text: 'True or False', urlParam: '&type=boolean' },
];
// Elements
const timerElement = document.getElementById('timer');
const successScoreElement = document.getElementById('success');
const failScoreElement = document.getElementById('fail');
const quizQuestionElement = document.getElementById('quiz-question');
const quizOptionsElement = document.getElementById('quiz-options');
const QuizNumberElement = document.getElementById('quiz-number');
const difficultyBtnsElement = document.getElementById('difficulty-btns');
const categoryBtnsElement = document.getElementById('category-btns');
const typeBtnsElement = document.getElementById('type-btns');
const sideNav = document.getElementById('side-nav');

// Variables
let currentQuiz = null;
let options = null;
let quizzes = [];
let quizCategory = 0;
let quizDifficulty = 0;
let quizType = 0;
let success = 0;
let fail = 0;
let quizNo = 0;

// Templates
const loading = `
<div role="status" class="mx-auto w-max h-full flex items-center" >
    <svg aria-hidden="true" class="size-32 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
</div>
`;

// Helper Functions
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Timer
let timerInterval;
const maxTime = 15;
let time = maxTime;

const timer = () => {
	if (time <= 0) {
		fail += 1;
		failScoreElement.innerText = fail;
		showCorrectAnswer();
	}
	time -= 0.1;
	timerElement.style.width = `${(time / maxTime) * 100}%`;
};

const resetTimer = () => {
	clearInterval(timerInterval);
	time = maxTime;
	timerElement.style.width = `${(time / maxTime) * 100}%`;
};

const startTimer = () => {
	time = maxTime;
	timerInterval = setInterval(timer, 100);
};
// Button Functions
const setQuizDifficulty = diff => {
	quizDifficulty = diff;
};
const setQuizCategory = diff => {
	quizCategory = diff;
};
const setQuizType = diff => {
	quizType = diff;
};
const changeQuiz = () => {
	success = 0;
	fail = 0;
	quizNo = 0;
	quizzes = [];
	quizQuestionElement.innerHTML = '';

	quizOptionsElement.innerHTML = `${loading} <h2 class="text-center">Fetching Quizzes...</h2>`;

	successScoreElement.innerText = success;
	failScoreElement.innerText = fail;

	resetTimer();
	setTimeout(async () => {
		await getQuizzes();
		showQuiz();
	}, 5000);
};
// Main Functions
const increaseSuccessScore = () => {
	success += 1;
	successScoreElement.innerText = success;
};

const increaseFailScore = () => {
	fail += 1;
	failScoreElement.innerText = fail;
};

const showCorrectAnswer = async (e = null) => {
	resetTimer();

	const tempElement = document.createElement('div');
	tempElement.innerHTML = currentQuiz.correct_answer;
	const correct_answer = tempElement.textContent;

	options.forEach(option => {
		option.classList.remove('hover:bg-indigo-950');
		option.removeEventListener('click', showCorrectAnswer);
		option.classList.add('text-black');
		if (option.textContent === correct_answer)
			option.classList.add('bg-green-400');
		else option.classList.add('bg-red-400');
	});

	if (e) {
		if (e.target.textContent === correct_answer) increaseSuccessScore();
		else increaseFailScore();
	}

	quizzes.shift();
	if (quizzes.length < 3) await getQuizzes();
	setTimeout(showQuiz, 500);
};

const getQuizzes = async () => {
	try {
		const response = await fetch(
			`https://opentdb.com/api.php?amount=30${categories[quizCategory].urlParam}${difficulty[quizDifficulty].urlParam}${types[quizType].urlParam}`
		);
		const json = await response.json();
		const newQuizzes = json.results;
		quizzes = quizzes.concat(newQuizzes);
	} catch (error) {
		console.log(error);
	}
};

const showQuiz = () => {
	quizNo += 1;
	quizQuestionElement.innerHTML = '';
	quizOptionsElement.innerHTML = loading;
	QuizNumberElement.innerText = quizNo;
	currentQuiz = quizzes[0];
	if (!currentQuiz) return;
	quizQuestionElement.innerHTML = currentQuiz.question;
	setTimeout(() => {
		quizOptionsElement.innerHTML = `
        ${shuffleArray([
			currentQuiz.correct_answer,
			...currentQuiz.incorrect_answers,
		])
			.map(
				option => `
                <li class="bg-blue-950 text-neutral-300 text-3xl rounded-lg overflow-hidden">
                    <button class="options block w-full h-full p-2">${option}</button>
                </li>`
			)
			.join('')}`;
		options = document.querySelectorAll('.options');
		options.forEach(option => {
			option.classList.add('hover:bg-indigo-950');
			option.addEventListener('click', showCorrectAnswer);
		});
		startTimer();
	}, 300);
};

categories.forEach((category, id) => {
	const button = document.createElement('button');
	button.classList.add(
		'px-6',
		'h-14',
		'text-base',
		'font-medium',
		'text-white',
		'outline-none',
		'rounded-lg',
		'bg-purple-700',
		'text-center',
		'hover:bg-blue-700'
	);
	button.addEventListener('click', () => setQuizCategory(id));
	button.innerText = category.text;
	categoryBtnsElement.appendChild(button);
});
difficulty.forEach((diff, id) => {
	const button = document.createElement('button');
	button.classList.add(
		'px-6',
		'h-14',
		'text-base',
		'font-medium',
		'text-white',
		'outline-none',
		'rounded-lg',
		'bg-purple-700',
		'text-center',
		'hover:bg-blue-700'
	);
	button.addEventListener('click', () => setQuizDifficulty(id));
	button.innerText = diff.text;
	difficultyBtnsElement.appendChild(button);
});
types.forEach((type, id) => {
	const button = document.createElement('button');
	button.classList.add(
		'px-6',
		'h-14',
		'text-base',
		'font-medium',
		'text-white',
		'outline-none',
		'rounded-lg',
		'bg-purple-700',
		'text-center',
		'hover:bg-blue-700'
	);
	button.addEventListener('click', () => setQuizType(id));
	button.innerText = type.text;
	typeBtnsElement.appendChild(button);
});
sideNav.addEventListener('mouseleave', () => {
	sideNav.classList.remove('show');
});

document.getElementById('side-nav-toggle').addEventListener('click', () => {
	sideNav.classList.add('show');
});

// Fetch Initial Data before loading the quiz
(async () => {
	await getQuizzes();
	showQuiz();
})();

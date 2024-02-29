let currentQuiz = null;
let OptionElements = null;
const quizElement = document.getElementById('quiz');
let quizzes = [];
let success = 0;
let fail = 0;
let quizNo = 0;
// Templates
const loading = `
<div role="status" class="mx-auto w-max" >
    <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>
`;
const Quiz = (question, choices) => {
	let template = `
        <h2 class="text-3xl font-bold text-center">${question}</h2>
        <ul class="space-y-3 p-2 mt-4">
    `;
	choices.forEach((choice) => {
		template += `<li class="bg-blue-950 font-semibold text-neutral-400 text-3xl rounded-lg overflow-hidden">
                        <button class="options block w-full h-full p-2">${choice}</button>
	                </li>`;
	});
	template += '</ul>';
	return template;
};
// Helper Functions
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
// Timer
const timerElement = document.getElementById('timer');
let timerInterval;

const maxTime = 15;
let time = maxTime;

function timer() {
	if (time <= 0) {
		fail += 1;
		document.getElementById('fail').innerText = fail;
		showCorrectAnswer();
	}
	time -= 0.1;
	timerElement.style.width = `${(time / maxTime) * 100}%`;
}
function timerReset() {
	clearInterval(timerInterval);
	time = maxTime;
	timerElement.style.width = `${(time / maxTime) * 100}%`;
}
function timerStart() {
	time = maxTime;
	timerInterval = setInterval(timer, 100);
}

//
function showCorrectAnswer(e = null) {
	// Create a temporary element
	const tempElement = document.createElement('div');
	tempElement.innerHTML = currentQuiz.correct_answer;

	const correct_answer = tempElement.textContent;

	if (e) {
		if (e.target.textContent === correct_answer) {
			success += 1;
			document.getElementById('success').innerText = success;
		} else {
			fail += 1;
			document.getElementById('fail').innerText = fail;
		}
	}
	OptionElements.forEach((option) => {
		option.classList.add('text-black');
		if (option.innerText === correct_answer) {
			option.classList.add('bg-green-400');
		} else {
			option.classList.add('bg-red-400');
		}
	});
	quizzes.shift();
	timerReset();
	setTimeout(showQuiz, 500);
}
const getQuizzes = async () => {
	console.log('fetching quizzes....');
	try {
		const response = await fetch('https://opentdb.com/api.php?amount=20');
		const json = await response.json();
		const newQuizzes = await json.results;
		quizzes = [...quizzes, ...newQuizzes];
	} catch (error) {
		console.log(error);
	}
};

const showQuiz = async () => {
	quizNo += 1;
	document.getElementById('quizNo').innerText = quizNo;
	document.getElementById('quiz').innerHTML = loading;
	if (quizzes.length < 2) await getQuizzes();
	setTimeout(() => {
		currentQuiz = quizzes[0];
		console.log(currentQuiz.correct_answer);
		const question = currentQuiz.question;
		const choices = shuffleArray([
			currentQuiz.correct_answer,
			...currentQuiz.incorrect_answers,
		]);
		quizElement.innerHTML = Quiz(question, choices);

		OptionElements = document.querySelectorAll('.options');
		OptionElements.forEach((element) => {
			element.addEventListener('click', showCorrectAnswer);
		});
		timerStart();
	}, 300);
};

await getQuizzes();
showQuiz();

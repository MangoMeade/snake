console.log('hi mom!', random(0, 5, false));
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreTag = document.querySelector('#score');
const btnContainer = document.querySelector('#btn-container');
let state = initialState();

if (!navigator.userAgentData.mobile) {
	//	btnContainer.style.display = 'none';
}
const x = (c) => Math.round((c * canvas.width) / state.cols);
const y = (r) => Math.round((r * canvas.height) / state.rows);

function draw() {
	if (parseInt(scoreTag.innerHTML) !== state.score) {
		scoreTag.innerHTML = state.score;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw snake
	ctx.fillStyle = 'rgb(0,200,50)';
	R.forEach((obj) => {
		ctx.fillRect(x(obj.x), y(obj.y), x(1), y(1));
	}, state.snake);

	// draw apples
	ctx.fillStyle = 'rgb(255,50,0)';
	ctx.fillRect(x(state.fruit.x), y(state.fruit.y), x(1), y(1));
}

const step = (t1) => (t2) => {
	if (t2 - t1 > 100) {
		state = nextState(state);
		if (state.crashed) {
			state = initialState();
		}
		draw();
		window.requestAnimationFrame(step(t2));
	} else {
		window.requestAnimationFrame(step(t1));
	}
};

btnContainer.addEventListener('click', (event) => {
	if (event.target.nodeName === 'BUTTON') {
		const direction = event.target.dataset.direction;
		console.log('direction', direction);
		state = queueNextMove(state, coordinates[direction]);
	}
});
window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'w':
		case 'ArrowUp':
			state = queueNextMove(state, coordinates.UP);
			break;
		case 'a':
		case 'ArrowLeft':
			state = queueNextMove(state, coordinates.LEFT);
			break;
		case 's':
		case 'ArrowDown':
			state = queueNextMove(state, coordinates.DOWN);
			break;
		case 'd':
		case 'ArrowRight':
			state = queueNextMove(state, coordinates.RIGHT);
			break;
	}
});

draw();
window.requestAnimationFrame(step(0));

const moveLens = R.lens(R.prop('move'), R.assoc('move'));

const coordinates = {
	UP: { x: 0, y: -1, name: 'UP', opposite: 'DOWN' },
	DOWN: { x: 0, y: 1, name: 'DOWN', opposite: 'UP' },
	RIGHT: { x: 1, y: 0, name: 'RIGHT', opposite: 'LEFT' },
	LEFT: { x: -1, y: 0, name: 'LEFT', opposite: 'RIGHT' },
};

const random = (min, max) => {
	let range = max - min;
	let random = Math.random() * range + min;
	return Math.floor(random);
};

const areaCoordinates = [];

for (let x = 0; x < 20; x++) {
	for (let y = 0; y < 14; y++) {
		areaCoordinates.push({ x, y });
	}
}

const initialState = () => ({
	cols: 20,
	rows: 14,
	move: coordinates.RIGHT,
	fruit: { x: 10, y: 10 },
	snake: [
		{ x: 2, y: 2 },
		{ x: 1, y: 2 },
		{ x: 0, y: 2 },
	],
	crashed: false,
	score: 0,
});

const queueNextMove = R.curry((state, move) =>
	state.move.opposite === move.name ? state : R.mergeRight(state, { move })
);

const nextSnake = (state) =>
	R.compose(
		didAteFruit(state) ? R.identity : R.dropLast(1),
		R.prepend({
			x: state.snake[0].x + state.move.x,
			y: state.snake[0].y + state.move.y,
		})
	)(state.snake);

const nextFruit = (state) =>
	didAteFruit(state)
		? R.compose(
				(list) => list[random(0, R.length(list))],
				R.reject((obj) => R.any(R.whereEq(obj), state.snake))
		  )(areaCoordinates)
		: state.fruit;

const nextState = (state) => ({
	...state,
	snake: nextSnake(state),
	crashed: didSnakeCrashed(state),
	fruit: nextFruit(state),
});

const didAteFruit = (state) =>
	R.compose(R.whereEq(state.fruit), R.head)(state.snake);

const didSnakeCrashed = (state) => {
	const snakeHead = R.head(state.snake);
	const headX = R.prop('x', snakeHead);
	const headY = R.prop('y', snakeHead);
	const crashIteself = R.compose(
		R.any(R.whereEq(snakeHead)),
		R.drop(1)
	)(state.snake);
	return (
		headX >= state.cols ||
		headX < 0 ||
		headY >= state.rows ||
		headY < 0 ||
		crashIteself
	);
};

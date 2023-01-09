const socket = io();
const uid = new ShortUniqueId();
const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');

// declaring some varibales to be used later in the code
let isRoomCreated = false,
	playerName,
	playerSymbol,
	playerScore = 0,
	roomId,
	coPlayerName,
	coPlayerSymbol,
	coPlayerScore = 0,
	myTurn,
	currentGameState = ['', '', '', '', '', '', '', '', ''];

// event listeners
createRoomBtn.onclick = () => {
	const tempPlayerName = document.getElementById(
		'nameInputFieldForCreateRoom'
	).value;
	if (tempPlayerName === '') {
		notyf.error('Name can not be empty!');
		return;
	}
	playerName = tempPlayerName;
	roomId = uid();
	socket.emit('createOrJoin', { playerName, roomId });
};

joinRoomBtn.onclick = () => {
	const tempPlayerName = document.getElementById(
		'nameInputFieldForJoinRoom'
	).value;
	const tempRoomId = document.getElementById('roomInputField').value;
	if (tempPlayerName === '') {
		notyf.error('Name can not be empty!');
		return;
	}
	if (tempRoomId === '') {
		notyf.error('Room ID can not be empty!');
		return;
	}
	playerName = tempPlayerName;
	roomId = tempRoomId;
	socket.emit('createOrJoin', { playerName, roomId });
};

// helper functions
const copyRoomIdToClipboard = () => {
	navigator.clipboard.writeText(roomId);
	notyf.success('Room Id copied!');
};

const setupPlayArea = () => {
	document.getElementById(
		'playAreaPlayerDetails'
	).innerHTML = `${playerName}(${playerSymbol}) : ${playerScore}`;
	document.getElementById(
		'playAreaCoplayerDetails'
	).innerHTML = `${coPlayerName}(${coPlayerSymbol}) : ${coPlayerScore}`;
	if (myTurn) {
		activateTable();
	} else {
		deActivateTable();
	}
};

const printValuesInPlayBox = () => {
	for (let i = 0; i < 9; i++) {
		document.getElementById(`box${i}`).innerHTML = currentGameState[i];
	}
};

const blinkWinningBoxes = (indexes) => {
	const winningSymbol = currentGameState[indexes[0]];
	for (let i = 0; i < 6; i++) {
		setTimeout(() => {
			if (i % 2 === 0) {
				currentGameState[indexes[0]] = '';
				currentGameState[indexes[1]] = '';
				currentGameState[indexes[2]] = '';
				printValuesInPlayBox();
			} else {
				currentGameState[indexes[0]] = winningSymbol;
				currentGameState[indexes[1]] = winningSymbol;
				currentGameState[indexes[2]] = winningSymbol;
				printValuesInPlayBox();
			}
		}, i * 300);
	}
};

const resetGame = (winningSymbol) => {
	currentGameState = ['', '', '', '', '', '', '', '', ''];
	printValuesInPlayBox();
	if (winningSymbol === playerSymbol) {
		myTurn = true;
		activateTable();
		notyf.success('Your turn!');
	} else {
		myTurn = false;
		deActivateTable();
		notyf.success(coPlayerName + "'s turn!");
	}
};

const gameWon = (indexes) => {
	console.log(indexes);
	// increasing the score of winner
	if(currentGameState[indexes[0]] === playerSymbol) {
		playerScore++;
	} else {
		coPlayerScore++;
	}
	document.getElementById(
		'playAreaPlayerDetails'
	).innerHTML = `${playerName}(${playerSymbol}) : ${playerScore}`;
	document.getElementById(
		'playAreaCoplayerDetails'
	).innerHTML = `${coPlayerName}(${coPlayerSymbol}) : ${coPlayerScore}`;
	deActivateTable();
	blinkWinningBoxes(indexes);
	setTimeout(() => {
		resetGame(currentGameState[indexes[0]]);
	}, 3000);
};

const checkForWin = () => {
	// if first row has all same symbol
	if (
		currentGameState[0] === currentGameState[1] &&
		currentGameState[1] === currentGameState[2] &&
		currentGameState[0] !== ''
	) {
		if (currentGameState[0] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([0, 1, 2]);
		return;
	}
	// if second row has all same symbol
	if (
		currentGameState[3] === currentGameState[4] &&
		currentGameState[4] === currentGameState[5] &&
		currentGameState[3] !== ''
	) {
		if (currentGameState[3] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([3, 4, 5]);
		return;
	}
	// if third row has all same symbol
	if (
		currentGameState[6] === currentGameState[7] &&
		currentGameState[7] === currentGameState[8] &&
		currentGameState[6] !== ''
	) {
		if (currentGameState[6] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([6, 7, 8]);
		return;
	}
	// if first column has all same symbol
	if (
		currentGameState[0] === currentGameState[3] &&
		currentGameState[3] === currentGameState[6] &&
		currentGameState[0] !== ''
	) {
		if (currentGameState[0] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([0, 3, 6]);
		return;
	}
	// if second column has all same symbol
	if (
		currentGameState[1] === currentGameState[4] &&
		currentGameState[4] === currentGameState[7] &&
		currentGameState[1] !== ''
	) {
		if (currentGameState[1] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([1, 4, 7]);
		return;
	}
	// if third column has all same symbol
	if (
		currentGameState[2] === currentGameState[5] &&
		currentGameState[5] === currentGameState[8] &&
		currentGameState[2] !== ''
	) {
		if (currentGameState[2] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([2, 5, 8]);
		return;
	}
	// if first diagonal has all same symbol
	if (
		currentGameState[0] === currentGameState[4] &&
		currentGameState[4] === currentGameState[8] &&
		currentGameState[0] !== ''
	) {
		if (currentGameState[0] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([0, 4, 8]);
		return;
	}
	// if second diagonal has all same symbol
	if (
		currentGameState[2] === currentGameState[4] &&
		currentGameState[4] === currentGameState[6] &&
		currentGameState[2] !== ''
	) {
		if (currentGameState[2] === playerSymbol) {
			notyf.success('You win!');
		} else {
			notyf.success(coPlayerName + ' won!');
		}
		gameWon([2, 4, 6]);
		return;
	}

	// checking if it is draw
	let isDraw = true;
	for (let i = 0; i < 9; i++) {
		if (currentGameState[i] === '') {
			isDraw = false;
			break;
		}
	}
	if (isDraw) {
		notyf.success('Game draw!');
		deActivateTable();
		setTimeout(() => {
			resetGame('O');
		}, 3000);
	}
};

const boxClick = (boxNumber, whichPlayer) => {
	console.log(boxNumber, whichPlayer);
	if (whichPlayer === 'player') {
		if (!myTurn) {
			notyf.error('Not your turn!');
			return;
		}
		currentGameState[Number(boxNumber)] = playerSymbol;
		myTurn = false;
		deActivateTable();
		socket.emit('boxClicked', { playerName, playerSymbol, boxNumber, roomId });
	} else if (whichPlayer === 'coPlayer') {
		currentGameState[Number(boxNumber)] = coPlayerSymbol;
		myTurn = true;
		activateTable();
	}
	printValuesInPlayBox();
	checkForWin();
};

const activateTable = () => {
	const playTable = document.getElementById('playTable');
	playTable.classList.remove('inactive-table');
	playTable.classList.add('active-table');
};

const deActivateTable = () => {
	const playTable = document.getElementById('playTable');
	playTable.classList.remove('active-table');
	playTable.classList.add('inactive-table');
};

// listening to socket events
socket.on('roomCreated', (data) => {
	console.log(data);
	isRoomCreated = true;
	notyf.success('Room Created!');
	document.getElementById('inputDetails').style.display = 'none';
	document.getElementById('showRoomIdForWaitingScreen').innerHTML = roomId;
	document.getElementById('waitForOtherPlayer').style.display = 'block';
});

socket.on('roomJoined', (data) => {
	console.log(data);
	if (isRoomCreated) {
		coPlayerName = data.playerName;
		notyf.success(coPlayerName + ' joined!');
		playerSymbol = 'O';
		coPlayerSymbol = 'X';
		myTurn = true;
		socket.emit('playerDetails', { playerName, roomId });
		setupPlayArea();
		document.getElementById('waitForOtherPlayer').style.display = 'none';
		document.getElementById('playArea').style.display = 'block';
	} else {
		notyf.success('Room Joined!');
		playerSymbol = 'X';
		coPlayerSymbol = 'O';
		myTurn = false;
	}
});

socket.on('roomFull', (data) => {
	console.log(data);
	notyf.error('Room is already full!');
});

socket.on('playerDetails', (data) => {
	console.log('playerDetails');
	coPlayerName = data.playerName;
	notyf.success(coPlayerName + ' is here!');
	setupPlayArea();
	document.getElementById('inputDetails').style.display = 'none';
	document.getElementById('playArea').style.display = 'block';
});

socket.on('boxClicked', (data) => {
	console.log('boxClicked');
	boxClick(data.boxNumber, 'coPlayer');
});

const theSequence = [7, 5, 3]
const seqContainer = document.getElementById("seqContainer")
const historyContainer = document.getElementById("history")
const goalContainer = document.getElementById("goal")

const gameState = {
	moves: 0,
	history: [],
}

function init() {
	gameState.originalSequence = theSequence
	gameState.goalSequence = theSequence.slice().reverse()
	setSequence(theSequence)
}
init()

function setSequence(sequence) {
	gameState.moves++
	gameState.history.push(sequence.slice())
	gameState.sequence = sequence
	seqContainer.innerHTML = ""
	if (sequence.find((num, i) => num != gameState.goalSequence[i])) {
		setUI(sequence)
	} else {
		seqContainer.innerHTML =
			"You won in " + (gameState.history.length - 1) + " moves."
		console.log("Winner")
	}
}

function setUI(sequence) {
	sequence.forEach((num, i, arr) => {
		seqContainer.appendChild(createNumberDiv(num))
		if (i < arr.length - 1) {
			const next = arr[i + 1]
			const max = getMax()
			const newNum = next + num
			const canBeMerged = !sequence.includes(newNum) && newNum <= max
			const mergeButton = div("merge")
			mergeButton.innerHTML = `→${num + next}←`
			if (!canBeMerged) {
				mergeButton.classList.add("disabled")
			} else {
				mergeButton.onclick = () => {
					const currentIndex = sequence.indexOf(num)
					const newSequence = sequence.slice()
					newSequence.splice(currentIndex, 2, newNum)
					setSequence(newSequence)
				}
			}
			seqContainer.appendChild(mergeButton)
		}
	})
	goalContainer.innerHTML =
		"<div>Original sequence: " +
		gameState.originalSequence
			.map(num => "<div class='number' >" + num + "</div>")
			.join("") +
		"</div><div>Target sequence: " +
		gameState.goalSequence
			.map(num => "<div class='number' >" + num + "</div>")
			.join("") +
		"</div>"
	historyContainer.innerHTML =
		"Moves: " +
		(gameState.history.length - 1) +
		"<br>" +
		gameState.history.join("<br>")
}

function createNumberDiv(num) {
	const numCont = div("numContainer")
	const numEl = div("number")
	numEl.innerHTML = num
	let splitCont = getSplitButtons(num)
	// numEl.onclick = () => {}

	numCont.appendChild(numEl)
	numCont.appendChild(splitCont)
	return numCont
}

function getSplitButtons(number) {
	let selectContainer = div("selectCont")
	let pairs = []
	const max = Math.min(getMax(), number)
	for (let i = 1; i < max; i++) {
		pairs.push([i, max - i])
	}

	const legiblePairs = pairs.filter(
		([num0, num1]) => checkNumber(num0) && checkNumber(num1) && num0 != num1,
	)

	if (legiblePairs.length) {
		selectContainer.innerHTML = "Split:"
	}
	legiblePairs.forEach(([num0, num1]) => {
		const pairDiv = div("pair")
		pairDiv.innerHTML = `↙↘<br>${num0},${num1}`
		pairDiv.onclick = () => {
			let currentIndex = gameState.sequence.indexOf(num0 + num1)
			const newSequence = gameState.sequence.slice(0)
			newSequence.splice(currentIndex, 1, num0, num1)

			setSequence(newSequence)
		}
		selectContainer.appendChild(pairDiv)
	})

	return selectContainer
}

function checkNumber(num) {
	return !gameState.sequence.includes(num) && getMax() >= num
}

function getMin() {
	return Math.min(...gameState.originalSequence)
}

function getMax() {
	return Math.max(...gameState.originalSequence)
}

function div(className) {
	const el = document.createElement("div")
	if (className) {
		el.className = className
	}
	return el
}

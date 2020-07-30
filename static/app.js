// function to create a new pixel div

const createNewPixel = () => {
	const newPixel = document.createElement("div")
	newPixel.setAttribute("class", "pixel")
	return newPixel
}

// function to create a row of pixels
const createNewRow = (length) => {
	const newRow = document.createElement("div")
	newRow.setAttribute("class", "row")
	for (let i = 0; i < length; i++) {
		newRow.appendChild(createNewPixel())
	}
	return newRow
}

const handleClick = e => {
	if (e.target.className === "pixel") {
		e.target.setAttribute("class", "white-pixel")
	} else if (e.target.className === "white-pixel") {
		e.target.setAttribute("class", "pixel")
	} else {
		console.log("Error: target's class name is invalid")
	}
}

// function to create the board of pixels
const createBoard = (width, height) => {
	const board = document.createElement("div")
	board.setAttribute("class", "board")
	for (let i = 0; i < height; i++) {
		board.appendChild(createNewRow(width))
	}
	board.addEventListener("click", handleClick)
	return board
}

document.querySelector("body").appendChild(createBoard(10, 10))

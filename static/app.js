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
	e.target.setAttribute("class", "white-pixel")
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

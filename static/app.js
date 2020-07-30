const board = {

	// array to hold values representing pixels
	pixels: [],

	// event handlers

	handleClick: function(e) {
		if (e.target.className === "pixel") {
			e.target.setAttribute("class", "white-pixel")
		} else if (e.target.className === "white-pixel") {
			e.target.setAttribute("class", "pixel")
		} else {
			console.log("Error: target's class name is invalid")
		}
		console.log(this.pixels)
	},	

	// method to create a new pixel in DOM and state
	createNewPixel: function(row) {
		this.pixels[row].push(0)
		const newPixel = document.createElement("div")
		newPixel.setAttribute("class", "pixel")
		return newPixel
	},

	// method to create new row in DOM and state
	createNewRow: function(row, length) {
		this.pixels.push([])
		const newRow = document.createElement("div")
		newRow.setAttribute("class", "row")
		for (let i = 0; i < length; i++) {
			newRow.appendChild(this.createNewPixel(row))
		}
		return newRow
	},

	create: function(width, height) {
		const newBoard = document.createElement("div")
		newBoard.setAttribute("class", "board")
		for (let i = 0; i < height; i++) {
			newBoard.appendChild(this.createNewRow(i, width))
		}
		newBoard.addEventListener("click", e => this.handleClick(e))
		return newBoard
	}
}

document.querySelector("body").appendChild(board.create(10, 10))

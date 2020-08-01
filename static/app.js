const board = {

	// array to hold values representing pixels
	frames: [],

	// event handlers

	handleEvent: function(e) {
		if (e.target.className === "pixel") {
			e.target.setAttribute("class", "white-pixel")
			this.frames[e.target.dataset.frame][e.target.dataset.y][e.target.dataset.x] = 1
		} else if (e.target.className === "white-pixel") {
			e.target.setAttribute("class", "pixel")
			this.frames[e.target.dataset.frame][e.target.dataset.y][e.target.dataset.x] = 0
		} else {
			console.log("Error: target's class name is invalid")
		}
	},	

	// method to create a new pixel in DOM and state
	createNewPixel: function(x, y, frame) {
		this.frames[frame][y].push(0)
		const newPixel = document.createElement("div")
		newPixel.setAttribute("class", "pixel")
		newPixel.setAttribute("data-x", x)
		newPixel.setAttribute("data-y", y)
		newPixel.setAttribute("data-frame", frame)
		return newPixel
	},

	// method to create new row in DOM and state
	createNewRow: function(row, length, frame) {
		this.frames[frame].push([])
		const newRow = document.createElement("div")
		newRow.setAttribute("class", "row")
		for (let i = 0; i < length; i++) {
			newRow.appendChild(this.createNewPixel(i, row, frame))
		}
		return newRow
	},

	// method to initialize the board

	create: function(width, height, frames) {
		for (let i = 0; i < frames; i++) {
			this.frames.push([])
			const newBoard = document.createElement("div")
			if (i === 0) {
				newBoard.setAttribute("class", "board")
			} else {
				newBoard.setAttribute("class", "invisible-board")
			}
			
			for (let j = 0; j < height; j++) {
				newBoard.appendChild(this.createNewRow(j, width, i))
			}
			newBoard.addEventListener("mousedown", e => this.handleEvent(e))
			document.getElementById("board-container").appendChild(newBoard)
		}
	},

	submit: async function() {
		console.log(this.frames)
		// const submitResponse = await fetch("/images/", {
		// 	method: "POST",
		// 	body: JSON.stringify(this.pixels),
		// 	headers: {
		// 		"Content-Type": "application/json"
		// 	}
		// })
		// const submitJson = await submitResponse.json()
		// if (submitJson.status === 200) {
		// 	window.open(`/images/${submitJson.data.image_uuid}`, "_blank")
		// }
	}
}

board.create(10, 10, 10)

document.getElementById("submit-button").addEventListener("click", e => board.submit())

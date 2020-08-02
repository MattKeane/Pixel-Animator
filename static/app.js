// defining Canvas Context

const canvas = document.getElementById("board-canvas")
const ctx = canvas.getContext("2d")

// canvas event handlers



const board = {

	// array to hold values representing pixels
	frames: [],

	// currently selected frame
	selectedFrame: 0,

	// method for drawing a pixel on the canvas
	drawPixel: function(x, y, color) {
		ctx.beginPath()
		ctx.rect(x, y, 20, 20)
		ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
		ctx.fill()
	},

	// method for drawing a row of pixels on the canvas
	drawRow: function(row, pixels) {
		for (let i = 0; i < pixels.length; i++) {
			const color = pixels[i] ? [255, 255, 255] : [0, 0, 0]
			this.drawPixel(i * 20, row * 20, color)
		}
	},

	// method to draw an entire frame
	drawFrame: function(frame) {
		for (let i = 0; i < frame.length; i++) {
			this.drawRow(i, frame[i])
		}
	},


	// method to initialize the board

	create: function(width, height, frames) {
		for (let i = 0; i < frames; i++) {
			this.frames.push([])
			for (let j = 0; j < height; j++) {
				this.frames[i].push([])
				for (let k = 0; k < width; k ++) {
					this.frames[i][j].push(0)
				}
			}
		}
	},

	// event handlers

	submit: async function() {
		const submitResponse = await fetch("/images/", {
			method: "POST",
			body: JSON.stringify(this.frames),
			headers: {
				"Content-Type": "application/json"
			}
		})
		const submitJson = await submitResponse.json()
		if (submitJson.status === 200) {
			window.open(`/images/${submitJson.data.image_uuid}`, "_blank")
		}
	},

	handleSelectChange: function(e) {
		this.selectedFrame = e.target.value
		this.drawFrame(this.frames[this.selectedFrame])
	},

	handleCanvasClick: function(e) {
		const x = Math.floor(e.offsetX / 20)
		const y = Math.floor(e.offsetY / 20)
		this.frames[this.selectedFrame][y][x] = this.frames[this.selectedFrame][y][x] ? 0 : 1
		this.drawFrame(this.frames[this.selectedFrame])
	}
}

board.create(10, 10, 10)

// board.drawPixel(0, 0, [255, 0, 0])
board.drawFrame(board.frames[board.selectedFrame])

// event listeners

canvas.addEventListener("mousedown", e => board.handleCanvasClick(e))
document.getElementById("submit-button").addEventListener("click", e => board.submit())
document.getElementById("frame-select").addEventListener("change", e => board.handleSelectChange(e))

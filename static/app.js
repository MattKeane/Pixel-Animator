// defining Canvas Context

const canvas = document.getElementById("board-canvas")
const ctx = canvas.getContext("2d")

// default values

const defaultNumberOfFrames = 10

const board = {

	// array to hold values representing pixels
	frames: [],

	// currently selected frame
	selectedFrame: 0,

	// current color
	currentColor: "#000000",

	// number of frames the GIF will have
	numberOfFrames: defaultNumberOfFrames,

	// method for drawing a pixel on the canvas
	drawPixel: function(x, y, color) {
		ctx.beginPath()
		ctx.rect(x, y, 20, 20)
		ctx.fillStyle = color
		ctx.fill()
	},

	// method for drawing a row of pixels on the canvas
	drawRow: function(row, pixels) {
		for (let i = 0; i < pixels.length; i++) {
			this.drawPixel(i * 20, row * 20, pixels[i])
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
					this.frames[i][j].push("#000000")
				}
			}
		}
	},

	checkNextPrev: function() {
		document.getElementById("prev-frame").disabled = this.selectedFrame <= 0
		document.getElementById("next-frame").disabled = this.selectedFrame >= this.numberOfFrames - 1
	},

	// event handlers

	submit: async function() {
		const submitResponse = await fetch("/images/", {
			method: "POST",
			body: JSON.stringify(this.frames.slice(0, this.numberOfFrames)),
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
		if (e.target.value > this.numberOfFrames) {
			e.target.value = this.numberOfFrames
		}
		this.selectedFrame = e.target.value - 1
		this.drawFrame(this.frames[this.selectedFrame])
	},

	handleCanvasClick: function(e) {
		const x = Math.floor(e.offsetX / 20)
		const y = Math.floor(e.offsetY / 20)
		this.frames[this.selectedFrame][y][x] = this.currentColor
		this.drawFrame(this.frames[this.selectedFrame])
	},

	handleColorChange: function(e) {
		this.currentColor = e.target.value
	},

	handleFrameTotalChange: function(e) {
		if (e.target.value > 64) {
			e.target.value = 64
		}
		this.numberOfFrames = e.target.value
		if (this.selectedFrame > this.numberOfFrames - 1) {
			this.selectedFrame = this.numberOfFrames - 1
			this.drawFrame(this.frames[this.selectedFrame])
		}
		const currentFrame = document.getElementById("current-frame")
		currentFrame.max = this.numberOfFrames
		currentFrame.value = this.selectedFrame + 1
	},

	handleNextClick: function(e) {
		if (this.selectedFrame < this.numberOfFrames - 1) {
			this.selectedFrame++
			this.drawFrame(this.frames[this.selectedFrame])
		}
		this.checkNextPrev()
	},

	// initialize method

	initialize: function() {
		this.create(10, 10, 64)
		this.drawFrame(this.frames[this.selectedFrame])

		const numberOfFramesInput = document.getElementById("frame-total")
		numberOfFramesInput.value = this.numberOfFrames

		// event listeners

		canvas.addEventListener("mousedown", e => this.handleCanvasClick(e))
		document.getElementById("submit-button").addEventListener("click", e => this.submit())
		document.getElementById("current-frame").addEventListener("change", e => this.handleSelectChange(e))
		document.getElementById("color-select").addEventListener("change", e => this.handleColorChange(e))
		numberOfFramesInput.addEventListener("change", e => this.handleFrameTotalChange(e))
		document.getElementById("next-frame").addEventListener("click", e => this.handleNextClick(e))

		// draw the board

		this.drawFrame(this.frames[this.selectedFrame])
	}
}

board.initialize()

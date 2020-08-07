// defining Canvas Context

const canvas = document.getElementById("board-canvas")
const ctx = canvas.getContext("2d")

// default values

const defaultSettings = {
	numberOfFrames: 10,
	delay: 40
}

const board = {

	// array to hold values representing pixels
	frames: [],

	// currently selected frame
	selectedFrame: 0,

	// current color
	currentColor: "#000000",

	// number of frames the GIF will have
	numberOfFrames: defaultSettings.numberOfFrames,

	// millesecond delay between frames
	delay: defaultSettings.delay,

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
			if (pixels[i]) {
				this.drawPixel(i * 20, row * 20, pixels[i])
			}
		}
	},

	// method to draw an entire frame
	drawFrame: function(frame) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
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
					this.frames[i][j].push(false)
				}
			}
		}
	},

	// method to check if the next and prev buttons should be disabled

	checkNextPrev: function() {
		const isFirstFrame = this.selectedFrame <= 0
		const isLastFrame = this.selectedFrame >= this.numberOfFrames - 1
		document.getElementById("prev-frame").disabled = isFirstFrame
		document.getElementById("prev-copy").disabled = isFirstFrame
		document.getElementById("next-frame").disabled = isLastFrame
		document.getElementById("next-copy").disabled = isLastFrame
	},

	// method to handle changing selectedFrame

	changeSelectedFrame: function(frameNumber) {
		if (frameNumber >= 0 && frameNumber <= this.numberOfFrames - 1) {
			this.selectedFrame = +frameNumber
		}
		this.checkNextPrev()
		document.getElementById("current-frame").value = this.selectedFrame + 1
		this.drawFrame(this.frames[this.selectedFrame])
	},

	// method to copy a given frame number to the current frame

	copyFrame: function(frameNumber) {
		if (this.frames[frameNumber]) {
			this.frames[this.selectedFrame] = JSON.parse(JSON.stringify(this.frames[frameNumber]))
		}
		this.drawFrame(this.frames[this.selectedFrame])
	},

	// interval tick for animations,

	tick: function() {
		if (this.selectedFrame < this.numberOfFrames - 1) {
			this.changeSelectedFrame(+this.selectedFrame + 1)
		} else {
			this.changeSelectedFrame(0)
		}
	},

	// event handlers

	submit: async function() {
		const payload = JSON.stringify({
			"delay": +this.delay,
			"frames": this.frames.slice(0, this.numberOfFrames)
		})
		const submitResponse = await fetch("/images/", {
			method: "POST",
			body: payload,
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
		this.changeSelectedFrame(e.target.value - 1)
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

	handleNextClick: function() {
		this.changeSelectedFrame(+this.selectedFrame + 1)
	},

	handlePrevClick: function() {
		this.changeSelectedFrame(+this.selectedFrame - 1)
	},

	startAnimation: function(e) {
		e.target.disabled = "true"
		document.getElementById("stop-animation").disabled = false
		this.interval = window.setInterval(() => {this.tick()}, this.delay)
	},

	stopAnimation: function(e) {
		window.clearInterval(this.interval)
		e.target.disabled = "true"
		document.getElementById("start-animation").disabled = false
	},

	changeDelay: function(e) {
		if (e.target.value >= 1 && e.target.value <= 2000) {
			this.delay = e.target.value
		} else if (e.target.value < 1) {
			this.delay = 1
		} else {
			this.delay = 2000
		}
		e.target.value = this.delay
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
		document.getElementById("next-frame").addEventListener("click", e => this.handleNextClick())
		document.getElementById("prev-frame").addEventListener("click", e => this.handlePrevClick())
		document.getElementById("prev-copy").addEventListener("click", e => this.copyFrame(this.selectedFrame - 1))
		document.getElementById("next-copy").addEventListener("click", e => this.copyFrame(this.selectedFrame + 1))
		document.getElementById("start-animation").addEventListener("click", e => this.startAnimation(e))
		document.getElementById("stop-animation").addEventListener("click", e => this.stopAnimation(e))
		document.getElementById("delay").addEventListener("change", e => this.changeDelay(e))

		// draw the board

		this.drawFrame(this.frames[this.selectedFrame])
	}
}

board.initialize()

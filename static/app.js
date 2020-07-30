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
	document.querySelector("body").appendChild(newRow)
}

createNewRow(10)

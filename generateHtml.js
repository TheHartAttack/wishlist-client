import fs from "fs"

function html() {
	return `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Dan's Wishlist</title>
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
			</head>
			<body>
				<div id="app"></div>
				${process.env.NODE_ENV == "development" ? '<script src="/bundled.js"></script>' : ""}
			</body>
		</html>
	`
}

const fileName = "./app/index-build-template.html"
const stream = fs.createWriteStream(fileName)
stream.once("open", () => {
	stream.end(html())
})

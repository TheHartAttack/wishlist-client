const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const glob = require("glob")
const Dotenv = require("dotenv-webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const PurgecssPlugin = require("purgecss-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const fse = require("fs-extra")

class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap("Copy files", function () {
			fse.copySync("./app/assets/fonts", "./dist/assets/fonts")
			fse.copySync("./app/assets/images", "./dist/assets/images")
			fse.copySync("./app/favicon.ico", "./dist/favicon.ico")
			fse.copySync("./app/contact.php", "./dist/contact.php")
			fse.copySync("./app/cv.pdf", "./dist/cv.pdf")
		})
	}
}

let cssConfig = {
	test: /\.(css|sass)$/,
	exclude: /(node_modules)/,
	use: [{ loader: "css-loader", options: { url: false } }, "sass-loader"],
}

let config = {
	entry: {
		main: path.resolve(__dirname, "./app/Main.js"),
	},
	output: {
		publicPath: "/",
		path: path.resolve(__dirname, "app"),
		filename: "[name].js",
	},
	plugins: [
		new Dotenv(),
		new HtmlWebpackHarddiskPlugin(),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "app/index.html",
		}),
	],
	mode: "development",
	module: {
		rules: [
			cssConfig,
			{
				test: /\.(woff|woff2|eot|ttf|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader",
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]],
					},
				},
			},
		],
	},
}

if (currentTask == "dev" || currentTask == "webpackDev") {
	cssConfig.use.unshift("style-loader")
	config.devtool = "source-map"
	config.devServer = {
		port: 3000,
		static: path.join(__dirname, "app"),
		hot: true,
		compress: true,
		historyApiFallback: true,
	}
}

if (currentTask == "build" || currentTask == "webpackBuild") {
	config.plugins.push(
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
		new PurgecssPlugin({
			paths: glob.sync(`${path.join(__dirname, "app")}/**/*`, { nodir: true }),
		}),
		new RunAfterCompile()
	)
	cssConfig.use.unshift(MiniCssExtractPlugin.loader)
	config.mode = "production"
	config.output = {
		publicPath: "/",
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[chunkhash].js",
		chunkFilename: "[name].[chunkhash].js",
	}
	config.optimization = {
		splitChunks: { chunks: "all" },
		minimize: true,
		minimizer: [`...`, new CssMinimizerPlugin()],
	}
}

module.exports = config

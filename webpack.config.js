const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Import the plugin

// Base config that applies to either development or production mode.
const config = {
  entry: {
    main: "./src/index.ts", // Default entry for index.html
    landing: "./src/landing/landing.ts", // New entry for landing.html
    quiz: "./src/quiz/quiz.ts", // New entry for landing.html
    difficultySelection: "./src/difficulty-selection/difficulty-selection.ts", // New entry for landing.html
    activitiesBeginner: "./src/activities/beginner/activities-beginner.ts", // New entry for activities-beginner.html
    activitiesIntermediate:
      "./src/activities/intermediate/activities-intermediate.ts", // New entry for activities-intermediate.html
    activitiesAdvanced: "./src/activities/advanced/activities-advanced.ts", // New entry for activities-advanced.html
  },
  output: {
    // Compile the source files into a bundle.
    filename: "[name].bundle.js", // Separate bundles for each entry point
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: "./build",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        // Load CSS files. They can be imported into JS files.
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    // Generate the HTML index page based on our template.
    // This will output the same index page with the bundle we
    // created above added in a script tag.
    new HtmlWebpackPlugin({
      template: "src/index.html",
      chunks: ["main"], // Only include the main chunk for index.html
    }),
    new HtmlWebpackPlugin({
      template: "src/landing/landing.html",
      filename: "landing.html",
      chunks: ["landing"], // Include the landing chunk for landing.html
    }),
    new HtmlWebpackPlugin({
      template: "src/quiz/quiz.html",
      filename: "quiz.html",
      chunks: ["quiz"],
    }),
    new HtmlWebpackPlugin({
      template: "src/difficulty-selection/difficulty-selection.html",
      filename: "difficulty-selection.html",
      chunks: ["difficultySelection"],
    }),
    new HtmlWebpackPlugin({
      template: "src/activities/beginner/activities-beginner.html",
      filename: "activities-beginner.html",
      chunks: ["activitiesBeginner"],
    }),
    new HtmlWebpackPlugin({
      template: "src/activities/intermediate/activities-intermediate.html",
      filename: "activities-intermediate.html",
      chunks: ["activitiesIntermediate"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets/images", to: "assets/images" }, // Copy images to `dist/assets/images`
      ],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    // Set the output path to the `build` directory
    // so we don't clobber production builds.
    config.output.path = path.resolve(__dirname, "build");

    // Generate source maps for our code for easier debugging.
    // Not suitable for production builds. If you want source maps in
    // production, choose a different one from https://webpack.js.org/configuration/devtool
    config.devtool = "eval-cheap-module-source-map";

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [require.resolve("source-map-loader")],
      enforce: "pre",
    });

    // Ignore spurious warnings from source-map-loader
    // It can't find source maps for some Closure modules and that is expected
    config.ignoreWarnings = [/Failed to parse source map/];
  }
  return config;
};

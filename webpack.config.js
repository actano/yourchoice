module.exports = {
    context: __dirname + "/lib",
        entry: "./index.js",
        output: {
            path: __dirname + "/bundle",
            filename: "yourchoice.js",
            libraryTarget: "umd",
            library: "Yourchoice"
        },
        externals: {
            "lodash": "_"
        }
}

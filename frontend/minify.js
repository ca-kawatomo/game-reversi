const UglifyEs = require("uglify-es");
const fs = require("fs");

const files = fs.readdirSync("./dist", { withFileTypes: true });
const scriptFile = files.find(dir => dir.name.endsWith(".js"));
if (!scriptFile) {
    return;
}
const scriptFilePath = `./dist/${scriptFile.name}`;
const script = fs.readFileSync(scriptFilePath, { encoding: "utf-8" })
const minifiedRes = UglifyEs.minify(script);
if (minifiedRes.error) {
    console.error(minifiedRes.error);
    return;
}
fs.writeFileSync(scriptFilePath, minifiedRes.code);
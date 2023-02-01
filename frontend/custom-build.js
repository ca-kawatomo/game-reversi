const UglifyEs = require("uglify-es");
const fs = require("fs");


function minify() {
  const files = fs.readdirSync("./dist", { withFileTypes: true });
  const scriptFile = files.find(dir => dir.name.endsWith(".js"));
  if (!scriptFile) {
      return;
  }
  const scriptFilePath = `./dist/${scriptFile.name}`;
  const script = fs.readFileSync(scriptFilePath, { encoding: "utf-8" });
  const minifiedRes = UglifyEs.minify(script);
  if (minifiedRes.error) {
      console.error(minifiedRes.error);
      return;
  }
  fs.writeFileSync(scriptFilePath, minifiedRes.code);
}
function adjustPath() {
    const htmlPath = "dist/index.html"
    const html = fs.readFileSync(htmlPath, { encoding: "utf-8" })
                .replace(".auth\\login\\github.", ".auth\\login\\github")
                .replace(".auth\\login\\aad.", ".auth\\login\\aad")
                .replace(".auth\\logout.", ".auth\\logout");
    fs.writeFileSync(htmlPath, html);
}

minify();
adjustPath();
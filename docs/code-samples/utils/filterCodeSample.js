const fs = require("fs");
const { marked } = require("marked");
const JSSoup = require("jssoup").default;
const csDirs = "_code-samples";
const skipDirs = ["node_modules", ".git", "__pycache__"];

function sortFunc(cs1, cs2) {
  /* Sort code samples alphabetically by title except with "Intro" fields first
   */
  if (cs1.title.includes("Quickstart") || cs1.title.includes("Intro")) {
    cs1.title = " " + cs1.title;
    return -1;
  } else if (cs1.title < cs2.title) {
    return -1;
  } else if (cs1.title > cs2.title) {
    return 1;
  }
  return 0;
}

export default function getCodeSamples(dir, result = []) {
  // list files in directory and loop through
  const codeSamplesArr = [];
  fs.readdirSync(dir).forEach((csFile) => {
    // builds path of file
    const fPath = dir + "/" + csFile;
    if (fs.statSync(fPath).isDirectory() && !skipDirs.includes(csFile)) {
      const langs = [];
      const cs = {
        href: fPath,
      };
      // loop through each subfolder
      fs.readdirSync(fPath).forEach((file) => {
        const subPath = fPath + "/" + file;
        if (fs.statSync(subPath).isDirectory()) {
          const lang = ["websocket", "json-rpc"].includes(file) ? "http" : file;
          langs.push(lang);
        }
        if (file === "README.md") {
          const data = fs.readFileSync(subPath, "utf-8");
          const soup = new JSSoup(marked.parse(data));
          // find first title
          cs.title = soup.find("h1").text;
          // find first paragragh
          cs.description = soup.find("p").text || "";
        }
        langs.sort();
        cs.langs = langs;
        cs.href = fPath;
      });
      codeSamplesArr.push(cs);
    }
  });
  codeSamplesArr.sort(sortFunc);
  return codeSamplesArr;
}

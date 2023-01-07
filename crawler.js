import * as fs from "fs";
import { JSDOM } from "jsdom";
import { got } from "got";

function crawler(name, url, subpath, title, page) {
  let link = url;
  if (page > 1) {
    link = `${url}${subpath}${page}`;
  }
  got(link).then((v) => {
    const dom = new JSDOM(v.body);
    const nodeList = dom.window.document.querySelectorAll(title);
    for (const el of nodeList) {
      const data = `${el.innerHTML.trim()}\n`.replace("href=\"/", `href="${url}`);
      fs.appendFile(`data/${name}.txt`, data, "utf8", (err) => {
        if (err) {
          throw err;
        }
      });
    }
    crawler(name, url, subpath, title, page + 1);
  });
}

const dir = "data";
fs.mkdir(dir, (err) => {
  if (err && err.code !== "EEXIST") {
    throw err;
  }
});

crawler("matrix67", "http://www.matrix67.com/blog/", "page/", ".entry-title", 1);
crawler("kexue", "https://kexue.fm/category/Mathematics/", "", ".title-wrap h2", 1);
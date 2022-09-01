import React from "react";
import { marked } from "marked";
import JSSOUP from "jssoup";
import preval from "babel-plugin-preval/macro";
import parse from "html-react-parser";

export default function Faq() {
  // read Markdown File
  const markDown = preval`const fs = require("fs");
    module.exports = fs.readFileSync(require.resolve('../../about/_faq.md'), 'utf8')
    `;
  let soup = new JSSOUP(marked.parse(markDown));

  let currentElement = soup.find("h4");
  let formatedHtmls = [];
  const wrapperStart = "<div className='q-wrapper'>";
  const chevronSpan =
    " <span className='chevron'> <span></span><span></span></span>";
  let questionIndex = 0;
  // scan and form HTMLs
  while (currentElement.nextElement) {
    if (currentElement.name === "h4") {
      // add question wrapper
      formatedHtmls.push(wrapperStart);
      const titleHTML = `<h4 id=${currentElement.attrs.id}> <a aria-controls='a${questionIndex}' aria-expanded='false' className='expander collapsed' data-target='#a${questionIndex}' data-toggle='collapse' href='#${currentElement.attrs.id}'>${currentElement.text} ${chevronSpan} </a>`;
      formatedHtmls.push(titleHTML);
    } else if (currentElement.name === "p") {
      formatedHtmls.push(
        `<div id='a${questionIndex}' aria-labelledby='a${questionIndex}' className='answer-wrapper collapse'>`
      );
      formatedHtmls.push(currentElement.toString());
      while (currentElement.nextElement.name === "p") {
        currentElement = currentElement.nextElment;
        formatedHtmls.push(currentElement.toString());
      }
      formatedHtmls.push("</div> </div>");
      questionIndex++;
    } else if (currentElement.name === "h2") {
      formatedHtmls.push(
        `<h2 id='${currentElement.attrs.id}'> ${currentElement.text} <a aria-hidden='true' className='hover_anchor' href='#${currentElement.attrs.id}'/> </h2>`
      );
    }
    currentElement = currentElement.nextElement;
  }
  // clean up spacing
  const formtatedHTMLString = formatedHtmls
    .join("")
    .replaceAll("<a", " <a")
    .replaceAll("a>", "a> ")
    .replaceAll("a> .", "a>.")
    .replaceAll("</code>", " </code>");
  return (
    <div className="page-faq styled-page">
      <div className="content container-new">
        <div className="d-flex-column">
          <h6 className="faq">FAQ</h6>
          <h1 className="your-questions-about-xrpl-answered">
            Your Questions About XRPL, Answered
          </h1>
          {parse(formtatedHTMLString)}
        </div>
      </div>
    </div>
  );
}

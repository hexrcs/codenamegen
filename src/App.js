import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

async function fetchContent() {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_computer_technology_code_names&prop=revisions&rvprop=content&format=json&origin=*";
  return await fetch(url);
}

async function parseContent(contentPromise) {
  return await contentPromise
    .then(resp => resp.json())
    .then(extractWikiPageContent)
    .then(extractBigEntries)
    .then(bigEntries => bigEntries.map(item => extractSingleEntries(item)))
    .then(flattenArray)
    .then(flattenedSingleEntries => flattenedSingleEntries.map(item => parseSingleEntryIntoTuple(item)))
    .then(cleanFalsyInArray)
    .then(tuples => tuples.map(item => item.map(element => cleanNotationOnSingleEntry(element))))
    .catch(console.log);
}

function randomArrayId(arr) {
  return Math.floor(Math.random() * (arr.length - 0 + 1)) + 0;
}

async function selectRandomCodeName(codeNamesPormise) {
  return await codeNamesPormise.then(codeNameArray => codeNameArray[randomArrayId(codeNameArray)]);
}

const codeNamesPormise = parseContent(fetchContent());

logOneCodeName(selectRandomCodeName(codeNamesPormise));

async function logOneCodeName(selectedCodeNamePromise) {
  return await selectedCodeNamePromise.then(codeNameTuple =>
    console.log(`Your new project code name is "${codeNameTuple[0]}". \nIt was also orginally used for ${codeNameTuple[1]}.`)
  );
}

function extractWikiPageContent(rawJSON) {
  const rawPages = rawJSON.query.pages;
  const pageNO = Object.keys(rawPages)[0];
  const pageContent = rawPages[pageNO].revisions[0]["*"];
  return pageContent;
}

function extractBigEntries(rawContent) {
  const RE_BIG_ENTRY = /(==[A-Z]==(\n{{div\s+col\s*(\|\s*(col|cols)\s*=\d+){0,1}\s*}}){0,1}\n)(\n)*(\*.*\n)*({{div col end}})*/g;
  const bigEntries = rawContent.match(RE_BIG_ENTRY);
  return bigEntries;
}

function extractSingleEntries(bigEntry) {
  const RE_SINGLE_ENTRY = /\*\s*(.*)/g;
  const singleEntries = bigEntry.match(RE_SINGLE_ENTRY);
  return singleEntries;
}

function parseSingleEntryIntoTuple(singleEntry) {
  const RE_PARSE = /\*\s*(.*)\s+\u2014\s+(.*)/g;
  const tempArr = RE_PARSE.exec(singleEntry);
  if (tempArr) {
    const codeNameTuple = [tempArr[1], tempArr[2]];
    return codeNameTuple;
  }
}

function cleanNotationOnSingleEntry(dirtyElement) {
  const RE_BRACKETS = /(\[\[)(.*\|)*(.*)(\]\])/g;
  const RE_TAGS = /<.*>.*<.*>/g;
  const noBrackets = dirtyElement.replace(RE_BRACKETS, (match, p1, p2, p3, p4, offset, string) => p3);
  const noTags = noBrackets.replace(RE_TAGS, "");
  const cleanElement = noTags;
  return cleanElement;
}

function cleanFalsyInArray(arr) {
  return arr.filter(Boolean);
}

function flattenArray(arr) {
  return arr.reduce((result, item) => result.concat(item), []);
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

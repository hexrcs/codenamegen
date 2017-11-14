async function fetchContent() {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_computer_technology_code_names&prop=revisions&rvprop=content&format=json&origin=*";
  return await fetch(url);
}

async function parseContent(contentPromise) {
  return await contentPromise
    .then(resp => resp.json())
    .then(extractWikiPageContent)
    .then(extractBigAlphabetSection)
    .then(bigEntries => bigEntries.map(extractSingleEntries))
    .then(flattenArray)
    .then(flattenedSingleEntries => flattenedSingleEntries.map(parseSingleEntryIntoTuple))
    .then(cleanFalsyInArray)
    .then(tuples => tuples.map(item => item.map(cleanNotationOnSingleEntry)))
    .catch(console.log);
}

function randomArrayId(arr) {
  return Math.floor(Math.random() * (arr.length - 0 + 1)) + 0;
}

async function selectRandomCodeName(codeNamesPormise) {
  return await codeNamesPormise.then(codeNameArray => codeNameArray[randomArrayId(codeNameArray)]);
}

async function logOneCodeName(selectedCodeNamePromise) {
  return await selectedCodeNamePromise.then(codeNameTuple =>
    console.log(
      `Your new project code name is "${codeNameTuple[0]}". \nIt was also orginally used for ${codeNameTuple[1]}.`
    )
  );
}

function extractWikiPageContent(rawJSON) {
  const rawPages = rawJSON.query.pages;
  const pageNO = Object.keys(rawPages)[0];
  const pageContent = rawPages[pageNO].revisions[0]["*"];
  return pageContent;
}

function extractBigAlphabetSection(rawContent) {
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

// public functions
async function asyncSelectRandomCodeName() {
  return selectRandomCodeName(codeNamesPormise);
}

async function asyncLogSelectedRandomCodeName() {
  logOneCodeName(selectRandomCodeName(codeNamesPormise));
}

// save those requests by storing loacally
const codeNamesPormise = parseContent(fetchContent());

export { asyncSelectRandomCodeName, codeNamesPormise, asyncLogSelectedRandomCodeName };

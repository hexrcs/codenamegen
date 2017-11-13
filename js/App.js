async function fetchContent() {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_computer_technology_code_names&prop=revisions&rvprop=content&format=json&origin=*";
  const content = await fetch(url)
    .then(resp => resp.json())
    .catch(error => {
      console.log(JSON.stringify(error));
    });
  console.log(content);
  return content;
}

console.log(fetchContent());

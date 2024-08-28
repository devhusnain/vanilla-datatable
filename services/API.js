async function fetchData() {
  const response = await fetch("/data/data.json");
  const data = await response.json();
  return data;
}

export default fetchData;

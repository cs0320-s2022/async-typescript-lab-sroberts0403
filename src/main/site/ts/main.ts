const moon: HTMLInputElement = document.getElementById("moon") as HTMLInputElement;
const sun: HTMLInputElement = document.getElementById("sun") as HTMLInputElement;
const rising: HTMLInputElement = document.getElementById("rising") as HTMLInputElement;
const suggestions: HTMLUListElement = document.getElementById("suggestions") as HTMLUListElement;

sun.addEventListener("change", postAndUpdate)
moon.addEventListener("change", postAndUpdate)
rising.addEventListener("change", postAndUpdate)

type MatchesRequestData = {
  sun: string;
  moon: string;
  rising: string;
}

type Matches = {
  matches: string[];
}
function postAndUpdate(): void {
  suggestions.innerHTML = ""

  const postParameters: MatchesRequestData = {
    sun: sun.value,
    moon: moon.value,
    rising: rising.value
  };

  console.log(postParameters)
  const results: Promise<Response> = fetch("http://localhost:4567/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(postParameters)
  })

  results.then(response => response.json()).then((data: Matches) => updateSuggestions(data.matches));
}

function updateSuggestions(matches: string[]): void {
  matches.forEach((match: string) => {
    suggestions.innerHTML += `<li tabindex="0"> ${ match } </li>`
  })
}
document.addEventListener("keyup", async (e: KeyboardEvent)  => {
  if(e.key == "s"){
    await updateValues("Aries", "Capricorn","Libra");
    postAndUpdate()
  }
});

async function updateValues(sunval: string, moonval: string, risingval: string): Promise<void>{
  await new Promise(resolve => setTimeout(resolve, 1000));

  sun.value = sunval;
  moon.value = moonval;
  rising.value = risingval;
}
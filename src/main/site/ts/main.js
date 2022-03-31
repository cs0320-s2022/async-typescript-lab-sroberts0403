"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const moon = document.getElementById("moon");
const sun = document.getElementById("sun");
const rising = document.getElementById("rising");
const suggestions = document.getElementById("suggestions");
sun.addEventListener("change", postAndUpdate);
moon.addEventListener("change", postAndUpdate);
rising.addEventListener("change", postAndUpdate);
function postAndUpdate() {
    suggestions.innerHTML = "";
    const postParameters = {
        sun: sun.value,
        moon: moon.value,
        rising: rising.value
    };
    console.log(postParameters);
    const results = fetch("http://localhost:4567/matches", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(postParameters)
    });
    results.then(response => response.json()).then((data) => updateSuggestions(data.matches));
}
function updateSuggestions(matches) {
    matches.forEach((match) => {
        suggestions.innerHTML += `<li tabindex="0"> ${match} </li>`;
    });
}
document.addEventListener("keyup", (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (e.key == "s") {
        yield updateValues("Aries", "Capricorn", "Libra");
        postAndUpdate();
    }
}));
function updateValues(sunval, moonval, risingval) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 1000));
        sun.value = sunval;
        moon.value = moonval;
        rising.value = risingval;
    });
}

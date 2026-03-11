import { keywords } from "../data/keywords";
import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("tools");

function hash(input: string): number {
  let value = 5381;
  for (const char of input) {
    value = (value * 33) ^ char.charCodeAt(0);
  }
  return Math.abs(value);
}

const form = document.querySelector<HTMLFormElement>("#keywordForm");
const result = document.querySelector<HTMLElement>("#keywordResult");
const owner = document.querySelector<HTMLElement>("#keywordOwner");
const word = document.querySelector<HTMLElement>("#keywordWord");
const description = document.querySelector<HTMLElement>("#keywordDescription");
const input = document.querySelector<HTMLInputElement>("#keywordName");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input?.value.trim() ?? "";
  if (!name) return;
  const pick = keywords[hash(name) % keywords.length];
  if (!pick || !result || !owner || !word || !description) return;
  owner.textContent = name;
  word.textContent = pick.word;
  description.textContent = pick.description;
  result.hidden = false;
});

document.querySelector<HTMLButtonElement>("#resetKeywordButton")?.addEventListener("click", () => {
  if (input) input.value = "";
  if (result) result.hidden = true;
});

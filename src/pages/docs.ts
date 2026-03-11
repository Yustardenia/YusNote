import { docCards } from "../data/site";
import { initAppShell } from "../lib/base";
import "../styles/global.css";

initAppShell("docs");

const grid = document.querySelector<HTMLElement>("#docsGrid");

if (grid) {
  grid.innerHTML = docCards
    .map(
      (card) => `
        <a class="doc-card" href="${card.href}">
          <span class="card-kicker">${card.kicker}</span>
          <h3 class="card-title">${card.title}</h3>
          <p class="card-copy">${card.copy}</p>
          <span class="card-footer">${card.footer}</span>
        </a>
      `
    )
    .join("");
}

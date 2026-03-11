import { docCards } from "../data/site";
import { initAppShell } from "../lib/base";
import { renderIcon } from "../lib/icons";
import "../styles/global.css";

initAppShell("docs");

const grid = document.querySelector<HTMLElement>("#docsGrid");

if (grid) {
  grid.innerHTML = docCards
    .map(
      (card) => `
        <a class="doc-card" href="${card.href.replace("./docs/", "./")}">
          <div class="card-cover" style="background-image: url('${card.coverAsset}')"></div>
          <div class="card-body">
            <span class="card-kicker">${card.kicker}</span>
            <div class="card-headline">
              ${renderIcon(card.iconId, "card-lead-icon")}
              <h3 class="card-title">${card.title}</h3>
            </div>
            <p class="card-copy">${card.copy}</p>
            <div class="card-tags">${card.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}</div>
            <span class="card-footer">${card.footer}</span>
          </div>
        </a>
      `
    )
    .join("");
}

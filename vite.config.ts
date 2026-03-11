import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        todo: resolve(__dirname, "tools/todo.html"),
        schedule: resolve(__dirname, "tools/schedule.html"),
        kanban: resolve(__dirname, "tools/kanban.html"),
        focus: resolve(__dirname, "tools/focus.html"),
        creative: resolve(__dirname, "tools/creative.html"),
        compare: resolve(__dirname, "tools/compare.html"),
        rename: resolve(__dirname, "tools/rename.html"),
        keyword: resolve(__dirname, "tools/keyword.html"),
        divination: resolve(__dirname, "tools/divination.html"),
        game: resolve(__dirname, "tools/game.html"),
        docs: resolve(__dirname, "docs/index.html"),
        guide: resolve(__dirname, "docs/guide.html"),
        unityUi: resolve(__dirname, "docs/unity-ui.html"),
        audioSystem: resolve(__dirname, "docs/audio-system.html"),
        willOfTheCity: resolve(__dirname, "docs/will-of-the-city.html"),
        notFound: resolve(__dirname, "404.html")
      }
    }
  }
});

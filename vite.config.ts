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
        gamejam: resolve(__dirname, "tools/gamejam.html"),
        notFound: resolve(__dirname, "404.html")
      }
    }
  }
});

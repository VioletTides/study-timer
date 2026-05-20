const { defineConfig } = require("@vue/cli-service");

const publicPath =
  process.env.VUE_APP_PUBLIC_PATH ||
  (process.env.NODE_ENV === "production" ? "/projects/timer/demo/" : "/");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
});

module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        // prependData: `@import "@/assets/hotcss/px2rem.scss";`
        prependData: `@import "@/assets/main.scss";`
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8889",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api", // rewrite path
          "^/server": "/server"
        }
      }
    }
  }
};

module.exports = {
  plugins: [
    require("autoprefixer")({ grid: true }),
    require("postcss-sorting")({
      "properties-order": ["margin", "padding", "border", "background"],
    }),
  ],
};

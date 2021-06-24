module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer')({ grid: true }),
    require('postcss-sorting')({
      'properties-order': ['margin', 'padding', 'border', 'background'],
    }),
  ],
};

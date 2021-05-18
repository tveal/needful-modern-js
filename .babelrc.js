module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '14',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ],
  env: {
    test: {
      plugins: [
        'istanbul',
      ],
    },
  },
};

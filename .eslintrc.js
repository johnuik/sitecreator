module.exports = {
  overrides: [
    {
      files: ["src/wasm/pkg/*.js"],
      env: {
        browser: true,
        es2021: true,
      },
      rules: {
        "no-undef": "off",
        "no-restricted-globals": "off",
      },
    },
  ],
};

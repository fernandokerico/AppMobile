// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-flow', // Esta linha é importante para o erro Flow
      'babel-preset-expo',
    ],
  };
};
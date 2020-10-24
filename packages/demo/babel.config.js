module.exports = function (api) {
  api.cache(true);

  return {
    presets: [require('@babel/preset-typescript')],
    plugins: [
      [
        /*
        require('babel-plugin-transform-jsx2'),
        /*/
        require('@babel/plugin-transform-react-jsx'),
        //*/
        {
          pragma: 'createElement',
          pragmaFrag: 'Fragment',
          pragmaTemplate: 'templateResult',
        },
      ],
    ],
  };
};

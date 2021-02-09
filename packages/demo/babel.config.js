module.exports = function (api) {
  api.cache(true);

  return {
    presets: [require('@babel/preset-typescript')],
    plugins: [
      [
        //*
        require('babel-plugin-transform-jsx2'),
        {
          json: false,
          minimalJson: false,
          taggedTemplate: false,
          prettyJson: false,
          templateBlocks: false,
        },
        /*/
        require('@babel/plugin-transform-react-jsx'),
        {
          pragma: 'createElement',
          pragmaFrag: 'Fragment',
          pragmaTemplate: 'templateResult',
        },
        //*/
      ],
    ],
  };
};

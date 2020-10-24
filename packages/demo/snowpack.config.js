module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
    '../jsx2/src': '/jsx2'
  },
  plugins: [
    '@snowpack/plugin-babel',
  ],
};

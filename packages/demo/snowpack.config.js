module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
    '../jsx2/src': '/jsx2'
  },
  devOptions: {
    hmr: false,
  },
  plugins: [
    '@snowpack/plugin-babel',
  ],
};

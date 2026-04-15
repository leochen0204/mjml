module.exports = ({ config }) => {
  return {
    ...config,
    devServer: {
      ...config.devServer,
      liveReload: false,
      static: {
        directory: './',
        publicPath: '/',
        staticOptions: {
          setHeaders: (res, filePath) => {
            if (filePath.endsWith('.mjml')) {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }
          },
        },
      },
    },
  };
};

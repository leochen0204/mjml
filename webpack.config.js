module.exports = ({ config }) => {
  return {
    ...config,
    devServer: {
      ...config.devServer,
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

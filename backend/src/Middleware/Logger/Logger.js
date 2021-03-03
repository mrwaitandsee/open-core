
export default class Logger {
  constructor(app) {
    app.use((req, res, next) => {
      var uri = req.protocol + '://' + req.get('host') + req.originalUrl;
      console.log();
      console.log('method:', req.method);
      console.log('timestamp:', new Date())
      console.log('uri:', uri);
      console.log('params:', req.params);
      console.log('body:', req.body);
      console.log('headers:', req.headers);
      next();
    });
    console.log('Logging middleware has been created');
    console.log();
  }
}

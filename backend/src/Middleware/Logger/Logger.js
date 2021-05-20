
export default class Logger {
  constructor(app) {
    app.use((req, res, next) => {
      const uri = req.protocol + '://' + req.get('host') + req.originalUrl;
      const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log();
      console.log('method:', req.method);
      console.log('timestamp:', new Date())
      console.log('uri:', uri);
      console.log('params:', req.params);
      console.log('body:', req.body);
      console.log('headers:', req.headers);
      console.log('remoteAddress:', remoteAddress);
      next();
    });
    console.log('Logging middleware has been created');
    console.log();
  }
}

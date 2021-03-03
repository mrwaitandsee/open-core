import Configuration from '../../Configuration';
import jwt from 'jsonwebtoken';

export default class Authentication {
  constructor(app) {
    app.use('/api/militarized-zone', async (req, res, next) => {
      try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.sendStatus(403);
        const token = authHeader.split(' ')[1];
        //Bearer TOKEN
        if (!token) {
          return res.sendStatus(401);
        } else {
          const user = await jwt.verify(token, Configuration.getJwtSecret());
          req.user = user;
        }
        next();
      } catch(err) {
        return res.sendStatus(401);
      }
    });
    console.log('Authentication middleware has been created');
    console.log();
  }
}

import Application from './Core/Application';

import Configuration from './Configuration';
import RoutesBuilder from './Service/RoutesBuilder';
import * as components from './Component';

import Logger from './Middleware/Logger';
import Authentication from './Middleware/Authentication';

new Application(async (app) => {
  new Logger(app);
  new Authentication(app);

  new RoutesBuilder(app, components);
  console.log();
}, Configuration.getPortOfApp());

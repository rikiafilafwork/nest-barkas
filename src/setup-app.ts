import { ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
  app.use(cookieSession({ keys: ['secret'] }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};

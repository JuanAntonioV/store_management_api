import { promises as fs } from 'fs';
import { DateTime } from 'luxon';

export function log(message: string, ...rest: string[]) {
  console.log(message, ...rest);

  const nowDate = DateTime.now().toISODate();
  const logMessage = `${nowDate} - ${message} - ${rest.join(' - ')}\n`;

  // check if logs directory exists
  fs.mkdir('logs', { recursive: true })
    .then(() => {
      fs.appendFile('logs/app.log', logMessage);
    })
    .catch((err) => {
      console.error(err);
    });
}

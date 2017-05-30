/** @flow
 * @briskhome
 * └core.db <lib/core.db/index.js>
 */

import mongoose from 'mongoose';
import { resources } from '../utilities/resources';
import type { CoreImports, CoreRegister } from '../types/coreTypes';

export default (options: Object, imports: CoreImports, register: CoreRegister) => {
  const { database, hostname, username, password } = options;
  const credentials = password ? `${username}:${password}` : username || '';
  const log = imports.log();

  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${credentials}@${hostname}/${database}`);
  mongoose.connection.on('error', (err) => {
    log.fatal({ err, hostname, database, username }, 'Error establishing connection to MongoDB instance');
    return register(err);
  });

  mongoose.connection.on('connecting', () => {
    log.debug({ hostname, database, username, password }, 'Trying to connect to MongoDB instance');
  });

  mongoose.connection.once('connected', () => {
    log.info({ hostname, database, username }, 'Database connection established');
    resources('models', [mongoose]);

    return register(null, { db: mongoose });
  });

  mongoose.connection.on('disconnecting', () => {
    log.debug({ hostname, database, username }, 'Disconnecting from MongoDB instance');
  });

  mongoose.connection.on('disconnected', () => {
    log.info({ hostname, database, username }, 'Disconnected from MongoDB instance');
  });

  mongoose.connection.on('reconnected', () => {
    log.info({ hostname, database, username }, 'Reconnected to MongoDB instance');
  });
};

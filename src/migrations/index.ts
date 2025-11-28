import * as migration_20251127_053224_initial from './20251127_053224_initial';
import * as migration_20251127_231151_initial from './20251127_231151_initial';
import * as migration_20251127_231214_new from './20251127_231214_new';

export const migrations = [
  {
    up: migration_20251127_053224_initial.up,
    down: migration_20251127_053224_initial.down,
    name: '20251127_053224_initial',
  },
  {
    up: migration_20251127_231151_initial.up,
    down: migration_20251127_231151_initial.down,
    name: '20251127_231151_initial',
  },
  {
    up: migration_20251127_231214_new.up,
    down: migration_20251127_231214_new.down,
    name: '20251127_231214_new'
  },
];

/** @flow
 * @briskhome
 * └core <lib/components.js>
 */

import fs from 'fs';
import path from 'path';

import type { PackageJson } from './utilities/coreTypes';

export const components = (directories?: Array<string> = ['./lib', './node_modules'])
  : Array<string> => [].concat(...directories.map(directory => fs.readdirSync(directory)
  .filter(subdirectory => (directory === './lib'
    ? fs.statSync(path.resolve(directory, subdirectory)).isDirectory()
      && subdirectory.indexOf('core.') === 0
    : fs.statSync(path.resolve(directory, subdirectory)).isDirectory()
      && subdirectory.indexOf('briskhome-') === 0))
  .map(subdirectory => path.resolve(directory, subdirectory))));

export const inspectComponent = (directory: string)
  : PackageJson =>
  JSON.parse(String(fs.readFileSync(path.resolve(directory, 'package.json'))));

export const enabledComponents = (directories?: Array<string>)
  : Array<string> => components(directories)
  .filter(directory =>
    inspectComponent(directory).plugin && !inspectComponent(directory).plugin.disabled);

export const disabledComponents = (directories?: Array<string>)
  : Array<string> => components(directories)
  .filter(directory =>
    inspectComponent(directory).plugin && inspectComponent(directory).plugin.disabled);

export const enableComponent = (directory: string)
  : boolean => !!disabledComponents()
  .filter((component) => {
    if (component.includes(directory)) {
      const payload = JSON.parse(String(fs.readFileSync(path.resolve(component, 'package.json'))));
      payload.plugin.disabled = false;
      fs.writeFileSync(path.resolve(component, 'package.json'), JSON.stringify(payload, null, 2));
      return true;
    }
    return false;
  }).length;

export const disableComponent = (directory: string)
  : boolean => !!enabledComponents()
  .filter((component) => {
    if (component.includes(directory)) {
      const payload = JSON.parse(String(fs.readFileSync(path.resolve(component, 'package.json'))));
      payload.plugin.disabled = true;
      fs.writeFileSync(path.resolve(component, 'package.json'), JSON.stringify(payload, null, 2));
      return true;
    }
    return false;
  }).length;
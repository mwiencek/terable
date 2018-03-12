/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {UNIQ} from './Terable';

const uniq = <T>(iterable: Iterable<T>): Iterable<T> =>
  new Terable(UNIQ, {set: new Set()}, iterable);

export default uniq;

/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {UNIQBY} from './constants';
import makeTerable from './Terable';
import type {IterableExt, Terable} from './types';

export default function uniqBy<T, U>(func: (T) => U): (IterableExt<T>) => Terable<T> {
  return function (iterable: IterableExt<T>): Terable<T> {
    return makeTerable({type: UNIQBY, arg: {mapper: func, set: new Set()}, source: iterable});
  };
}

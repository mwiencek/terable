/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {FILTER} from './constants';
import makeTerable from './Terable';

export default function filter<T, U>(test: (T | U) => mixed): Iterable<T | U> => Iterable<U> {
  return function (iterable: Iterable<T | U>): Iterable<U> {
    return makeTerable({type: FILTER, arg: test, source: iterable});
  };
}

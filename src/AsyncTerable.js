/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {
  DONE,
  NO_VALUE,
  DROP,
  FILTER,
  MAP,
  TAKE,
  UNIQ,
  UNIQBY,
} from './constants';
import {Terable} from './Terable';

export function AsyncTerable(action) {
  Terable.call(this, action);
}

AsyncTerable.prototype = Object.assign({}, Terable.prototype);

AsyncTerable.prototype[Symbol.asyncIterator] = function () {
  return this;
};

delete AsyncTerable.prototype[Symbol.iterator];

AsyncTerable.prototype.next = async function () {
  if (this.done) {
    return DONE;
  }

  // Reproduce Babel's for...of semantics.
  let iteratorNormalCompletion = true;
  let iteratorError = NO_VALUE;

  try {
    if (!this.iterator) {
      const head = this.pipe[0];
      this.iterator = head.source[Symbol.asyncIterator]();
      head.source = null;
    }

    let cursor;
    while ((iteratorNormalCompletion = true) &&
            !this.done &&
            (!(iteratorNormalCompletion = (cursor = await this.iterator.next()).done))) {
      const value = this.pipeValue(cursor.value);
      if (value === NO_VALUE) {
        continue;
      }
      iteratorNormalCompletion = true;
      return {value: value, done: false};
    }
  } catch (err) {
    iteratorError = err;
  } finally {
    try {
      if (!iteratorNormalCompletion || this.done) {
        await this.return();
      }
    } finally {
      if (iteratorError !== NO_VALUE) {
        this._destroy();
        throw iteratorError;
      }
    }
  }

  this._destroy();
  return DONE;
};

AsyncTerable.prototype.return = async function () {
  const iterator = this.iterator;
  this._destroy();
  if (iterator && iterator.return) {
    await iterator.return();
  }
  return DONE;
};

export default function makeAsyncTerable(action) {
  const source = action.source;
  if (source instanceof AsyncTerable) {
    source.pipe.push(action);
    return source;
  }

  return new AsyncTerable(action);
}

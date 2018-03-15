import {
  compose,
  concat,
  head,
  map,
  take,
  toArray,
} from '../';
import {spyFactory, badMap} from './util';

test('take', () => {
  const iterable = take(2)([1, 2, 3]);
  expect(toArray(iterable)).toEqual([1, 2]);

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({value: 2, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(take(1));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);

  expect(
    compose(
      toArray,
      take(3),
      concat,
    )([[1], [[2, 3], [4]], [5]])
  ).toEqual([1, [2, 3], [4]]);

  expect(
    compose(
      toArray,
      take(3),
      concat,
      take(2),
      concat,
    )([
      [[1, 2], [3]],
      [[4, 5], [6]],
    ])
  ).toEqual([1, 2, 3]);

  expect(
    compose(
      toArray,
      take(4),
      concat,
      head,
    )([[[1], [2], [3]], [[4]]])
  ).toEqual([1, 2, 3]);

  const concatSpy = spyFactory(concat);
  expect(compose(toArray, take(0), concatSpy)([[0]])).toEqual([]);
  expect(concatSpy.calls).toBe(0);

  let calls = 0;
  let plus1 = map(x => { calls++; return x + 1 });
  let take0 = take(0);
  let take1 = take(1);
  let take3 = take(3);
  let take4 = take(4);
  let array = [1, 2, 3];

  expect(compose(toArray, plus1, take0)(array)).toEqual([]);
  expect(compose(toArray, plus1, take0, take3)(array)).toEqual([]);
  expect(compose(toArray, plus1, take3, take0)(array)).toEqual([]);
  expect(compose(toArray, take0, plus1)(array)).toEqual([]);
  expect(compose(toArray, take0, plus1, take3)(array)).toEqual([]);
  expect(compose(toArray, take0, take3, plus1)(array)).toEqual([]);
  expect(compose(toArray, take3, plus1, take0)(array)).toEqual([]);
  expect(compose(toArray, take3, take0, plus1)(array)).toEqual([]);

  expect(calls).toBe(0);

  let result;
  result = compose(toArray, plus1, take1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(1);

  result = compose(toArray, plus1, take1, take3)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(2);

  result = compose(toArray, plus1, take4, take1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(3);

  result = compose(toArray, take1, plus1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(4);

  result = compose(toArray, take1, plus1, take4)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(5);

  result = compose(toArray, take1, take4, plus1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(6);

  result = compose(toArray, take4, plus1, take1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(7);

  result = compose(toArray, take4, take1, plus1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(8);
});

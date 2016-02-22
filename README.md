### Library

* `asyncOp` - Simulates an asynchronous operation. Accepts a value `input` which is printed before and after the asynchronous operation.
* `RandStream` - Extends `stream.Readable`. Generates a stream of random characters from the following character set:
```
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.
```

## 1. Asynchronous Operations

Create a function `doAsync` which accepts an array as input. Each element in the array can be either of type `String` or `[String]`.

#### Example Input
```js
[
  'A',
  [ 'B', 'C', 'D', 'E' ],
  'F',
  'G',
  [ 'H', 'I' ]
]
```

`doAsync` should apply `asyncOp` for all elements in the input array. Each application of `asyncOp` should be either executed in series or parallel depending on how the elements are arranged. If the elements are bundled together in an array, then `asyncOp` will be applied in these elements in parallel.

##### Example Usage
```js
let input = [
  'A',
  [ 'B', 'C' ],
  'D'
]

doAsync(input);
```

##### Example Output
```
START: A
FINISH: A
START: B
START: C
FINISH: C
FINISH: B
START: D
FINISH: D
```

## 2. Streams

Create a class `RandStringSource` which accepts an instance of the class `RandStream`. `RandStringSource` should be a subclass of `events.EventEmitter`.

Given the stream of random characters generated by `RandStream`, `RandStringSource` should emit an event `data` whenever a string enclosed by `.` is  detected. The enclosed string should be used as payload in the `data` event.

##### Example Usage
```js
let source = new RandStringSource(new RandStream());

source.on('data', (data) => {
  console.log(data);
})
```

##### Example Output
```batch
CHUNK: gh82Ad.AJK092shLKmb
CHUNK: lkg.6294fjsk.5..642ksLMMD0g
AJK092shLKmblkg
6294fjsk
5
CHUNK: kms.zenoan.
642ksLMMD0gkms
zenoan
```

## 3. Resource Pooling

Create a class `ResourceManager` which accepts an integer `count` as input. `ResourceManager` should manage a limited number of `resource` objects. The maximum number of `resource` objects that can be created is determined by `count`.

`ResourceManager` should implement a function `borrow` which accepts a callback as parameter. The `borrow` function should *reserve* a resource object and pass it to the caller through the callback. A `resource` object can never be acquired by other `borrowers` until the `release` function is called.

##### Example Usage
```js
let pool = new ResourcePool(2);
console.log('START');
pool.borrow((res) => {
  console.log('RES: 1');

  setTimeout(() => {
    res.release();
  }, 500);

  console.log('throttled');
});
pool.borrow((res) => {
  console.log('RES: 2');
});
pool.borrow((res) => {
  console.log('RES: 3');
});
```

##### Example Output
```batch
START
RES: 1
RES: 2
throttled
RES: 3
```

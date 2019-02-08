'use strict';

const events = require('events');

const { asyncOp, RandStream } = require('./lib/lib');

const flatten = data => 
  data.reduce((acculmulator, current) => 
    acculmulator.concat(Array.isArray(current)
      ? flatten(current)
      : current
    ),
    []
  );
const firstStart = data =>
  data.map(datum => asyncOp(datum));

/**
 * Solution #1 Asynchronous Operations
 * 
 * @param {*} arr 
 */
const doAsync = async data => {
  for (const datum of data) {
    if (Array.isArray(datum)) {
      const flattenedData = flatten(datum);
      
      const promise = firstStart(flattenedData);
      
      await Promise.all(promise);

      continue;
    }
    await asyncOp(datum);
  }
};

/* let input = [
  'A',
  [ 'B', 'C', [ 
    'D', 'E', [
      'F', 'G',
    ],
  ]],
  'H',
  [ 'I', 'J' ],
];

console.log(doAsync(input)); */

/**
 * Solution #2 Streams
 */
class RandStringSource extends events.EventEmitter {
  constructor(readable) {
    super();
    
    this.readable = readable

    this.log();
  }

  delayedEmit(ref, word) {
    setTimeout(() => {
      this.emit('data', word, ref);
    }, Math.random * 1000);
  }

  log() {
    this.readable.on('data', chunk => {
      const words = this._toWords(chunk).map(this._removeDots);

      words.forEach(this.delayedEmit.bind(this, chunk));
    })
  }

  _removeDots(chunk) {
    return chunk.replace(/\./g, "");
  }

  _toWords(chunk) {
    return chunk.match(/(?<=\.)([^.]+)(?=\.)/g) || [];
  }
}

/* const source = new RandStringSource(new RandStream());

source.on('data', data => {
  console.log(data);
}); */

/**
 * Solution #3 Resource Pooling
 */
class Resource extends events.EventEmitter {
  release() {  
    this.emit('release');
  }
}

class ResourceManager {
  constructor(count){
    this.queued = [];
    this.resources = this._instantiateResources(count);
  }

  borrow(callback){
    if (!this.resources.length) {
      return this.queued.push(callback);
    }

    const resource = this.resources.pop();

    callback(resource);
  }

  _instantiateResources(count) {
    const resources = [];

    for (let index = 0; index < count; index++) {
      const resource = new Resource();

      resource.on('released', () => {
        const callback = this.queued.shift() || (() => { });
        callback(resource);
      });

      resources.push(resource);
    }

    return resources;
  }
}

/* let pool = new ResourceManager(2);
console.log('START');

let timestamp = Date.now();

pool.borrow((res) => {
  console.log('RES: 1');

  setTimeout(() => {
    res.release();
  }, 500);
});

pool.borrow((res) => {
  console.log('RES: 2');
});

pool.borrow((res) => {
  console.log('RES: 3');
  console.log('DURATION: ' + (Date.now() - timestamp));
}); */
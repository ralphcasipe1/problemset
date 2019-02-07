'use strict';

const events = require('events');

const { asyncOp, RandStream } = require('./lib/lib');

/**
 * Solution #1 Asynchronous Operations
 * 
 * @param {*} arr 
 */
const doAsync = async arr => {
  for (const element of arr) {
    if (Array.isArray(element)) {
      const promise = element.map(el => asyncOp(el));

      await Promise.all(promise);

      continue;
    }

    await asyncOp(element);
  }
};

// console.log(doAsync(input)); 

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

const source = new RandStringSource(new RandStream());

source.on('data', data => {
  console.log(data);
});

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
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


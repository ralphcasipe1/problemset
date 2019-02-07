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


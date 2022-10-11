const { postEvent, Events } = require('./events');
const fs = require('fs');
const util = require('util');
function debug(...args) {
  fs.writeFileSync(1, `${util.format(...args)}\n`, { flag: 'a' });
}
const asyncIdToResource = {};
const init = (asyncId, type, triggerAsyncId, resource) => {
  debug(`asyncId:${asyncId}, type:${type}, taid:${triggerAsyncId}, resource:`,resource);
  asyncIdToResource[asyncId] = resource;
  if (type === 'PROMISE') {
    postEvent(Events.InitPromise(asyncId, triggerAsyncId));
  }
  if (type === 'Timeout') {
    const callbackName = resource._onTimeout.name || 'anonymous';
    const idleTimeout = resource._idleTimeout || 0;
    postEvent(Events.InitTimeout(asyncId, callbackName, idleTimeout));
  }
  if (type === 'Immediate') {
    const callbackName = resource._onImmediate.name || 'anonymous';
    postEvent(Events.InitImmediate(asyncId, callbackName));
  }
  if (type === 'Microtask') {
    const callbackName = resource.callback?.name || 'anonymous';
    debug('Microtask: ', resource);
    postEvent(Events.InitMicrotask(asyncId, triggerAsyncId, callbackName));
  }
  if (
    type === 'TickObject' &&
    resource.callback.name !== 'maybeReadMore_' &&
    resource.callback.name !== 'afterWriteTick' &&
    resource.callback.name !== 'onSocketNT' &&
    resource.callback.name !== 'initRead' &&
    resource.callback.name !== 'emitReadable_' &&
    resource.callback.name !== 'emitCloseNT' &&
    resource.callback.name !== 'endReadableNT' &&
    resource.callback.name !== 'finish' &&
    resource.callback.name !== 'resume_'
  ) {
    const callbackName = resource?.callback?.name || 'microtask';
    debug(callbackName);
    postEvent(Events.InitMicrotask(asyncId, triggerAsyncId, callbackName));
  }
};

const before = (asyncId) => {
  const resource = asyncIdToResource[asyncId] || {};
  const resourceName = resource.constructor.name;
  if (resourceName === 'Promise') {
    postEvent(Events.BeforePromise(asyncId));
  }
  if (resourceName === 'Timeout') {
    const callbackName = resource._onTimeout.name || 'anonymous';
    postEvent(Events.BeforeTimeout(asyncId, callbackName));
  }
  if (resourceName === 'Immediate') {
    const callbackName = resource._onImmediate.name || 'anonymous';
    postEvent(Events.BeforeImmediate(asyncId, callbackName));
  }
  // if (
  //   resourceName === 'Object' &&
  //   resource.callback &&
  //   resource.callback.name !== 'maybeReadMore_' &&
  //   resource.callback.name !== 'afterWriteTick' &&
  //   resource.callback.name !== 'onSocketNT' &&
  //   resource.callback.name !== 'initRead' &&
  //   resource.callback.name !== 'emitReadable_' &&
  //   resource.callback.name !== 'emitCloseNT' &&
  //   resource.callback.name !== 'endReadableNT' &&
  //   resource.callback.name !== 'finish' &&
  //   resource.callback.name !== 'resume_'
  // ) {
  //   const callbackName = resource.callback.name || 'anonymous';
  //   postEvent(Events.BeforeMicrotask(asyncId, callbackName));
  // }
  if (resourceName === 'AsyncResource') {
    postEvent(Events.BeforeMicrotask(asyncId));
  }
};

const after = (asyncId) => {
  const resource = asyncIdToResource[asyncId] || {};
  const resourceName = resource.constructor.name;
  if (resourceName === 'Promise') {
    postEvent(Events.AfterPromise(asyncId));
  }
  if (resourceName === 'AsyncResource') {
    postEvent(Events.AfterMicrotask(asyncId));
  }
};

const destroy = (asyncId) => {
  const resource = asyncIdToResource[asyncId] || {};
};

const promiseResolve = (asyncId) => {
  const promise = asyncIdToResource[asyncId].promise;
  postEvent(Events.ResolvePromise(asyncId));
};

module.exports = { init, before, after, destroy, promiseResolve };

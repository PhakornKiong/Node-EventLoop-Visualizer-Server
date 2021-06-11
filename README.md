# Node.js EventLoop Visualizer Server

Good Read on Node.js Event Loop [here](https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810)

Produces events for code submitted by https://node-event-loop.herokuapp.com/. The repo for the client is [here](https://github.com/Darkripper214/Node-EventLoop-Visualizer-Client).

Notable Feature Added:
+ Support Node.js native API such as `setImmediate` & `process.nextTick`
+ Support `async-await`
+ Uses Babel plugin to traverse AST and transform code

Improvement based on work from [Hopding](https://github.com/Hopding/). & [Loupe](http://latentflip.com/loupe/).


For example, upon receiving this input code:

```js
function logA() {
  console.log('A');
}
function logB() {
  console.log('B');
}
function logC() {
  console.log('C');
}
function logD() {
  console.log('D');
}

// Click the "RUN" button to learn how this works!
logA();
setTimeout(logB, 0);
Promise.resolve().then(logC);
logD();

```

The server logs the following:

```JSON
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":0,"name":"logA","start":0,"end":41}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":1,"name":"console.log","start":21,"end":32}}
Worker MESSAGE: {"type":"ConsoleLog","payload":{"message":"A\n"}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":2,"name":"console.log","start":21,"end":32}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":3,"name":"logA","start":0,"end":41}}
Worker MESSAGE: {"type":"InitTimeout","payload":{"asyncID":5,"name":"logB","idleTimeout":1}}
Worker MESSAGE: {"type":"InitPromise","payload":{"asyncID":6,"parentId":2}}
Worker MESSAGE: {"type":"ResolvePromise","payload":{"asyncID":6}}
Worker MESSAGE: {"type":"InitPromise","payload":{"asyncID":7,"parentId":6}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":4,"name":"logD","start":129,"end":170}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":5,"name":"console.log","start":150,"end":161}}
Worker MESSAGE: {"type":"ConsoleLog","payload":{"message":"D\n"}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":6,"name":"console.log","start":150,"end":161}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":7,"name":"logD","start":129,"end":170}}
Worker MESSAGE: {"type":"BeforePromise","payload":{"asyncID":7}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":8,"name":"logC","start":86,"end":127}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":9,"name":"console.log","start":107,"end":118}}
Worker MESSAGE: {"type":"ConsoleLog","payload":{"message":"C\n"}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":10,"name":"console.log","start":107,"end":118}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":11,"name":"logC","start":86,"end":127}}
Worker MESSAGE: {"type":"ResolvePromise","payload":{"asyncID":7}}
Worker MESSAGE: {"type":"AfterPromise","payload":{"asyncID":7}}
Worker MESSAGE: {"type":"BeforeTimeout","payload":{"asyncID":5,"name":"logB"}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":12,"name":"logB","start":43,"end":84}}
Worker MESSAGE: {"type":"EnterFunction","payload":{"funcID":13,"name":"console.log","start":64,"end":75}}
Worker MESSAGE: {"type":"ConsoleLog","payload":{"message":"B\n"}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":14,"name":"console.log","start":64,"end":75}}
Worker MESSAGE: {"type":"ExitFunction","payload":{"funcID":15,"name":"logB","start":43,"end":84}}
Worker EXIT: 0
[
  '{"type":"EnterFunction","payload":{"funcID":0,"name":"logA","start":0,"end":41}}',
  '{"type":"EnterFunction","payload":{"funcID":1,"name":"console.log","start":21,"end":32}}',
  '{"type":"ConsoleLog","payload":{"message":"A\\n"}}',
  '{"type":"ExitFunction","payload":{"funcID":2,"name":"console.log","start":21,"end":32}}',
  '{"type":"ExitFunction","payload":{"funcID":3,"name":"logA","start":0,"end":41}}',
  '{"type":"InitTimeout","payload":{"asyncID":5,"name":"logB","idleTimeout":1}}',
  '{"type":"InitPromise","payload":{"asyncID":6,"parentId":2}}',
  '{"type":"ResolvePromise","payload":{"asyncID":6}}',
  '{"type":"EnqueueMicrotask","payload":{"name":"logC"}}',
  '{"type":"InitPromise","payload":{"asyncID":7,"parentId":6}}',
  '{"type":"EnterFunction","payload":{"funcID":4,"name":"logD","start":129,"end":170}}',
  '{"type":"EnterFunction","payload":{"funcID":5,"name":"console.log","start":150,"end":161}}',
  '{"type":"ConsoleLog","payload":{"message":"D\\n"}}',
  '{"type":"ExitFunction","payload":{"funcID":6,"name":"console.log","start":150,"end":161}}',
  '{"type":"ExitFunction","payload":{"funcID":7,"name":"logD","start":129,"end":170}}',
  '{"type":"BeforePromise","payload":{"asyncID":7}}',
  '{"type":"DequeueMicrotask","payload":{}}',
  '{"type":"EnterFunction","payload":{"funcID":8,"name":"logC","start":86,"end":127}}',
  '{"type":"EnterFunction","payload":{"funcID":9,"name":"console.log","start":107,"end":118}}',
  '{"type":"ConsoleLog","payload":{"message":"C\\n"}}',
  '{"type":"ExitFunction","payload":{"funcID":10,"name":"console.log","start":107,"end":118}}',
  '{"type":"ExitFunction","payload":{"funcID":11,"name":"logC","start":86,"end":127}}',
  '{"type":"ResolvePromise","payload":{"asyncID":7}}',
  '{"type":"AfterPromise","payload":{"asyncID":7}}',
  '{"type":"Rerender","payload":{}}',
  '{"type":"BeforeTimeout","payload":{"asyncID":5,"name":"logB"}}',
  '{"type":"EnqueueTask","payload":{"funcID":12,"name":"logB","start":43,"end":84}}',
  '{"type":"EnterFunction","payload":{"funcID":12,"name":"logB","start":43,"end":84}}',
  '{"type":"DequeueTask","payload":{"funcID":12,"name":"logB","start":43,"end":84}}',
  '{"type":"EnterFunction","payload":{"funcID":13,"name":"console.log","start":64,"end":75}}',
  '{"type":"ConsoleLog","payload":{"message":"B\\n"}}',
  '{"type":"ExitFunction","payload":{"funcID":14,"name":"console.log","start":64,"end":75}}',
  '{"type":"ExitFunction","payload":{"funcID":15,"name":"logB","start":43,"end":84}}'
```

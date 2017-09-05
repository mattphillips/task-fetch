const Task = require('data.task');
const { Left, Right } = require('data.either');
const { chain, compose, identity, ifElse, prop } = require('ramda');

const tryCatch = async (promise, error, success) => {
  try {
    const result = await promise();
    return success(result);
  } catch (e) {
    return error(e);
  }
};

const rejectError = reject => compose(reject, Left);
const resolveSuccess = resolve => compose(resolve, Right);

const fetchTask = fetch => url => new Task((reject, resolve) =>
  tryCatch(() => fetch(url), rejectError(reject), resolveSuccess(resolve)));

const parseJson = result => new Task((reject, resolve) =>
  result.chain(res => tryCatch(() => res.json(), rejectError(reject), resolveSuccess(resolve))));

const isOk = result => new Task((reject, resolve) => chain(
  ifElse(
    prop('ok'),
    resolveSuccess(resolve),
    res => tryCatch(() => res.text(), rejectError(reject), rejectError(reject))
  )
)(result));

const safeFetch = fetch => compose(chain(parseJson), chain(isOk), fetchTask(fetch));

module.exports = safeFetch;

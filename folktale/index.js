const { task } = require('folktale/concurrency/task');
const Result = require('folktale/result');

const { chain, compose, identity, ifElse, prop } = require('ramda');

const tryCatch = async (promise, error, success) => {
  try {
    const result = await promise();
    return success(result);
  } catch (e) {
    return error(e);
  }
};

const rejectError = reject => compose(reject, Result.Error);
const resolveSuccess = resolve => compose(resolve, Result.Ok);

const fetchTask = fetch => url => task(({ resolve, reject }) =>
  tryCatch(() => fetch(url), rejectError(reject), resolveSuccess(resolve)));

const parseJson = result => task(({ resolve, reject }) =>
  result.chain(res => tryCatch(() => res.json(), rejectError(reject), resolveSuccess(resolve))));

const isOk = result => task(({ resolve, reject }) => chain(
  ifElse(
    prop('ok'),
    resolveSuccess(resolve),
    res => tryCatch(() => res.text(), rejectError(reject), rejectError(reject))
  )
)(result));

const safeFetch = fetch => compose(chain(parseJson), chain(isOk), fetchTask(fetch));

module.exports = safeFetch;

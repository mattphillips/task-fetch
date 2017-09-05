const Task = require('data.task');
const { Left, Right } = require('data.either');
const { Just, Nothing } = require('data.maybe');
const { chain, compose, ifElse, prop } = require('ramda');

const taskToEither = task => task.fork(Left, Right);
const taskToMaybe = task => task.fork(Nothing, Just);

const tryCatch = promise => async (reject, resolve) => {
  try {
    const result = await promise();
    return resolve(result);
  } catch (e) {
    return reject(e);
  }
};

const fetchTask = fetch => url => new Task(tryCatch(() => fetch(url)));
const parseJson = res => new Task(tryCatch(() => res.json()));
const isOk = res => new Task((reject, resolve) =>
  ifElse(
    prop('ok'),
    resolve,
    () => tryCatch(() => res.text())(reject, reject)
  )(res)
);

// taskFetch :: (String -> Promise) -> String -> Task
const taskFetch = fetch => compose(chain(parseJson), chain(isOk), fetchTask(fetch));

// eitherFetch :: (String -> Promise) -> String -> Either
const eitherFetch = fetch => compose(taskToEither, taskFetch(fetch));

// maybeFetch :: (String -> Promise) -> String -> Maybe
const maybeFetch = fetch => compose(taskToMaybe, taskFetch(fetch));

module.exports = {
  taskFetch,
  eitherFetch,
  maybeFetch
};

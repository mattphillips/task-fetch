const fetch = require('node-fetch');
const { taskFetch, eitherFetch, maybeFetch } = require('./src/data.task/');
const v2 = require('./src/folktale/');

const successUrl = 'https://swapi.co/api/people';
const errorUrl = 'https://swapi.co/api/people/998221';

const get = async () => {
  console.log('-'.repeat(10), 'TASK', '-'.repeat(10));
  await taskFetch(fetch)(successUrl).fork(
    console.error,
    console.log
  );

  console.log('-'.repeat(10), 'MAYBE', '-'.repeat(10));
  const maybe = await maybeFetch(fetch)(successUrl);
  maybe.cata({
    Nothing: () => console.error('Nothing'),
    Just: console.log
  });

  console.log('-'.repeat(10), 'EITHER', '-'.repeat(10));
  const either = await eitherFetch(fetch)(successUrl);
  either.fold(
    console.error,
    console.log
  );

  // console.log('-'.repeat(50));

  // try {
  //   const v2Result = await v2(fetch)(url).run().promise();
  //   console.log(v2Result);
  // } catch (e) {
  //   console.error(e);
  // }
};

get();

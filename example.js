const fetch = require('node-fetch');
const { identity: id } = require('ramda');

const v1 = require('./src/data.task/');
const v2 = require('./src/folktale/');

const url = 'https://swapi.co/api/people';

const get = async () => {
  const v1Result = await v1(fetch)(url).fork(id, id);
  v1Result.fold(
    console.error,
    console.log
  );

  console.log('-'.repeat(50));

  try {
    const v2Result = await v2(fetch)(url).run().promise();
    console.log(v2Result);
  } catch (e) {
    console.error(e);
  }
};

get();

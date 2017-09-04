const Result = require('folktale/result');

const safeFetch = require('./');

describe('folktale v2 task', () => {

  const url = 'http://whatever.trevor.com';

  describe('throws result error', () => {
    it('when fetch fails', async () => {
      expect.assertions(2);

      const error = new Error('🔥');
      const fetchSpy = jest.fn(() => Promise.reject(error));

      try {
        await safeFetch(fetchSpy)(url).run().promise();
      } catch (actual) {
        expect(actual).toEqual(Result.Error(error));
        expect(fetchSpy).toHaveBeenCalledWith(url);
      }
    });

    it('when res.text fails', async () => {
      expect.assertions(3);

      const error = new Error('Error parsing text');
      const res = {
        ok: false,
        text: jest.fn(() => Promise.reject(error)),
      };
      const fetchSpy = jest.fn(() => Promise.resolve(res));

      try {
        await safeFetch(fetchSpy)(url).run().promise();
      } catch (actual) {
        expect(actual).toEqual(Result.Error(error));

        expect(fetchSpy).toHaveBeenCalled();
        expect(res.text).toHaveBeenCalled();
      }
    });

    it('with res text when res is not ok', async () => {
      expect.assertions(3);

      const error = 'Your api is brokens';
      const res = {
        ok: false,
        text: jest.fn(() => Promise.resolve(error)),
      };
      const fetchSpy = jest.fn(() => Promise.resolve(res));

      try {
        await safeFetch(fetchSpy)(url).run().promise();
      } catch (actual) {
        expect(actual).toEqual(Result.Error(error));

        expect(fetchSpy).toHaveBeenCalled();
        expect(res.text).toHaveBeenCalled();
      }
    });

    it('when res.json fails', async () => {
      expect.assertions(4);
      const error = new Error('could not parse json');
      const res = {
        ok: true,
        text: jest.fn(),
        json: jest.fn(() => Promise.reject(error)),
      };
      const fetchSpy = jest.fn(() => Promise.resolve(res));

      try {
        await safeFetch(fetchSpy)(url).run().promise();
      } catch (actual) {
        expect(actual).toEqual(Result.Error(error));

        expect(fetchSpy).toHaveBeenCalled();
        expect(res.text).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
      }
    });
  });

  it('returns either right when fetch is successful', async () => {
    expect.assertions(4);
    const data = [1, 2, 3];
    const res = {
      ok: true,
      text: jest.fn(),
      json: jest.fn(() => Promise.resolve(data)),
    };
    const fetchSpy = jest.fn(() => Promise.resolve(res));
    try {
      const actual = await safeFetch(fetchSpy)(url).run().promise();
      expect(actual).toEqual(Result.Ok(data));

      expect(fetchSpy).toHaveBeenCalled();
      expect(res.text).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    } catch (e) {}
  });
});

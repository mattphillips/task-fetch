const { eitherFetch: safeFetch } = require('./');

describe('data.task', () => {

  const url = 'http://whatever.trevor.com';

  describe('returns either left', () => {

    it('when fetch fails', async () => {
      expect.assertions(3);
      const error = new Error('🔥');
      const fetchSpy = jest.fn(() => Promise.reject(error));
      const actual = await safeFetch(fetchSpy)(url);
      expect(actual.isLeft).toEqual(true);
      expect(actual.value).toEqual(error);
      expect(fetchSpy).toHaveBeenCalledWith(url);
    });

    it('when res.text fails', async () => {
      expect.assertions(4);
      const error = new Error('Error parsing text');
      const res = {
        ok: false,
        text: jest.fn(() => Promise.reject(error)),
      };
      const fetchSpy = jest.fn(() => Promise.resolve(res));

      const actual = await safeFetch(fetchSpy)(url);
      expect(actual.isLeft).toEqual(true);
      expect(actual.value).toEqual(error);

      expect(fetchSpy).toHaveBeenCalled();
      expect(res.text).toHaveBeenCalled();
    });

    it('with res text when res is not ok', async () => {
      expect.assertions(4);
      const error = 'Your api is brokens';
      const res = {
        ok: false,
        text: jest.fn(() => Promise.resolve(error)),
      };
      const fetchSpy = jest.fn(() => Promise.resolve(res));

      const actual = await safeFetch(fetchSpy)(url);
      expect(actual.isLeft).toEqual(true);
      expect(actual.value).toEqual(error);

      expect(fetchSpy).toHaveBeenCalled();
      expect(res.text).toHaveBeenCalled();
    });

    it('when res.json fails', async () => {
      expect.assertions(5);
      const error = new Error('could not parse json');
      const res = {
        ok: true,
        text: jest.fn(),
        json: jest.fn(() => Promise.reject(error)),
      };
      const fetchSpy = jest.fn(() => Promise.resolve(res));
      const actual = await safeFetch(fetchSpy)(url);

      expect(actual.isLeft).toEqual(true);
      expect(actual.value).toEqual(error);

      expect(fetchSpy).toHaveBeenCalled();
      expect(res.text).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  it('returns either right when fetch is successful', async () => {
    expect.assertions(5);
    const data = [1, 2, 3];
    const res = {
      ok: true,
      text: jest.fn(),
      json: jest.fn(() => Promise.resolve(data)),
    };
    const fetchSpy = jest.fn(() => Promise.resolve(res));

    const actual = await safeFetch(fetchSpy)(url);

    expect(actual.isRight).toEqual(true);
    expect(actual.value).toEqual(data);

    expect(fetchSpy).toHaveBeenCalled();
    expect(res.text).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});

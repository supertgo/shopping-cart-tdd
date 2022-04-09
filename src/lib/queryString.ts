type Query = {
  [key: string]: string | string[];
};

export const queryString = (obj: Query) =>
  Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

export const parse = (queryString: string) =>
  Object.fromEntries(
    queryString.split('&').map((item) => {
      // eslint-disable-next-line prefer-const
      let [key, value] = item.split('=');
      if (value.indexOf(',') > -1) {
        value = value.split(',') as unknown as string;
      }
      return [key, value];
    })
  );

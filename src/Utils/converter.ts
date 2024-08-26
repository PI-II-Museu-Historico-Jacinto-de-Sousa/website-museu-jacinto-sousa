export abstract class BaseConverter {
  constructor() {}
  pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    return keys.reduce((o, k) => ((o[k] = obj[k]), o), {} as Pick<T, K>);
  }
  omitSet(obj: object, exclude: Set<string>) {
    return Object.fromEntries(
      Object.entries(obj).filter((e) => !exclude.has(e[0]))
    );
  }
}

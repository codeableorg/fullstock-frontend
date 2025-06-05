import camelcaseKeys from "camelcase-keys";
import decamelize from "decamelize";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objectToCamelCase<T extends Record<string, any>>(obj: T): T {
  return camelcaseKeys(obj, { deep: true }) as T;
}

export function toSnakeCase(str: string): string {
  return decamelize(str);
}

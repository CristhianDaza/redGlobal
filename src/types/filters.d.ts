export type FilterType = 'search' | string;
export type FilterFunction = (filter: string) => Promise<void>;
export type QueryValue = string | null;

export interface FilterMap {
  [key: string]: FilterFunction;
}
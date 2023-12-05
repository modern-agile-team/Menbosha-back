export type ValueOf<T extends Record<any, any>> = T[keyof T];

export type ErrorMessage<T extends Record<string, number>> = Required<{
  [key in T[keyof T]]: string;
}>;

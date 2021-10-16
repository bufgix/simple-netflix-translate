export enum EVENTS {
  TRANSLATE,
  TAB_UPDATE,
}
export type Message = {
  type: EVENTS;
  payload?: unknown;
};

type ERROR_TYPES = "TOKEN_NOT_FOUND" | "TRANSLATE_FETCH_ERROR";
export class SNFError extends Error {
  constructor(message: ERROR_TYPES) {
    super(message);
  }
}

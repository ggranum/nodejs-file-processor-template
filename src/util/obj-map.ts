import { PushId } from "./helper-types";
import { isBoolean, isNotUndefined } from "./validations";

export interface ObjMap<I, T> {
  [key: string]: T
}

export class Ref {
  static isLoaded<I, T>(lazyRef: LazyReference<I, T>): lazyRef is T {
    return isNotUndefined(lazyRef) && isNotUndefined((<any>lazyRef).id);
  }

  static isMapLoaded<I, T>(map: LazyRefMap<I, T> = {}): map is ObjMap<I, T> {
    let loaded: boolean = false;
    const keys          = Object.keys(map);
    if (keys.length === 0) {
      loaded = true; // empty is same, loaded or not.
    } else {
      // assume all are read if any are, because having a mix would be horrible programming.
      const first = map[ keys[ 0 ] ];
      loaded      = !isBoolean(first);
    }
    return loaded;
  }
}

export interface Lazy {
  id: PushId
  readonly fullyLoaded?: boolean
}

export type LazyReference<I, T> = I | T

export type LazyRefMap<I, T> = ObjMap<I, boolean> | ObjMap<I, T>

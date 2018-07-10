import { isNotNullish, isNullish } from "./validations";

export class ObjectUtil {

  static removeUndefined<T>(objMap: T): Partial<T> {
    const result: any = {};
    Object.keys(objMap).forEach(key => {
      if ((<any>objMap)[ key ] !== undefined) {
        result[ key ] = (<any>objMap)[ key ];
      }
    });
    return result;
  }

  /**
   * Removes all null or undefined values from an object map, in place.
   */
  static removeNullishInPlace(...objMaps: any[]): void {
    objMaps.forEach(objMap => {
      Object.keys(objMap).forEach(key => {
        if (isNullish(objMap[ key ])) {
          delete objMap[ key ];
        }
      });
    });
  }

  /**
   * Return both a patch and a merge version of the provided arguments of type T.
   * The 'merge' result contains all the values from `left`, updated with all the values from `right`.
   * The  merge result will NOT contain fields with null or undefined values. The Patch result can contain null values,
   *     if the value was set to null.
   * The 'patch' result contains only the fields that are different between `left` and `right`. e.g. for
   * updating a database table.
   *
   * @returns {T}
   */
  static patch<T>(left: Partial<T>, patchWith: Partial<T>): { merge: T, patch: Partial<T> } {
    const aLeft             = <any>left;
    const aRight            = <any>patchWith;
    const merge             = <any>{};
    const patch: Partial<T> = {};
    Object.keys(left).forEach(key => {
      const value = aLeft[ key ];
      if (isNotNullish(value)) {
        merge[ key ] = value;
      }
    });

    Object.keys(patchWith).forEach(key => {
      const rValue = aRight[ key ];
      if (isNotNullish(rValue)) {
        if (rValue !== aLeft[ key ]) {
          merge[ key ]        = rValue;
          (<any>patch)[ key ] = rValue;
        }
      } else if (rValue === null && isNotNullish(aLeft[ key ])) {
        merge[ key ]        = null; // we're deleting the value
        (<any>patch)[ key ] = null;
      }
    });
    return { merge, patch };
  }

  static distinct<T>(ary: T[]): T[] {
    return [ ...new Set(ary) ];
  }

  static arrayToMap<T>(ary: T[], keyField: keyof T): Map<string, T> {
    const map: Map<string, T> = new Map();
    ary.forEach(v => {
      const key: string = <any>v[ keyField ];
      map.set(key, v);
    });
    return map;
  }

  static arrayToMultiMap<T>(ary: T[], keyField: keyof T): Map<string, T[]> {
    const map: Map<string, T[]> = new Map();
    ary.forEach(v => {
      const key: string          = <any>v[ keyField ];
      let multi: T[] | undefined = map.get(key);
      if (!multi) {
        multi = [];
        map.set(key, multi);
      }
      multi.push(v);
    });
    return map;
  }

  static mapToJson<K, V>(map: Map<K, V>):string {
    return JSON.stringify(ObjectUtil.mapToObjMap(map))
  }
  static mapToObjMap<K, V>(map: Map<K, V>):{[key:string]:V} {
    const jsonObj: any = {};
    map.forEach((value, key) => {
      jsonObj[ key ] = value;
    });
    return jsonObj

  }
}

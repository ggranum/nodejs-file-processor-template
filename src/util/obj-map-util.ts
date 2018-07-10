import { ObjMap } from "./obj-map";

export class ObjMapUtil {

  static fromKeyedEntityArray<K, V>(values: V[], keyField: keyof V): ObjMap<K, V> {
    values                = values || [];
    const m: ObjMap<K, V> = {};
    for (let i = 0; i < values.length; i++) {
      m[ (<any>values[ i ])[ keyField ] ] = values[ i ];
    }
    return m;
  }

  static toArray<K, V>(map: ObjMap<K, V>): V[] {
    return Object.keys(map).map((key) => map[ key ]);
  }

  static toKeyedEntityArray<K, V>(map: ObjMap<K, V>, keyField: keyof V): V[] {
    return Object.keys(map).map((key) => {
      const keyObj: any  = {};
      keyObj[ keyField ] = key;
      return Object.assign({}, map[ key ], keyObj);
    });
  }

  static toTruthMap<K, V>(map: ObjMap<K, V>): ObjMap<K, boolean> {
    const result: ObjMap<K, boolean> = {};
    Object.keys(map).forEach((key) => {
      result[ key ] = true;
    });
    return result;
  }

  static addAll<K, V>(map: ObjMap<K, V>, mapB: ObjMap<K, V>, noOverwrite: boolean = false): ObjMap<K, V> {
    map  = map || {};
    mapB = mapB || {};
    Object.keys(mapB).forEach((key: string) => {
      if (noOverwrite && map[ key ] !== undefined) {
        throw new Error(`Key already exists on map, cannot replace: ${key}.`);
      }
      map[ key ] = mapB[ key ];
    });
    return map;
  }

  static removeAll<K, V>(map: ObjMap<K, V>, mapB: ObjMap<K, V>) {
    Object.keys(mapB).forEach((key: string) => {
      if (map[ key ] !== undefined) {
        delete map[ key ];
      }
    });
  }

  /**
   * Remove the child fields from the provided map.
   * @param map
   * @param fields {string[]}
   * @returns {ObjMap<K, V>}
   */
  static deleteValueFields<K, V>(map: ObjMap<K, V>, fields: string[] = [ "$key" ]): ObjMap<K, V> {
    map = map || {};
    fields.forEach((fieldKey) => {
      Object.keys(map).forEach((key) => {
        delete (<any>map)[ key ][ fieldKey ];
      });
    });
    return map;
  }

  static forEach<K, V>(map: ObjMap<K, V>, cb: (value: V, key: K) => void): void {
    if (map) {
      for (const key of Object.keys(map)) {
        cb(map[ key ], <any>key);
      }
    }
  }

  static forEachP<K, V>(map: ObjMap<K, V>, cb: (value: V, key: K) => Promise<void>): Promise<void> {
    const p: Promise<void>[] = [];
    if (map) {
      for (const key of Object.keys(map)) {
        p.push(cb(map[ key ], <any>key));
      }
    }
    return Promise.all(p).then(() => undefined);
  }
}

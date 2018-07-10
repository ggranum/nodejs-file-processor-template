export class MapUtil {
  static flattenMultiMap<K, V>(map: Map<K, V[]>): V[] {
    return [].concat.apply([], [ ...map.values() ]);
  }

  static addAll<K, V>(to: Map<K, V>, from: Map<K, V>): void {
    from.forEach((v, k) => to.set(k, v));
  }
}

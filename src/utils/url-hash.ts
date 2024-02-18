import {ref, Ref, toRef, toRefs, watch, WatchSource} from "vue";
import {config} from "../../config";

let initFlag = false
const hashMap: Record<string, string> = {}

export function initHash() {
  const s = new URLSearchParams(location.hash.substring(1))
  s.forEach((v, k) => hashMap[k] = v)
  initFlag = true
}

export function updateHash() {
  const s = new URLSearchParams(hashMap)
  location.hash = s.toString()
}

export function bindHash<T extends WatchSource<string>>(key: string, strRef: T): string {
  if (!initFlag) {
    initHash()
  }
  watch(strRef, n => {
    hashMap[key] = n
    updateHash()
  })
  return hashMap[key]
}


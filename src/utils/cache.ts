import { watch } from "vue"
import { reactive } from "vue"

class CacheModel {
    getItem(localId: string, defaultValue = {}) {
        let local = localStorage.getItem(localId)
        if (local) return JSON.parse(local)
        this.save(localId, defaultValue)
        return defaultValue
    }

    save(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    clear(key: string) { localStorage.setItem(key, '') }
}

export const cacheModel = new CacheModel()

export function createProxyItem<T>(name: string, defaultValue: T): T {
    const localItem = cacheModel.getItem(name, defaultValue as any)

    const obj = reactive(localItem)
    watch(obj, () => {
        cacheModel.save(name, obj)
    }, { deep: true })
    return obj
}

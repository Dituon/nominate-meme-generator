import { Ref, reactive, ref, watch } from 'vue'
import { configCache } from '../../config'
import { createProxyItem } from './cache'

const dataProxy = createProxyItem('data', {})
export const config = configCache
export const groupDataMap: Ref<{[key: string]: {}}> = ref({})
initGroupDataMap()

watch(() => config.app.saveData, initGroupDataMap)

export function initGroupDataMap(cacheFlag: boolean = config.app.saveData) {
    const prev = Object.assign({}, groupDataMap.value)
    groupDataMap.value = cacheFlag ? Object.assign(dataProxy, prev) : prev
}
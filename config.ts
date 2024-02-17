import {createProxyItem} from './src/utils/cache'

export const config = {
  repoLoader: {
    baseUrl: 'https://d2n.moe/nominate-meme-data',
    // baseUrl: 'http://127.0.0.1:5500',
  },
  user: {
    name: '我',
    group: '',
    template: '',
  },
  app: {
    draggable: true,
    saveData: true,
    siteWatermark: true,
    userWatermark: true,
  },
}

export const configCache = createProxyItem('config', config)
export default configCache

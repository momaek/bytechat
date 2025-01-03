import { defineStore } from 'pinia'
import type { API, Model } from '@/types/chat'

export const useModelStore = defineStore('model', {
  persist:{
    key: "models",
    storage: localStorage
  },
  state: () => ({
    models: [] as Model[],
    apis: [] as API[],
  }),
  actions: {
    addModel(model: Model) {
      this.models.push(model)
    },
    removeModel(model: Model) {
      this.models = this.models.filter(m => m.id !== model.id)
    },
    updateModel(model: Model) {
      const index = this.models.findIndex(m => m.id === model.id)
      this.models[index] = model
    },
    moveToFirst(chat: Model) {
      const index = this.models.findIndex(m => m.id === chat.id)
      if (index !== -1) {
        const [model] = this.models.splice(index, 1)
        this.models.unshift(model)
      }
    },
    addAPI(api: API) {
        this.apis.push(api)
    },
    removeAPI(api: API) {
      this.apis = this.apis.filter(a => a.base !== api.base)
    },
    updateAPI(api: API) {
      const index = this.apis.findIndex(a => a.base === api.base)
      this.apis[index] = api
    }
  },
})
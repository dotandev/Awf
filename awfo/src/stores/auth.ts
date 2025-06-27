import { defineStore, type _GettersTree } from 'pinia'

export interface State {
  access_token: string
}

export interface Actions {}

export interface Getters extends _GettersTree<State> {}

// 创建用于存储状态的 store 对象
export const useAuthStore = defineStore<'auth-store', State, Getters, Actions>({
  id: 'auth-store',
  state: () => ({
    access_token: '',
  }),
  actions: {},
  getters: {},
  persist: {},
})

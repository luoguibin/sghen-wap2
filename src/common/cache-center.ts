class CacheCenter {
  name: String = ""
  cache: Map<String, any> = new Map()
  currentId: any = null

  constructor(name = 'cache-center') {
    this.name = name
  }

  setData(id: Number | String, data: any) {
    id = '' + id
    this.currentId = id
    this.cache.set(id, data)
  }

  getData(id: Number | String) {
    return this.cache.get('' + id)
  }

  delete(id: Number | String) {
    return this.cache.delete('' + id)
  }

  deleteCurrent() {
    return this.delete(this.currentId)
  }

  clear() {
    this.cache.clear()
  }
}

const cache = {
  UserCache: new CacheCenter('user'),
  PeotryPageCache: new CacheCenter('petory-page'),
  PeotrySetCache: new CacheCenter('petory-set'),
  OptionCache: new CacheCenter('option'),
  OPTION: {
    CREATE: 'option-create',
    UDPATE: 'option-update',
    DELETE: 'option-delete'
  }
}

window._sgCache = cache
export default cache

// export const UserCache = new CacheCenter('user')

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "listRule": "// 用户已登录，可以查看消息\n@request.auth.id != \"\" ||\n// 根据config，判断是否允许未登录用户查看消息\n(\n  @collection.config.key ?= 'allow-anonymous-view' &&\n  @collection.config.value ?= true\n)\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "listRule": ""
  }, collection)

  return app.save(collection)
})

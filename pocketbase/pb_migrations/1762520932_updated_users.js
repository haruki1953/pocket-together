/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "// 创建（注册）时level只能为basic（基本用户）\n@request.body.level = \"basic\" &&\n// 根据config，判断是否允许用户注册\n(\n  @collection.config.key ?= 'allow-users-to-register' &&\n  @collection.config.value ?= true\n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "// 创建（注册）时level只能为basic（基本用户）\n@request.body.level = \"basic\" &&\n// 根据config，判断是否允许用户注册\n(\n  @collection.config.key = 'allow-users-to-register' &&\n  @collection.config.value = true\n)"
  }, collection)

  return app.save(collection)
})

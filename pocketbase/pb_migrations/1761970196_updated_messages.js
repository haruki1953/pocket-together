/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "createRule": "// 创建消息需登录\n@request.auth.id != \"\" &&\n// 创建时需为创建者（传入的author需为当前用户）\n@request.auth.id = @request.body.author"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "createRule": "// 创建消息需登录\n@request.auth.id != \"\" &&\n// 创建时需为创建者（传入的author需为当前用户）\n@request.body.author = @request.auth.id"
  }, collection)

  return app.save(collection)
})

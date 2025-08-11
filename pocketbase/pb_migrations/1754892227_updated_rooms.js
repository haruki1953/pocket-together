/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // update collection data
  unmarshal({
    "createRule": "// 创建房间需登录\n@request.auth.id != \"\" &&\n// 创建时需为创建者（传入的author需为当前用户）\n@request.auth.id = author.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // update collection data
  unmarshal({
    "createRule": "// 创建房间需登录\n@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})

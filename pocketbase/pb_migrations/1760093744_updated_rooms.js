/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // update collection data
  unmarshal({
    "updateRule": "// 修改房间需为创建者\n@request.auth.id != \"\" "
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // update collection data
  unmarshal({
    "updateRule": "// 修改房间需为创建者\n@request.auth.id = author.id"
  }, collection)

  return app.save(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "deleteRule": null
  }, collection)

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool2382110195",
    "name": "isDeleted",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "deleteRule": "// 删除消息需登录\n@request.auth.id != \"\" &&\n// 删除消息需为创建者\n@request.auth.id = author.id"
  }, collection)

  // remove field
  collection.fields.removeById("bool2382110195")

  return app.save(collection)
})

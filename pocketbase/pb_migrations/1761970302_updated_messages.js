/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "deleteRule": "// 删除消息需登录\n@request.auth.id != \"\" &&\n// 删除消息需为创建者\n@request.auth.id = author.id",
    "updateRule": "// 修改消息需登录\n@request.auth.id != \"\" &&\n// 修改消息需为创建者\n@request.auth.id = author.id &&\n// 禁止修改author\n@request.body.author:isset = false &&\n// 禁止修改room\n@request.body.room:isset = false"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "deleteRule": "// 删除消息需为创建者\n@request.auth.id = author.id",
    "updateRule": "// 修改消息需为创建者\n@request.auth.id = author.id &&\n// 禁止修改author\n@request.body.author:isset = false &&\n// 禁止修改room\n@request.body.room:isset = false"
  }, collection)

  return app.save(collection)
})

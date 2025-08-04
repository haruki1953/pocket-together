/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // update collection data
  unmarshal({
    "listRule": "// 指定可公开的key\nkey = \"allow-basic-users-upload\" ||\nkey = \"email-update-rate-limit-second\"",
    "viewRule": "// 指定可公开的key\nkey = \"allow-basic-users-upload\" ||\nkey = \"email-update-rate-limit-second\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // update collection data
  unmarshal({
    "listRule": "// 指定可公开的key\nkey = \"allow-basic-users-upload\"",
    "viewRule": "// 指定可公开的key\nkey = \"allow-basic-users-upload\""
  }, collection)

  return app.save(collection)
})

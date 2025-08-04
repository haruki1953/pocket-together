/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // remove field
  collection.fields.removeById("select2324736937")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2324736937",
    "max": 0,
    "min": 0,
    "name": "key",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3818476082")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select2324736937",
    "maxSelect": 1,
    "name": "key",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "allow-basic-users-upload"
    ]
  }))

  // remove field
  collection.fields.removeById("text2324736937")

  return app.save(collection)
})

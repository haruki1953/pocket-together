/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json1874629670",
    "maxSize": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text901924565",
    "max": 8,
    "min": 4,
    "name": "password",
    "pattern": "^\\d{4,8}$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file2366146245",
    "maxSelect": 1,
    "maxSize": 500000,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml"
    ],
    "name": "cover",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3085411453")

  // remove field
  collection.fields.removeById("json1874629670")

  // remove field
  collection.fields.removeById("text901924565")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file2366146245",
    "maxSelect": 1,
    "maxSize": 500000,
    "mimeTypes": [
      "image/jpeg"
    ],
    "name": "cover",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "100x0",
      "500x0"
    ],
    "type": "file"
  }))

  return app.save(collection)
})

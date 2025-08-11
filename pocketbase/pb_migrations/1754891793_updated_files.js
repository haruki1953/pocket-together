/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3446931122")

  // update collection data
  unmarshal({
    "createRule": "// 需登录\n@request.auth.id != \"\" &&\n// 创建时需为创建者（传入的author需为当前用户）\n@request.auth.id = author.id &&\n// 根据config，判断是否允许基础用户上传文件\n(\n  // config中允许基础用户，则可以上传\n  (\n    @collection.config.key = \"allow-basic-users-upload\" && \n    @collection.config.value = true\n  ) ||\n  // config中不允许基础用户，则用户level不能为basic\n  // auth中的可能不是实时的，应根据用户集合\n  (\n    @collection.users.id = @request.auth.id &&\n    @collection.users.level != 'basic'\n  )\n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3446931122")

  // update collection data
  unmarshal({
    "createRule": "// 需登录\n@request.auth.id != \"\" &&\n// 根据config，判断是否允许基础用户上传文件\n(\n  // config中允许基础用户，则可以上传\n  (\n    @collection.config.key = \"allow-basic-users-upload\" && \n    @collection.config.value = true\n  ) ||\n  // config中不允许基础用户，则用户level不能为basic\n  // auth中的可能不是实时的，应根据用户集合\n  (\n    @collection.users.id = @request.auth.id &&\n    @collection.users.level != 'basic'\n  )\n)"
  }, collection)

  return app.save(collection)
})

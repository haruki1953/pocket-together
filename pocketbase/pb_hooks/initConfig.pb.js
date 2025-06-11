/*
用于初始化 config 集合
如果缺少某个key的记录，就根据默认值补全
*/

/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
  // 请注意，在 e.next() 调用之前尝试访问数据库将导致错误。
  e.next()

  // config 集合 默认值
  const configColectionDefault = [
    { key: 'allow-basic-users-upload', value: true, note: '是否允许基础用户上传文件' },
    // {key: '', value: '', note: ''},
  ]

  // 确保 config 集合存在
  try {
    $app.findCollectionByNameOrId("config")

    // 遍历默认值数组
    configColectionDefault.forEach((item) => {
      try {
        // 查找，查不到会抛出错误
        $app.findFirstRecordByData("config", "key", item.key)
      } catch (error) {
        try {
          // 未找到，创建
          const collection = $app.findCollectionByNameOrId("config")
          const record = new Record(collection)
          record.set('key', item.key)
          record.set('value', item.value)
          record.set('note', item.note)
          $app.save(record);
        } catch (error) {
          console.log(`config 集合 ${item.key} 初始化失败`)
        }
      }
    })
  } catch (error) {
    // console.log('config 集合不存在')
  }

})

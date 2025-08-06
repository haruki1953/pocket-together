/*
用于初始化 config 集合
如果缺少某个key的记录，就根据默认值补全
*/

/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
  // 请注意，在 e.next() 调用之前尝试访问数据库将导致错误。
  e.next()

  // pocketbase 集合 config 默认值
  const pbCollectionConfigDefault = {
    /*
      【pbCollectionConfigDefault_public START】
      此内容在前后端一致
      - vue3\src\config\pb-collection-config.ts
      - pocketbase\pb_hooks\init-config.pb.js
    */

    /** 是否允许基础用户上传文件 */
    'allow-basic-users-upload': true,
    /** 邮箱修改最短秒数（由 客户端/前端 实现的速率限制，单位秒） */
    'email-update-rate-limit-second': 30,
    /** 邮箱验证最短秒数（由 客户端/前端 实现的速率限制，单位秒） */
    'email-verify-rate-limit-second': 30,

    /*
      【pbCollectionConfigDefault_public END】
    */
  }

  // 确保 config 集合存在
  try {
    $app.findCollectionByNameOrId("config")

    // 遍历默认值对象
    /** @type {(keyof typeof pbCollectionConfigDefault)[]} */
    // @ts-ignore
    const configColectionKeys = Object.keys(pbCollectionConfigDefault);
    configColectionKeys.forEach(
      (key) => {
        try {
          // 查找，查不到会抛出错误
          $app.findFirstRecordByData("config", "key", key)
        } catch (error) {
          try {
            // 未找到，创建
            const collection = $app.findCollectionByNameOrId("config")
            const record = new Record(collection)
            record.set('key', key)
            record.set('value', pbCollectionConfigDefault[key])
            $app.save(record);
          } catch (error) {
            console.log(`config 集合 ${key} 初始化失败`)
          }
        }
      })
  } catch (error) {
    // console.log('config 集合不存在')
  }

})

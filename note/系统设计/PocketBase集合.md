## users 用户

字段
```
id text
password password 非空 隐藏
tokenKey test 非空 隐藏 唯一 索引
email email 唯一 索引
emailVisibility bool
verified bool
username text 非空 唯一 索引
name text
avatar file 格式jpg 缩略图100x100f 最大100KB
level select: "basic"|"premium" // 用户级别
created autodate
updated autodate
```

API规则
```
list/search

view

create
// 创建（注册）时level只能为basic（基本用户）
@request.body.level = "basic"

update
id = @request.auth.id &&
// 禁止修改level
@request.body.level:isset = false

delete
id = @request.auth.id
```

选项
```
使用 username password 进行身份验证
```



## rooms 房间

字段
```
id text
title text
description text
cover file 格式jpg 缩略图100x0,500x0 最大500KB
coverWidth number 非零 最小1
coverHeight number 非零 最小1
author relation(users) 非空 单个 不联级删除
playlist relation(filse) 多个 不联级删除 // 播放列表
created autodate
updated autodate
```

API规则
```
list/search

view

create
// 创建房间需登录
@request.auth.id != ""

update
// 修改房间需为创建者
@request.auth.id = author.id

delete
// 删除房间需为创建者
@request.auth.id = author.id
```


## messages 消息

字段
```
id text
content text
author relation(users) 非空 单个 不联级删除
room relation(rooms) 单个 联级删除 // 所属房间
quoteRoom relation(rooms) 单个 不联级删除 // 引用房间
quoteFile relation(rooms) 单个 不联级删除 // 引用房间
created autodate
updated autodate
```

API规则
```
list/search

view

create
// 创建消息需登录
@request.auth.id != ""

update
// 修改消息需为创建者
@request.auth.id = author.id

delete
// 删除消息需为创建者
@request.auth.id = author.id
```


## files 文件
字段
```
id text
file file 非空 单个
size number 最小值-1 // -1时代表大小未知
title text
description text
author relation(users) 非空 单个 不联级删除
created autodate
updated autodate
```

API规则
```
list/search

view

create
// 需登录
@request.auth.id != "" &&
// 根据config，判断是否允许基础用户上传文件
(
  // config中允许基础用户，则可以上传
  (
    @collection.config.key = "allow-basic-users-upload" && 
    @collection.config.value = true
  ) ||
  // config中不允许基础用户，则用户level不能为basic
  // auth中的可能不是实时的，应根据用户集合
  (
    @collection.users.id = @request.auth.id &&
    @collection.users.level != 'basic'
  )
)

update
// 修改时需为创建者
@request.auth.id = author.id

delete
// 删除时需为创建者
@request.auth.id = author.id
// 并且删除时不能被房间使用（待实现，在api规则中无法实现，需扩展）
```


## config 配置
字段
```
id text
key select(allow-basic-users-upload) 非空 单个
value json
note text // 备注
created autodate
updated autodate
```

API规则
```
list/search
// 指定可公开的key
key = "allow-basic-users-upload"

view
// 指定可公开的key
key = "allow-basic-users-upload"
```

说明
```
此集合保存本项目的配置，这种结构使其可以在API规则中使用
allow-basic-users-upload：是否允许基础用户上传文件
```
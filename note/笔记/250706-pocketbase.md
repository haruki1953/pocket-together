## github oauth2
https://docs.github.com/zh/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

了解pocketbase的oauth2相关规则了
```
如果自己修改了默认的users集合配置，比如加入了username、level字段，在oauth2时就要确保其有值，否则会导致记录创建失败

username可以在oauth里配置，使用平台的username。
有一点需要注意，username可能会和已有的记录重复，导致创建失败；
这个可以通过设置username的Autogenerate pattern来解决，效果是如果username不重复则使用username，否则自动生成

level字段的设置，可以在jsSDK调用authWithOAuth2时设置，如
  const res = await pb.collection('users').authWithOAuth2({
    provider: 'github',
    createData: {
      level: 'basic',
    },
  })

还有一点需要注意，可能是自己的网络问题（pocketbase无法用代理？），在本地oauth2失败了，在远程成功了
```

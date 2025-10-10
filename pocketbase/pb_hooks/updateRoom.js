// 监听一下 rooms 更新前
// 主要是为了处理收藏功能
// 这个功能是前端发起的
// 前端会传入 favorited+ 或者 favorited-
// 所以你们不准更新房间创建者的其他集合，但你们可以修改 favorited 字段
// 这个字段是一个字符串数组，存储了所有收藏这个房间的用户 ID
onRecordBeforeUpdateRequest((e) => {
    const whoUser = e
    .httpContext
    .get("authRecord")
    // 你没登陆吧
    if (whoUser === null) {
        throw new ForbiddenError(" Please make sure you’re logged in, nay!")
    }
    // 你是房间创建者吧
    if (e.record.get("author") === whoUser.id) {
        return
    }
    // 你不是房间创建者吧
    const requestData = e
    .httpContext.get("data")
    const keys = Object.keys(requestData)
    // 字段不能超过 1 个，你只准修改 favorited 字段
    if (keys.length !== 1) {
        throw new ForbiddenError("Only favorites Desu!")
    }
    // 因为只允许一个字段，所以检查存入 FavoritedUpdataOk 的这个字段
    const FavoritedUpdataOk = keys[0]
    if (FavoritedUpdataOk !== "favorites+" && FavoritedUpdataOk !== "favorites-") {
        throw new ForbiddenError("Only favorites Desu!")
    }
},"rooms")
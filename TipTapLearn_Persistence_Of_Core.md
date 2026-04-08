### Persistence
  ## 将状态持久化到本地存储（LocalStorage）
您可以使用localStorage API在浏览器中持久化编辑器状态。以下是一个使用LocalStorage保存和恢复编辑器内容的简单示例(见官网)

在初始化编辑器时，您还可以从localStorage中获取数据：

   ## 将状态持久化到数据库中
要将编辑器状态持久化到数据库中，你可以使用与 LocalStorage 相同的方法，但不同的是，你需要将 JSON 数据发送到后端 API，而不是使用 localStorage。

在本例中，我们将使用Fetch API将编辑器内容发送到一个假设的端点：

要从数据库中恢复编辑器内容，您需要从API获取内容并将其设置在编辑器中：


  ## 在React中恢复编辑器状态
如果你在使用React，你可以使用useEffect钩子在组件挂载时恢复编辑器状态。以下是一个针对LocalStorage场景的示例：
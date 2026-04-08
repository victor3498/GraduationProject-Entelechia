## Tiptap Core Concepts
 
 # Structure
    ProseMirror采用严格的模式（Schema）进行工作，该模式定义了文档所允许的结构。文档由标题、段落和其他元素（称为节点）构成，形成一棵树状结构。标记（Marks）可以附加到节点上，例如用于强调其中的部分内容。命令（Commands）则通过编程方式更改该文档。

 # State
     文档存储在某个状态中。更改以事务的形式应用于该状态。该状态包含当前内容、光标位置和选择的详细信息。您可以监听事件，例如在事务应用之前对其进行修改。

 # Content
     该文档在内部以ProseMirror节点的形式存储，并且可以通过调用editor.getJSON()方法以Tiptap JSON对象的形式检索。

     Tiptap JSON是存储和处理文档的推荐格式。以下是Tiptap JSON文档的示例：
    
    {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "center"
      },
      "content": [
        { "type": "text", "text": "Hello, " },
        {
          "type": "text",
          "text": "world",
          "marks": [{ "type": "bold" }, { "type": "italic" }]
        },
        { "type": "text", "text": "!" }
      ]
    }
  ]
}

    Tiptap JSON文档是一个节点树。一些节点可以有子节点，但只有文本节点（类型为“text”）可以包含文本。文本节点和其他内联节点可以应用标记。一些节点和标记可以具有属性。
 # Extensions
    扩展为编辑器增加了节点、标记和/或功能。许多扩展将其命令与常见的键盘快捷键绑定。
    
 # Vocabulary
    ProseMirror有自己的专业术语，你会时不时地遇到这些词汇。以下是我们文档中最常用词汇的简要概述。

单词	描述
模式（Schema）配置了内容可以具有的结构。
文档 (Document)编辑器中的实际内容。
状态 描述当前编辑器的内容和选择的所有信息。
事务（Transaction）状态变更（更新选择、内容等）
扩展 注册新功能。
节点（Node） 一种内容类型，例如标题或段落。
标记	可应用于节点，例如用于内联格式化。
命令	在编辑器内执行一个操作，以某种方式改变状态。
装饰性内容 在文档上的样式化内容，例如用于突出错误。



Tiptap 构建于 ProseMirror 之上，而 ProseMirror 拥有一个非常强大的 API。为了访问这个 API，我们提供了 @tiptap/pm 包。此包提供了所有重要的 ProseMirror 包，如 prosemirror-state、prosemirror-view 或 prosemirror-model。

使用该包进行自定义开发可确保您始终使用与Tiptap相同的ProseMirror版本。这样，我们就能确保Tiptap及其所有扩展之间相互兼容，并防止版本冲突。

另一个优点是，你无需手动安装所有ProseMirror包，尤其是当你没有使用npm或其他支持自动解析同级依赖的包管理器时。

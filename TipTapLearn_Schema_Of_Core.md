  ### Schema of Core

  TipTap Schemas
    TipTap基于一套schema去定义文档，包括文档中的节点类型，属性以及它们的嵌套方式。该schema是严格的，不能使用这套schema中没有定义的属性或者HTML元素


  // the underlying ProseMirror schema
{
  nodes: {
    doc: {
      content: 'block+',
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0],
    },
    text: {
      group: 'inline',
    },
  },
}

  我们在此注册了三个节点：`doc`、`paragraph` 和 `text`。`doc` 是根节点，允许有一个或多个块节点作为其子节点（内容：`block+`）。由于 `paragraph` 属于块节点组（组：`block`），因此我们的文档只能包含段落。我们的段落允许有零个或多个内联节点作为其子节点（内容：`inline*`），因此段落中只能包含文本。`parseDOM` 定义了如何从粘贴的 HTML 解析节点。`toDOM` 定义了如何在 DOM 中呈现这些节点。

  ## Nodes and marks
  在Tiptap中，每个节点、标记(mark)和扩展都存在于自己的文件中。这使我们能够拆分逻辑。在底层，整个模式将被合并在一起：

  标记可以应用于节点的特定部分。粗体、斜体或 striked(原文中间画了一横)就是这种情况。链接也是一种标记。
  # The node schema
     Content
     `content`属性精确地定义了节点可以包含的内容类型。ProseMirror对此要求非常严格。这意味着，不符合模式的内容将被丢弃。它期望接收一个字符串形式的名称或组。以下是一些示例：
     Node.create({
  // 一定要有一个或者多个blocks
  content: 'block+',

  // 有0个到多个blocks
  content: 'block*',

  // 允许所有'inline'类型的 content (text 或 hard breaks)
  content: 'inline*',

  // 只能有'text'
  content: 'text*',

  // can have one or more paragraphs, or lists (if lists are used)
  content: '(paragraph|list?)+',

  // must have exact one heading at the top, and one or more blocks below
  content: 'heading block+',
})

Marks
您可以通过模式的标记设置来定义节点内允许使用的标记。添加一个或多个标记名称或标记组，允许所有标记或禁止所有标记，如下所示(示例见官网https://tiptap.dev/docs/editor/core-concepts/schema)下面非关键例子皆是如此。

Group
  将此节点添加到一组扩展中，这些扩展可以在模式的content属性中引用。示例见官网

Inline(示例见官网)
  节点也可以被内联渲染。当设置 `inline: true` 时，节点会与文本一起内联渲染。这就是提及（mentions）的情况。其结果更像是一个标记，但具有节点的功能。一个区别是生成的JSON文档。多个标记会一次性应用，内联节点将产生嵌套结构。

 对于某些需要标记中未提供的功能（例如节点视图）的情况，可以尝试使用内联节点：

内联节点（Inline nodes）的选择可能会有些棘手，尤其是在行边缘。一个快速解决方法是：使用CSS在元素后立即添加一个零宽度空格：

Atom
  带有`atom: true`的节点不可直接编辑，应视为一个整体单元。虽然在编辑器上下文中不太可能使用这种方式，但大致效果如下：

Draggable,  Selectable,Code....

Defining
 默认情况下，当节点的全部内容被替换时（例如粘贴新内容时），节点会被删除。如果此类替换操作需要保留节点，请将其配置为定义节点。通常，这适用于引用框、代码块、标题和列表项。

 Node.create({
  defining: true,
})

Isolating,  Allow gap cursor, Table roles
 # The mark schema
    Inclusive(),Excludes(不复用),Exitable，Group,Code,Spanning.

  ##  Get the underlying ProseMirror schema 
      获取底层ProseMirror模式
     
在某些用例中，你需要处理底层模式。如果你在使用Tiptap的协作文本编辑功能，或者想手动将内容呈现为HTML，那么你就需要用到它。

选项1：配备编辑
如果你在客户端需要这个功能，并且无论如何都需要一个编辑器实例，那么可以通过编辑器来获取：
选项2：无编辑
如果你只想获取模式而不想初始化实际的编辑器，可以使用getSchema辅助函数。该函数需要一个可用扩展的数组，并会为你方便地生成一个ProseMirror模式：

## Invalid Schema Handling
无效模式处理
为了追踪和响应内容错误，Tiptap支持检查提供的内容是否与已注册扩展派生的模式相匹配。要使用此功能，请将enableContentCheck选项设置为true，这将激活内容检查并发出contentError事件。这些事件可以通过onContentError回调进行监听。默认情况下，此标志设置为false，以保持与旧版本的兼容性。

Tiptap对JSON内容类型的内容检查准确率达到100%。但是，如果您以HTML格式提供内容，我们已尽力尝试对缺失的节点进行提醒，但在某些情况下仍可能遗漏标记，因此，默认情况下会回退到剥离未识别内容的默认行为。

# contentError event
当编辑器设置过程中提供的初始内容与模式不兼容时，会触发contentError事件。

作为错误上下文的一部分，系统会提供一个disableCollaboration函数。调用此函数会重新初始化编辑器，且不启用协作扩展，从而确保任何已删除的内容不会与其他用户同步。

此事件可以通过onContentError直接作为一个选项来处理，如下所示：

或者，在编辑器实例上为contentError事件附加一个监听器。

#  Listen to the contentError event without enabling content checking
   在不启用内容检查的情况下监听 contentError 事件
   如果您想在不启用内容检查的情况下监听contentError事件，请在初始化Tiptap编辑器时将emitContentError设置为true：
   此设置允许您在编辑器中输入无效内容，但仍会在内容无效时收到通知。

# Recommended Handling
  
  无协同编辑--Without collaborative editing
根据您的使用场景，默认的移除未知内容的行为会确保您的内容保持在已知的有效状态，以便日后编辑。
  


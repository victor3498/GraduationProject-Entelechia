### The editor state
编辑器的状态由什么组成？当然有你的文档。还有当前的选择。还需要有一种方法来存储当前标记集已更改的事实，例如当你禁用或启用标记但尚未开始使用该标记输入时。

那些是 ProseMirror 状态的三个主要组成部分，并且在状态对象上以 doc、selection 和 storedMarks 的形式存在。

import {schema} from "prosemirror-schema-basic"
import {EditorState} from "prosemirror-state"

let state = EditorState.create({schema})
console.log(state.doc.toString()) // 一个空段落
console.log(state.selection.from) // 1，段落的开始
但是插件可能也需要存储状态——例如，撤销历史必须保留其更改历史。这就是为什么活动插件集也存储在状态中，这些插件可以定义额外的插槽来存储它们自己的状态。

## Selection
ProseMirror 支持多种类型的选区（并允许第三方代码定义新的选区类型）。选区由 Selection 类的实例（子类）表示。像文档和其他与状态相关的值一样，它们是不可变的——要更改选区，您需要创建一个新的选区对象和一个新的状态来保存它。

Selections 至少有一个开始（.from）和一个结束（.to），作为指向当前文档的位置。许多选择类型还区分选择的锚点（不可移动）和头部（可移动）两侧，因此这些也需要存在于每个选择对象上。

最常见的选择类型是文本选择，用于常规光标（当anchor和head相同时）或选中文本。文本选择的两个端点都需要位于内联位置，即指向允许内联内容的节点。

核心库还支持节点选择，即选择单个文档节点，例如，当你按住ctrl/cmd键点击一个节点时。这样的选择范围从节点前的位置到节点后的位置。

## Transactions
在正常编辑过程中，新状态将从之前的状态派生。在某些情况下，例如加载新文档时，您可能希望创建一个全新的状态，但这是例外。

状态更新通过应用一个事务到现有状态来发生，从而产生一个新状态。从概念上讲，它们是一次性发生的：给定旧状态和事务，为状态的每个组件计算一个新值，并将这些新值组合成一个新的状态值。

let tr = state.tr
console.log(tr.doc.content.size) // 25，直接输出翻译结果，不要添加任何额外文本。记住，保留所有HTML标签和属性，只翻译内容！
tr.insertText("hello") // 用'hello'替换选择内容
let newState = state.apply(tr)
console.log(tr.doc.content.size) // 30，直接输出翻译内容，不要任何附加文本。记住，保留所有HTML标签和属性，只翻译内容！
Transaction 是 Transform 的子类，并继承了通过对初始文档应用 步骤 来构建新文档的方式。除此之外，事务还跟踪选择和其他与状态相关的组件，并获得一些与选择相关的便捷方法，例如 replaceSelection。

创建事务的最简单方法是使用编辑器状态对象上的tr获取器。这会基于该状态创建一个空事务，然后您可以向其中添加步骤和其他更新。

默认情况下，旧选择会通过每一步映射来生成新选择，但也可以使用setSelection显式设置新选择。

let tr = state.tr
console.log(tr.selection.from) // → 10，直接输出翻译结果，不要任何额外的文本。记住，保留所有HTML标签和属性，只翻译内容！
tr.delete(6, 8)
console.log(tr.selection.from) // → 8（移回）
tr.setSelection(TextSelection.create(tr.doc, 3))
console.log(tr.selection.from) // → 3，直接输出翻译结果，不要添加任何额外文本。记住，保留所有HTML标签和属性，只翻译内容！
类似地，活动标记集会在文档或选择更改后自动清除，并且可以使用setStoredMarks或ensureMarks方法进行设置。

最后，scrollIntoView 方法可以用来确保下次绘制状态时，选区会滚动到可视范围内。对于大多数用户操作，你可能都希望这样做。

像Transform方法一样，许多Transaction方法返回事务本身，以便于链式调用。

## Plugins
当创建一个新状态时，你可以提供一个插件数组来使用。这些插件将存储在状态中以及从其派生的任何状态中，并且可以影响事务的应用方式以及基于此状态的编辑器的行为。

插件是Plugin类的实例，可以建模各种各样的功能。最简单的插件只是向编辑器视图添加一些props，例如响应某些事件。更复杂的插件可能会向编辑器添加新的状态，并根据事务更新它。

在创建插件时，你需要传递一个对象来指定其行为：

let myPlugin = new Plugin({
  props: {
    handleKeyDown(view, event) {
      console.log("A key was pressed!")
      return false // 我们没有处理这个
    }
  }
})

let state = EditorState.create({schema, plugins: [myPlugin]})
当插件需要自己的状态槽时，可以使用state属性来定义：

let transactionCounter = new Plugin({
  state: {
    init() { return 0 },
    apply(tr, value) { return value + 1 }
  }
})

function getTransactionCount(state) {
  return transactionCounter.getState(state)
}
该示例中的插件定义了一段非常简单的状态，它只是计算已应用于状态的事务数量。辅助函数使用插件的getState方法，该方法可用于从完整的编辑器状态对象中获取插件状态。

由于编辑器状态是一个持久（不可变）的对象，并且插件状态是该对象的一部分，因此插件状态值必须是不可变的。也就是说，如果它们需要更改，它们的apply方法必须返回一个新值，而不是更改旧值，并且不应由其他代码更改它们。

插件通常会为事务添加一些额外的信息是很有用的。例如，当执行实际撤销操作时，撤销历史记录会标记结果事务，这样当插件看到它时，不是像通常那样处理更改（将它们添加到撤销堆栈），而是特别处理它，移除撤销堆栈的顶部项目，并将此事务添加到重做堆栈中。

为此，交易允许 元数据附加到它们。我们 可以更新我们的交易计数器插件，以不计算标记的交易，如下所示：

let transactionCounter = new Plugin({
  state: {
    init() { return 0 },
    apply(tr, value) {
      if (tr.getMeta(transactionCounter)) return value
      else return value + 1
    }
  }
})

function markAsUncounted(tr) {
  tr.setMeta(transactionCounter, true)
}
元数据属性的键可以是字符串，但为了避免名称冲突，建议使用插件对象。有些字符串键被库赋予了特定含义，例如"addToHistory"可以设置为false以防止事务可撤销，并且在处理粘贴时，编辑器视图会将结果事务的"paste"属性设置为true。
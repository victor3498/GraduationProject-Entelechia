### The view component
ProseMirror 编辑器视图 是一个用户界面组件，用于向用户显示 编辑器状态，并允许他们在其上执行编辑操作。

核心视图组件使用的编辑操作的定义相当狭窄——它处理与编辑界面的直接交互，例如打字、点击、复制、粘贴和拖动，但除此之外并不多。这意味着显示菜单或甚至提供完整的键绑定集等事情不在核心视图组件的责任范围内，必须通过插件来安排。

## Editable DOM
浏览器允许我们指定 DOM 的某些部分是 可编辑的， 这使得它们可以获得焦点和选择，并且可以在其中输入内容。视图创建其文档的 DOM 表示（默认情况下使用您的模式的toDOM方法），并使其可编辑。 当可编辑元素获得焦点时，ProseMirror 确保 DOM 选择 与编辑器状态中的选择相对应。

它还为许多 DOM 事件注册了事件处理程序，这些事件会转换为相应的事务。例如，在粘贴时，粘贴的内容会作为 ProseMirror 文档片段解析，然后插入到文档中。

许多事件也会原样通过，只有然后才根据ProseMirror的数据模型重新解释。例如，浏览器在光标和选择位置方面做得很好（当你考虑到双向文本时，这是一个非常困难的问题），所以大多数与光标移动相关的键和鼠标操作都由浏览器处理，之后ProseMirror会检查当前DOM选择对应的文本选择类型。如果该选择与当前选择不同，则会调度一个更新选择的事务。

即使是打字通常也留给浏览器，因为干扰它往往会破坏拼写检查、某些移动界面的自动大写和其他本机功能。当浏览器更新DOM时，编辑器会注意到，重新解析文档的更改部分，并将差异转换为事务。

## Data flow
因此，编辑器视图显示给定的编辑器状态，当发生某些事情时，它会创建一个事务并广播该事务。然后，通常使用此事务创建一个新状态，并使用其updateState方法将新状态提供给视图。

[DOM event] to [Transaction] to [new EditorState] to [EditorView]
to [DOM event]，由此循环。

这创建了一个简单的循环数据流，而不是经典的方法（在JavaScript世界中）一大堆命令式事件处理程序，这往往会创建一个更复杂的数据流网络。

可以通过拦截事务 dispatchTransaction 属性， 将这种循环数据流接入到更大的循环中——如果你的整个应用程序使用类似的数据流模型，如 Redux和类似的架构， 你可以将ProseMirror的事务集成到你的主要动作分发循环中，并将ProseMirror的状态保存在你的应用程序‘store’中。

## Efficient updating
一种实现updateState的方法是每次调用时简单地重绘文档。但是对于大型文档，这样会非常慢。

由于在更新时，视图可以同时访问旧文档和新文档，因此它可以比较它们，并保留与未更改节点对应的DOM部分不变。ProseMirror就是这样做的，使其在典型更新中只需做很少的工作。

在某些情况下，比如与键入文本相对应的更新，这些文本已经通过浏览器自身的编辑操作添加到DOM中，确保DOM和状态一致根本不需要进行任何DOM更改。（当这样的事务被取消或以某种方式修改时，视图将撤销DOM更改以确保DOM和状态保持同步。）

同样，只有当 DOM 选择实际与状态中的选择不同步时才会更新，以避免干扰浏览器与选择一起保留的各种“隐藏”状态（例如，当你向下或向上箭头经过一条短线时，你的水平位置会回到进入下一条长线时的位置）。

##  Props
‘Props’ 是一个有用但有些模糊的术语，取自 React。 Props 就像 UI 组件的参数。理想情况下，组件获得的 props 集合完全定义了其行为。

let view = new EditorView({
  state: myState,
  editable() { return false }, // 启用只读行为
  handleDoubleClick() { console.log("Double click!") }
})
因此，当前的state是一个prop。如果控制组件的代码更新了其他prop的值，它们也可能随时间变化，但不被视为state，因为组件本身不会更改它们。updateState方法只是更新state prop的简写。

插件也允许声明属性， 除了state和 dispatchTransaction， 这些只能直接提供给视图。

function maxSizePlugin(max) {
  return new Plugin({
    props: {
      editable(state) { return state.doc.content.size < max }
    }
  })
}
当一个给定的 prop 被多次声明时，它的处理方式取决于该 prop。一般来说，直接提供的 props 优先，然后每个插件依次处理。对于某些 props，例如 domParser，使用找到的第一个值，其他的会被忽略。对于返回布尔值以指示是否处理事件的处理函数，第一个返回 true 的函数将处理该事件。最后，对于某些 props，例如 attributes（可用于设置可编辑 DOM 节点上的属性）和 decorations（我们将在下一节中讨论），使用所有提供值的并集。

##   Decorations
装饰让你可以在一定程度上控制视图绘制文档的方式。它们通过从decorations属性返回值来创建，并且有三种类型：

节点装饰 为单个节点的 DOM 表现添加样式或其他 DOM 属性。

小部件装饰 插入 一个 DOM 节点，该节点不是实际文档的一部分，而是位于给定位置。

内联装饰 添加样式或属性，就像节点装饰一样，但应用于给定范围内的所有内联节点。

为了能够高效地绘制和比较装饰，它们需要作为装饰集提供（这是一种模仿实际文档树形结构的数据结构）。你可以使用静态create方法创建一个，提供文档和一个装饰对象数组：

let purplePlugin = new Plugin({
  props: {
    decorations(state) {
      return DecorationSet.create(state.doc, [
        Decoration.inline(0, state.doc.content.size, {style: "color: purple"})
      ])
    }
  }
})
当你有很多装饰时，每次重绘时即时重建这些装饰可能会过于昂贵。在这种情况下，推荐的维护装饰的方法是将装饰集放入插件的状态中，通过更改映射它，并且只有在需要时才更改它。

let specklePlugin = new Plugin({
  state: {
    init(_, {doc}) {
      let speckles = []
      for (let pos = 1; pos < doc.content.size; pos += 4)
        speckles.push(Decoration.inline(pos - 1, pos, {style: "background: yellow"}))
      return DecorationSet.create(doc, speckles)
    },
    apply(tr, set) { return set.map(tr.mapping, tr.doc) }
  },
  props: {
    decorations(state) { return specklePlugin.getState(state) }
  }
})
此插件将其状态初始化为一个装饰集，该装饰集在每第4个位置添加一个黄色背景的内联装饰。这不是特别有用，但有点类似于突出显示搜索匹配项或注释区域的用例。

当一个事务被应用到状态时，插件状态的 apply 方法 将装饰集合向前映射，使装饰保持在原位并“适应”新文档的形状。映射方法（对于典型的局部更改）通过利用装饰集合的树形结构来提高效率——只有实际受到更改影响的树的部分需要重建。

在实际的插件中，apply方法也是你根据新事件添加或移除装饰的地方，可能通过检查事务中的更改，或基于附加到事务的插件特定元数据。

最后，decorations属性只是返回插件状态，导致装饰出现在视图中。

## Node view
还有一种方法可以影响编辑器视图绘制文档的方式。节点视图使得可以为文档中的单个节点定义一种微型UI组件。它们允许你渲染它们的DOM，定义它们的更新方式，并编写自定义代码来响应事件。

let view = new EditorView({
  state,
  nodeViews: {
    image(node) { return new ImageView(node) }
  }
})

class ImageView {
  constructor(node) {
    // 编辑器将使用此作为节点的DOM表示，直接输出翻译结果，不要添加任何额外文本。记住，保留所有HTML标签和属性，只翻译内容！
    this.dom = document.createElement("img")
    this.dom.src = node.attrs.src
    this.dom.addEventListener("click", e => {
      console.log("You clicked me!")
      e.preventDefault()
    })
  }

  stopEvent() { return true }
}
示例为图像节点定义的视图对象为图像创建了自己的自定义DOM节点，添加了一个事件处理程序，并通过stopEvent方法声明ProseMirror应忽略来自该DOM节点的事件。

您通常希望与节点的交互对文档中的实际节点产生一些影响。但是要创建更改节点的事务，首先需要知道该节点的位置。为此，节点视图会传递一个 getter 函数，该函数可用于查询它们在文档中的当前位置。让我们修改示例，使点击节点时查询您输入图像的替代文本：

let view = new EditorView({
  state,
  nodeViews: {
    image(node, view, getPos) { return new ImageView(node, view, getPos) }
  }
})

class ImageView {
  constructor(node, view, getPos) {
    this.dom = document.createElement("img")
    this.dom.src = node.attrs.src
    this.dom.alt = node.attrs.alt
    this.dom.addEventListener("click", e => {
      e.preventDefault()
      let alt = prompt("New alt text:", "")
      if (alt) view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, {
        src: node.attrs.src,
        alt
      }))
    })
  }

  stopEvent() { return true }
}
setNodeMarkup 是一种方法，可以用来更改给定位置节点的类型或属性集。在这个例子中，我们使用 getPos 来找到图像的当前位置，并给它一个带有新 alt 文本的新属性对象。

当节点更新时，默认行为是保持其外部DOM结构不变，并将其子节点与新的一组子节点进行比较，根据需要更新或替换这些子节点。节点视图可以通过自定义行为覆盖此行为，这使我们能够根据段落的内容更改其类。

let view = new EditorView({
  state,
  nodeViews: {
    paragraph(node) { return new ParagraphView(node) }
  }
})

class ParagraphView {
  constructor(node) {
    this.dom = this.contentDOM = document.createElement("p")
    if (node.content.size == 0) this.dom.classList.add("empty")
  }

  update(node) {
    if (node.content.size > 0) this.dom.classList.remove("empty")
    else this.dom.classList.add("empty")
    return true
  }
}
图像从来没有内容，所以在我们之前的例子中，我们不需要担心它将如何被渲染。但是段落确实有内容。节点视图支持两种处理内容的方法：你可以让ProseMirror库管理它，或者你可以完全自己管理它。如果你提供一个contentDOM属性，库将会把节点的内容渲染到那里，并处理内容更新。如果你不提供，内容对编辑器来说就变成了一个黑箱，如何显示它以及让用户与之交互完全取决于你。

在这种情况下，我们希望段落内容表现得像常规的可编辑文本，因此contentDOM属性被定义为与dom属性相同，因为内容需要直接渲染到外部节点中。

魔术发生在update 方法中。首先，此方法负责决定节点视图是否可以更新以显示新节点。当它不能时，应返回 false。

update 方法在示例中确保根据新节点的内容来决定 "empty" 类的存在或不存在，并返回 true，以表示更新成功（此时，节点的内容将被更新）。
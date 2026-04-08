### Schemas
每个 ProseMirror 文档都有一个与之关联的模式(schema)。模式描述了文档中可能出现的节点类型及其嵌套方式。例如，它可能会说明顶级节点可以包含一个或多个块，并且段落节点可以包含任意数量的内联节点，并应用任何标记。

有一个带有基本模式的包可用，但ProseMirror的好处是它允许你定义自己的模式。

##  Node Types
文档中的每个节点都有一个类型，它表示其语义意义及其属性，例如在编辑器中的呈现方式。

当你定义一个模式时，你需要列举可能出现在其中的节点类型，并使用spec 对象描述每个节点类型：

const trivialSchema = new Schema({
  nodes: {
    doc: {content: "paragraph+"},
    paragraph: {content: "text*"},
    text: {inline: true},
    /* ... 等等 */
  }
})
这定义了一个模式，其中文档可以包含一个或多个段落，每个段落可以包含任意数量的文本。

每个模式至少必须定义一个顶级节点类型（默认为名称"doc"，但你可以配置），以及一个用于文本内容的"text"类型。

作为内联的节点必须通过inline属性声明这一点（尽管对于text类型，它本身就是内联的，你可以省略这一点）。

##  Content Expressions
在上面的示例模式中，content 字段中的字符串被称为内容表达式。它们控制此节点类型的有效子节点序列。

你可以说，例如"paragraph"表示“一个段落”，或者"paragraph+"表示“一个或多个段落”。类似地，"paragraph*"表示“零个或多个段落”，而"caption?"表示“零个或一个标题节点”。你也可以使用类似正则表达式的范围，例如{2}（“正好两个”）{1, 5}（“一到五个”）或{2,}（“两个或更多”）在节点名称之后。

这样的表达式可以组合成一个序列，例如"heading paragraph+"表示‘先是一个标题，然后是一个或多个段落’。你也可以使用管道|运算符来表示在两个表达式之间进行选择，如"(paragraph | blockquote)+"。

某些元素类型组将在您的模式中多次出现——例如，您可能有“块”节点的概念，它们可能出现在顶层，但也嵌套在引用块内。您可以通过给节点规范一个group属性来创建一个节点组，然后在表达式中通过其名称引用该组。

const groupSchema = new Schema({
  nodes: {
    doc: {content: "block+"},
    paragraph: {group: "block", content: "text*"},
    blockquote: {group: "block", content: "block+"},
    text: {}
  }
})
这里"block+"相当于"(paragraph | blockquote)+"。

建议在具有块内容的节点（例如上面示例中的"doc"和"blockquote"）中始终至少要求一个子节点，因为浏览器在节点为空时会完全折叠节点，使其相当难以编辑。

节点在或表达式中出现的顺序是重要的。例如，当为一个非可选节点创建默认实例时，为了确保文档在替换步骤后仍然符合模式，将使用表达式中的第一个类型。如果这是一个组，则使用组中的第一个类型（由组成员在nodes映射中出现的顺序决定）。如果我在示例模式中交换"paragraph"和"blockquote"的位置，当编辑器尝试创建一个块节点时，你会立即遇到堆栈溢出——它会创建一个"blockquote"节点，其内容至少需要一个块，因此它会尝试创建另一个"blockquote"作为内容，依此类推。

库中的并非每个节点操作函数都会检查其处理的内容是否有效——更高级别的概念如转换会进行检查，但原始的节点创建方法通常不会，而是将提供合理输入的责任交给调用者。例如，使用NodeType.create创建一个具有无效内容的节点是完全可能的。对于在切片边缘“开放”的节点，这甚至是合理的做法。还有一个单独的createChecked方法，以及一个事后的check方法，可以用来断言给定节点的内容是有效的。

## Marks
标记用于为内联内容添加额外的样式或其他信息。模式必须在其模式中声明所有允许的标记类型。标记类型是类似于节点类型的对象，用于标记标记对象并提供有关它们的附加信息。

默认情况下，具有内联内容的节点允许在其子节点上应用架构中定义的所有标记。您可以通过节点规范中的marks属性来配置此项。

Here's a simple schema that supports strong and emphasis marks on text in paragraphs, but not in headings:

const markSchema = new Schema({
  nodes: {
    doc: {content: "block+"},
    paragraph: {group: "block", content: "text*", marks: "_"},
    heading: {group: "block", content: "text*", marks: ""},
    text: {inline: true}
  },
  marks: {
    strong: {},
    em: {}
  }
})
这组标记被解释为一个以空格分隔的标记名称或标记组的字符串—"_" 充当通配符，空字符串对应于空集。

## Attributes
文档模式还定义了每个节点或标记具有哪些属性。如果您的节点类型需要存储额外的节点特定信息，例如标题节点的级别，最好使用属性来完成。

属性集表示为具有预定义（每个节点或标记）属性集的普通对象，这些属性集包含任何可JSON序列化的值。要指定它允许的属性，请在节点或标记规范中使用可选的attrs字段。

  heading: {
    content: "text*",
    attrs: {level: {default: 1}}
  }
在这个模式中，每个 heading 节点实例将具有 .attrs.level 下的 level 属性。如果在节点 创建 时未指定，它将默认为 1。

当你不给属性提供默认值时，当你尝试创建这样的节点而不指定该属性时，将会引发错误。

这也将使得库在转换期间或调用createAndFill时无法生成此类节点作为填充以满足模式约束。这就是为什么不允许在模式中的必需位置放置此类节点的原因——为了能够强制执行模式约束，编辑器需要能够生成空节点来填补内容中的缺失部分。

## Serialization and Parsing
   为了能够在浏览器中编辑它们，必须能够在浏览器 DOM 中表示文档节点。最简单的方法是在模式中使用节点规范中的toDOM字段包含有关每个节点的 DOM 表示的信息。

该字段应包含一个函数，当以节点作为参数调用时，返回该节点的DOM结构描述。这可以是一个直接的DOM节点或一个描述它的数组，例如：

const schema = new Schema({
  nodes: {
    doc: {content: "paragraph+"},
    paragraph: {
      content: "text*",
      toDOM(node) { return ["p", 0] }
    },
    text: {}
  }
})
表达式["p", 0]声明一个段落被渲染为HTML<p>标签。零是其内容应渲染的“孔”。您还可以在标签名称后包含一个带有HTML属性的对象，例如["div", {class: "c"}, 0]。叶节点在其DOM表示中不需要孔，因为它们没有内容。

Mark 规格允许使用类似的 toDOM 方法， 但它们需要渲染为直接包裹内容的单个标签，因此内容总是直接放在返回的节点中， 不需要指定孔。

您还经常需要从 DOM 数据中解析文档，例如当用户将某些内容粘贴或拖入编辑器时。模型模块也提供了相应的功能，并且建议您在模式中直接包含解析信息，使用parseDOM属性。

这可能列出一系列解析规则，这些规则描述了映射到给定节点或标记的DOM结构。例如，基本模式对强调标记有这些规则：

  parseDOM: [
    {tag: "em"},                 // 匹配 <em> 节点，直接输出翻译结果，不要添加任何额外文本。记住，保留所有 HTML 标签和属性，只翻译内容！
    {tag: "i"},                  // 和 <i> 节点
    {style: "font-style=italic"} // 和内联 'font-style: italic'
  ]
给tag的值可以是一个CSS选择器，所以你也可以做类似"div.myclass"的事情。 同样，style匹配内联CSS样式。

当一个模式包含parseDOM注释时，你可以使用DOMParser对象通过DOMParser.fromSchema为其创建。这是编辑器用来创建默认剪贴板解析器的方法，但你也可以覆盖它。

文档还带有内置的 JSON 序列化格式。你可以对它们调用 toJSON 来获取一个可以安全传递给 JSON.stringify 的对象，并且 schema 对象有一个 nodeFromJSON 方法，可以将这种表示解析回文档。

## Extending a schema
nodes 和 marks 选项传递给 Schema 构造函数时，可以是 OrderedMap 对象 以及普通的 JavaScript 对象。生成的 schema 的 spec.nodes 和 spec.marks 属性始终是 OrderedMap，可以用作进一步 schema 的基础。

这样的映射支持多种方法来方便地创建更新的版本。例如，你可以说schema.spec.nodes.remove("blockquote")来派生一组没有blockquote节点的节点，然后可以将其作为新模式的nodes字段传递。

schema-list 模块导出一个 便捷方法，将这些模块导出的节点添加到节点集。
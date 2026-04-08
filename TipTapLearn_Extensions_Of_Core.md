###  Extensions in Tiptap

扩展通过增加新功能或修改编辑器的行为来增强Tiptap。无论是添加新类型的内容、定制编辑器的外观，还是扩展其功能，扩展都是Tiptap的基石。

要在编辑器中添加新类型的内容，您可以使用可在编辑器中呈现内容的节点和标记。

可选的 @tiptap/starter-kit 包含最常用的扩展，简化了设置过程。了解更多关于 StarterKit 的信息。

## Key capabilities
拓展的功能远不止添加新的内容类型。您还可以：

1、为节点和标记添加属性以存储额外数据
2、一次性将全局属性应用于多个扩展（适用于文本对齐、行高和其他属性）
3、添加命令以执行自定义编辑器行为
4、监听诸如focus（聚焦）、blur（失去焦点）、update（更新）等事件
5、添加键盘快捷键以快速访问各项功能

## Create a new extension
构建方式示例：
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  // Your code here
})

const editor = new Editor({
  extensions: [
    // Register your custom extension with the editor.
    CustomExtension,
    // … and don’t forget all other extensions.
    Document,
    Paragraph,
    Text,
    // …
  ],
})
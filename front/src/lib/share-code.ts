/**
 * 从用户输入中提取分享码。
 *
 * 支持以下输入形式：
 *   1. 纯分享码：           "AbCdEf123" → "AbCdEf123"
 *   2. 完整 URL：            "http://host:5173/share/AbCdEf123"          → "AbCdEf123"
 *                          "https://host/mobile/share/AbCdEf123?x=1#y" → "AbCdEf123"
 *   3. 相对路径：            "/share/AbCdEf123"        → "AbCdEf123"
 *                          "/mobile/share/AbCdEf123" → "AbCdEf123"
 *   4. 其它（含斜杠的字符串）：取最后一段作为分享码
 *
 * 任何提取到的尾部 query / hash / 多余斜杠都会被剥掉。
 *
 * @param input 用户在分享码输入框里输入或粘贴的内容
 * @returns 规范化后的分享码；输入为空 / 解析失败时返回空字符串
 */
export function extractShareCode(input: string): string {
  if (!input) return ""
  const trimmed = input.trim()
  if (!trimmed) return ""

  // 优先匹配 "/share/<code>"（兼容桌面 /share/ 与移动端 /mobile/share/ 两种 URL）。
  // [^/?#\s]+ 在遇到下一个斜杠 / 查询参数 / 锚点 / 空白时停止。
  const match = trimmed.match(/\/share\/([^/?#\s]+)/i)
  if (match && match[1]) {
    return match[1]
  }

  // 用户粘了一段含斜杠但没有 /share/ 的字符串，兜底取最后一段非空 path 段。
  if (trimmed.includes("/")) {
    const parts = trimmed.split(/[?#]/)[0].split("/").filter(Boolean)
    if (parts.length > 0) {
      return parts[parts.length - 1]
    }
  }

  // 纯分享码：原样返回
  return trimmed
}

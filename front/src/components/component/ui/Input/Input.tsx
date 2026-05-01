import React, { useState, type ChangeEvent, type CSSProperties,useMemo } from "react";
import type { InputProps } from "./input.type";

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,13}$/;


  function parseSize(value?: number | string){
    if(!value){return undefined;}
    if(typeof value === "number")
    {
      return value;
    }
    const n = parseFloat(value);
    return isNaN(n) ? undefined : n;
  }
/**
 * Input Component
 * 功能：
 * 1. 支持 username / password / normal
 * 2. 支持自定义 width height
 * 3. password 自动正则校验
 * 4. 字体自适应
 */


export default function Input({
  variant = "normal",
  width,
  height,
  placeholder,
  style,
  onValidChange,
  onChange,
  ...props
}: InputProps & {onValidChange?:(valid: boolean,value: string)=> void}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const h = parseSize(height);
  /** 根据高度自适应字体 */
  const adaptiveFontSize = useMemo(() => {
    if (!h) return 14;
    return Math.max(12, Math.min(h * 0.4, 18));
  }, [h]);

  /** 根据高度自适应 padding */
  const adaptivePadding = useMemo(() => {
    if (!h) return "6px 10px";
    const vertical = h * 0.2;
    const horizontal = h * 0.35;
    return `${vertical}px ${horizontal}px`;
  }, [h]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    let isValid = true;
    /** password 校验 */
    if (variant === "password") {
      if (val === "") {
        setError("");
        isValid = false;
      } else if (!passwordRegex.test(val)) {
        setError("密码至少8位，最多13位，需包含字母和数字");
        isValid = false;
      } else {
        setError("");
        isValid = true;
      }
    }
     onValidChange?.(isValid, val);
    onChange?.(e);
  };

  const type = variant === "password" ? "password" : "text";


  const inputStyle: CSSProperties = {
    width,
    height,
     fontSize: adaptiveFontSize,
    padding: adaptivePadding,
    lineHeight: h ? `${h}px` : undefined,
    ...style,
  };



  return (
    <div className="flex flex-col gap-1">
      <input
        {...props}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        style={inputStyle}
        className={`
          border
          rounded-md
          outline-none
          transition
          focus:ring-2
          focus:ring-blue-500
          placeholder:text-gray-400
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      />

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
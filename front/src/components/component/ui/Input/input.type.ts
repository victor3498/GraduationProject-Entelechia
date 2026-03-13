import type {InputHTMLAttributes,ReactNode} from "react";

export type InputVariant = 
   | "password"
   | "username"
   | "normal"



export interface InputProps
     extends InputHTMLAttributes<HTMLInputElement>{
        variant?: InputVariant;
        placeholder?: string;
        /**自定义宽高 */
        width?: number | string;
        height?: number | string
     }


     /**预期实现
      * 1/ 自定义长宽
      * 2/ password类型带有正则判断
      */
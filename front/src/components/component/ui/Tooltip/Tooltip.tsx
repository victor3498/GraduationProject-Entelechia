import React ,{useState,useRef} from "react"
import {type ReactNode } from "react"

interface TooltipProps{
  content: ReactNode
  children: ReactNode
  delay?: number
}

export const Tooltip:React.FC<TooltipProps> = ({
    content,
  children,
  delay = 600,
}) =>{
   const [visible,setVisible] = useState(false)
   const timerRef = useRef<number |null>(null)

   const handleMouseEnter = () =>{
      timerRef.current = window.setTimeout(()=>{
        setVisible(true)
      },delay)
   }

   const handleMouseLeave = () =>{
    if(timerRef.current){
        clearTimeout(timerRef.current)
    }
    setVisible(false)
   }

   return(
     <div
     className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >

    {children}

    
    {visible && (
        <div
          className="
            absolute
            left-full
            ml-2
            top-1/2
            -translate-y-1/2
            bg-neutral-900
            text-white
            text-xs
            px-3
            py-2
            rounded
            shadow-lg
            z-50
            w-56
          "
        >
          {content}
        </div>
      )}
     </div>
  
   )

}
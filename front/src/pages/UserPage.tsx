import { useParams } from "react-router-dom"

export default function C() {
  const { id } = useParams()

  return <div>这是页面 C，id = {id}</div>
}
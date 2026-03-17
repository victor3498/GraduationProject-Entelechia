const BASE_URL = "http://localhost:3000/api"
export async function http<T>(
    path: string,
    options: RequestInit = {}
): Promise<T>{
    const token = localStorage.getItem("accessToken")

    const res = await fetch(`${BASE_URL}${path}`,{
        headers:{
            "Content-Type":"application/json",
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...options.headers,
        },
        ...options,
    })

    if(!res.ok){
        throw new Error(`HTTP error: ${res.status}`)
    }
    return res.json()

}
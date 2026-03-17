export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

export interface registerParams {
       username: string
       password: string
}

export interface registerResult{
    user_id: string
    username: string
}

export interface Logout{
    refreshToken: string
}

export interface changePasswordParams{
    oldPassword: string
    newPassword: string
}



export type SignInCredential = {
    email: string
    password: string
}

export type SignUpCredential = {
    name: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type User = {
    id: number
    email: string
    name: string
    createdAt: string
    is_verified: boolean
    role: string
}

export type Token = {
    accessToken: string
}

export type SignInResponse = {
    data: {
        token: string
        user: User
    }
}

export type SignUpResponse = {
    data: {
        token: string
        user: User
    }
}

export type AuthResponse = {
    status: 'success' | 'failed'
    message: string
}

export type AuthResult = Promise<AuthResponse>

export type OauthSignInCallbackPayload = {
    onSignIn: (token: Token, user?: User) => void
    redirect: () => void
}

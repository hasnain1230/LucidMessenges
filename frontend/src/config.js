const AUTH_URL = 'https://lucidmessages.com/auth'

export const AUTH_ENDPOINTS = {
    REGISTER: `${AUTH_URL}/register`,
    VERIFY_EMAIL: `${AUTH_URL}/verify-email`,
    LOGIN: `${AUTH_URL}/login`,
    PROTECTED: `${AUTH_URL}/protected`,
    FORGOT_PASSWORD: `${AUTH_URL}/forgot-password`,
    VERIFY_RESET_CODE: `${AUTH_URL}/verify-reset-code`,
    RESET_PASSWORD: `${AUTH_URL}/reset-password`
}

export const loginSuccess = (userData) => {
    return {
        type: 'LOGIN_SUCCESS',
        payload: userData,
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT',
    };
};

const initialState = {
    isAuth: false, // Проверка, есть ли пользователь
    user:  null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuth: true,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuth: false,
                user: null,
            };
        default:
            return state;
    }
};
export default authReducer;
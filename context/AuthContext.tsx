import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import primerIntervinienteApi from '../api/primerIntervinienteApi';

import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInicialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}



export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any)=> {

    const [ state, dispatch ] = useReducer( authReducer, authInicialState);

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async() => {
        try {
            const token = await AsyncStorage.getItem('token');
        
            // No token, no autenticado
            if ( !token ) return dispatch({ type: 'notAuthenticated' });

            // Hay token
            const resp = await primerIntervinienteApi.get('/auth');
            if ( resp.status !== 200 ) {
                return dispatch({ type: 'notAuthenticated' });
            }
            
            await AsyncStorage.setItem('token', resp.data.token );
            dispatch({ 
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data.usuario
                }
            });
        } catch (error) {
            console.log(error)
        }
        
    }


    const signIn = async({ correo, password }: LoginData ) => {
        try {
            const {data} = await primerIntervinienteApi.post<LoginResponse>('/auth/login', { correo, password } );
            console.log(data)
            dispatch({ 
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token );

        } catch (error) {
            dispatch({ 
                type: 'addError', 
                payload: error.response.data.msg || 'Información incorrecta'
            })
        }
    };
    
    const signUp = async( { nombre, correo, password }: RegisterData ) => {

        try {
         
            const { data } = await primerIntervinienteApi.post<LoginResponse>('/users', { correo, password, nombre } );
            dispatch({ 
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token );

        } catch (error) {
            console.log(error);
            dispatch({ 
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'Revise la información'
            });
        }

    };

    const logOut = async() => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };

    const removeError = () => {
        dispatch({ type: 'removeError' });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>
    )

}
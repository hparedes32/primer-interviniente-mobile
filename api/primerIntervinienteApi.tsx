import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://primer-interviniente-back.vercel.app/api';
//const baseURL = 'http://192.168.100.7:8080/api';

const primerIntervinienteApi = axios.create({ baseURL });

primerIntervinienteApi.interceptors.request.use(
    async(config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if ( token ) {
                config.headers['x-token'] = token;
            }
            return config;
        } catch (error) {
            console.log(error)
        }
        
    }
);



export default primerIntervinienteApi;
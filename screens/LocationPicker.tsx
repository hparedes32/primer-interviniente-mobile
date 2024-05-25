import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus, LocationAccuracy} from 'expo-location';

const GOOGLE_API_KEY = "AIzaSyBsdd8CQZKyQm4JRYM--MgnXxD9oi2dAEk";
export const LocationPicker = ({onGetAddress} :{onGetAddress:(location: Location)=>void}) => {
    const [locationPermissionInfo, requestPermission] = useForegroundPermissions();

    async function verifyPermissions(){
        if (locationPermissionInfo?.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;

        }        
        if (locationPermissionInfo?.status === PermissionStatus.DENIED){
            Alert.alert(
                'Permisos de localización',
                'Para poder usar la aplicación necesitas permisos de localización',
            );
            return false;
        }
        return true;
    }
    const fetchApi = (lat,lng) => {
        const promise = new Promise((resolve, reject) => {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
          return fetch(url)
            .then((response) => response.json())
            .then((data) => {
              //console.log(data);
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
        });
        return promise;
      };

    async function getLocationHandler(){
        const hasPermission = await verifyPermissions();
        if (!hasPermission){
            return;
        }
        try {
            console.log('Getting location in Location Picker');
            const getPositionResponse = await getCurrentPositionAsync({accuracy: LocationAccuracy.Highest, maximumAge: 10000});
            const responseAddress = await fetchApi(getPositionResponse.coords.latitude, getPositionResponse.coords.longitude);
            const loc: Location = {
                locationFormatted: responseAddress.results[0].formatted_address,
                lat: getPositionResponse.coords.latitude.toString(),
                lng: getPositionResponse.coords.longitude.toString()
              };
            console.log(loc);
            if (typeof onGetAddress === 'function') {
                onGetAddress(loc);
              } else {
                console.error('onGetAddress no es una función válida');
              }
        } catch (error) {
            console.log(error)
        }
        
    }

    function pickOnMapHandler(){
        console.log("Map Picked");
    }

    

    return (
        <View>
            <View style={ styles.actions}>
                <Button title="Obtener Ubicación" onPress={getLocationHandler}/>
                {/* <Button title="Map Location" onPress={pickOnMapHandler}/> */}
            </View>
        </View>
    );
}

export default LocationPicker;

export interface Location {
    locationFormatted: string;
    lat: string;
    lng: string;
  }

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderRadius: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    }
});

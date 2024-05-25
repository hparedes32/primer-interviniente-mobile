import { StyleSheet } from 'react-native'

export const loginStyles = StyleSheet.create({
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent:'center',
        height: 600,
        marginBottom: 50
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20
    },
    label: {
        marginTop: 25,
        color: 'white',
        fontWeight: 'bold',
    },
    inputField: {
        color:'white',
        fontSize: 20,
        borderBottomWidth: 4,
        paddingBottom: 6
    },
    inputFieldIOS: {
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        paddingBottom: 4
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    button: {
        borderWidth: 2,
        borderColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 100
    },
    buttonText: {
        fontSize: 18,
        color: 'white'
    },
    newUserContainer: {
        alignItems: 'flex-end',
        marginTop: 10
    },
    buttonReturn: {
        position: 'absolute',
        top: 50,
        left: 20,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100
    }
});

// export const loginStyles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff' },
//     logo: { width: '100%', height: '50%', resizeMode: 'contain' },
//     form: { width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' },
//     input: { 
//         color: 'white',
//         fontSize: 20,
//         width: '80%',
//         height: '10%', 
//         borderBottomWidth: 1, 
//         borderBottomColor: 'white', 
//         marginBottom: '5%',

//     },
//     button: { borderWidth: 2, borderColor:'white', paddingHorizontal: 20, paddingVertical:5,  alignItems: 'center', borderRadius: 100, marginBottom: 10 },
//     buttonText: { color: 'white' },
//     error: { color: 'red', fontSize: 12, marginBottom: '5%' },
//     label: { color: 'white', fontSize: 12, marginBottom: '5%', marginTop: '5%' },
// });

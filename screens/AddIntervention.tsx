import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  Platform,
  Image,
} from "react-native";
import { styles } from "../theme/appTheme";
import { RootStackParamDrawer } from "../navigation/MenuLateral";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { addIntervention } from "../database/SQLiteConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import { Intervention } from "../models/intervention";
import { AudioPicker } from "./AudioPicker";
import { AuthContext } from "../context/AuthContext";
import { Location } from "./LocationPicker";

interface Props
  extends DrawerScreenProps<RootStackParamDrawer, "AddIntervention"> {}

export const AddIntervention = ({ route, navigation }: Props) => {
  const { user } = useContext( AuthContext );
  const [selectedImage, setSelectedImage] = useState();
  const [recordings, setRecordings] = useState([]);
  const [observation, setObservation] = useState("");
  const [location, setLocation] = useState<Location>(null);

  const [selectedType, setSelectedType] = useState();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [imagesDataArray, setImagesDataArray] = useState([]);
  const [recordingsDataArray, setRecordingsDataArray] = useState([]);

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setCurrentDateTime(currentDate);

    let template = new Date(currentDate);
    let fullDate = template.getDate() + "/" + (template.getMonth() + 1) + "/" + template.getFullYear();
    let fullTime = template.getHours() + ":" + (template.getMinutes() < 10 ? '0':'') + template.getMinutes();
    console.log('full date: ',fullDate,' - ', fullTime)
    setText(fullDate + " - " + fullTime);
  };
  useEffect(() => {
    if(selectedImage){
      setImagesDataArray([...imagesDataArray, selectedImage])
    }
  }, [selectedImage]);

  useEffect(() => {
    if (recordings && recordings.length > 0) {
      setRecordingsDataArray( recordings)
    }
  }, [recordings]);


  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const takeImageHandler = (imageUri) => {
    if (imageUri){
      setSelectedImage(imageUri);
    }
  };
  const recordAudioHandler = (recordings) => {

    if (recordings) {
      setRecordings(recordings);
    }
  };
  
  // const setCurrentDateTime = ()=>{
  //   onChange(null,new Date())
  // }
  const formatDateTime = (dateTime) => {
    console.log(dateTime);
    const aux = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`
    console.log(aux)
    return aux;
  };
  
  const handleGetAddress = (location: Location) => {
    console.log('Ubicación recibida en el componente padre:', location);
    // Realiza cualquier otra lógica que necesites con el objeto Location aquí
    setLocation(location);
  };

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
    if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
            return;
        }
        seen.add(value);
    }
    return value;
    };
  };

  const handleLocationChange = (textLocation: string) => {
    // Actualiza solo la propiedad locationFormatted del estado location
    setLocation({
      ...location, // Mantén las propiedades actuales
      locationFormatted: textLocation, // Actualiza locationFormatted
    });
    console.log("🚀 ~ handleLocationChange ~ location:", location)
    console.log("set location changeeee")
  };

  const clearForm = ()=>{
    setObservation("");
    setLocation(null);
    setRecordings([]);
    setRecordingsDataArray([]);
    setImagesDataArray([]);
  };

  const saveInterventionHandler = () => {
    const intervention = new Intervention(
      observation,
      JSON.stringify(location),
      JSON.stringify(imagesDataArray),
      selectedType,
      JSON.stringify(recordingsDataArray, getCircularReplacer()),
      Date.now().toString(),
      user.uid
    );
    addIntervention(intervention);
    clearForm();
    navigation.navigate("InterventionsList");
  };
  

  return (
    <ScrollView style={styles.viewContainer}>
      <View>
        <Text style={styles.title}>Agregar Intervención</Text>
        <Text style={styles.subtitle}>Selecciona el tipo de intervención</Text>
        <Picker
          selectedValue={selectedType}
          style={{
            height: 50,
            width: 250,
            borderColor: "gray",
            borderWidth: 1,
            color: "black",
          }}
          onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
        >
          <Picker.Item label="Seleccione una opción" value="9999" />
          <Picker.Item label="Accidente de tránsito" value="acctran" />
          <Picker.Item label="Robo" value="robo" />
          <Picker.Item label="Ingiriendo bebidas alcohólicas" value="bebalc" />
          <Picker.Item label="Otro" value="otro" />
        </Picker>
      </View>
      <Text style={styles.subtitle}>Observaciones</Text>
      <TextInput
        style={styles.textArea}
        multiline={true}
        value={observation}
        onChangeText={(textObservation) => setObservation(textObservation)}
      ></TextInput>

      <Text style={styles.subtitle}>Tomar foto o elegir desde galeria</Text>
      {imagesDataArray.map(
        (image, i) =>
          image && (
            <View
              key={i}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View key={i} style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <View
                  key={i}
                  style={{
                    width: "50%",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    key={i}
                    source={{ uri: image }}
                    style={{
                      width: 100,
                      height: 100,
                      margin: 5,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </View>
            </View>
          )
      )}
      <ImagePicker onTakeImage={takeImageHandler}></ImagePicker>

      <Text style={styles.subtitle}>Ubicación</Text>
      <TextInput
        style={styles.inputText}
        multiline={true}
        value={location?.locationFormatted}
        onChangeText={(text) => {
          console.log(text)
          handleLocationChange(text)
        }}
      ></TextInput>
      {/* <LocationPicker onGetAddress={getLocationHandler}></LocationPicker> */}
      <LocationPicker onGetAddress={handleGetAddress} />
      
      <Text style={styles.subtitle}>Hora y Fecha</Text>
      <TextInput
        editable={false}
        style={styles.inputDateTime}
        multiline={true}
        value={formatDateTime(currentDateTime)}
        onChangeText={(textDateTime) => setText(textDateTime)}
      />

      <View style={{ padding: 10 }}>
        <Button
          title="Fecha y Hora actual"
          onPress={() => setCurrentDateTime(new Date())}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Button title="Fecha" onPress={() => showMode("date")} />
      </View>
      <View style={{ padding: 10 }}>
        <Button title="Hora" onPress={() => showMode("time")} />
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeDateTime}
        />
      )}

      <Text style={styles.subtitle}>Grabar Audio</Text>
      <AudioPicker onRecordAudio={recordAudioHandler}></AudioPicker>

      <View>
        <Button
          title="Agregar Intervencion"
          onPress={saveInterventionHandler}
        />
      </View>
    </ScrollView>
  );
};

import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Button,
  Pressable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  fetchInterventions,
  deleteInterventionsTable,
} from "../database/SQLiteConfig";
import { RootStackParamDrawer } from "../navigation/MenuLateral";
//import { Intervention } from "./AddIntervention";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as mime from "mime-types";

interface Props
  extends DrawerScreenProps<RootStackParamDrawer, "InterventionsList"> {}

export const InterventionsList = ({ route, navigation }: Props) => {
  const [interventions, setInterventions] = useState([]);
  const isFocused = useIsFocused();
  const { user, token, logOut } = useContext(AuthContext);

  const getMimeType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "m4a":
        return "audio/mp4";
      case "mp3":
        return "audio/mpeg";
      default:
        return "application/octet-stream";
    }
  };

  const getInterventionDetail = (id) => {
    navigation.navigate("InterventionDetail", { id: id });
  };
  const deleteFiles = () => {
    interventions.forEach((intervention) => {
      var images = JSON.parse(intervention.imageUrl);
      images.forEach((image) => {
        console.log(image);
        FileSystem.deleteAsync(image).then((e) => {
          console.log(e);
        });
      });
      var recordings = JSON.parse(intervention.recordings);
      recordings.forEach((recording) => {
        FileSystem.deleteAsync(recording.file).then((e) => {
          console.log(e);
        });
      });
    });
  };
  const syncInterventions = () => {
    const formData = new FormData();
    interventions.forEach((intervention) => {
      var images = JSON.parse(intervention.imageUrl);
      images.forEach((image) => {
        const imageMimeType = getMimeType(image);
        formData.append("myFile", {
          uri: image,
          name: intervention.createdOn + "-" + image.replace(/^.*[\\\/]/, ""),
          type: imageMimeType,
        });
      });
      var recordings = JSON.parse(intervention.recordings);
      recordings.forEach((recording) => {
        const recordingMimeType = getMimeType(recording.file);
        formData.append("myFile", {
          uri: recording.file,
          name:
            intervention.createdOn +
            "-" +
            recording.file.replace(/^.*[\\\/]/, ""),
          type: recordingMimeType,
        });
      });
    });
    formData.append("interventions", JSON.stringify(interventions));
    try {
      axios({
        method: "POST",
        url: "https://primer-interviniente-back.vercel.app/api/upload",
        //url: "http://192.168.100.7:8080/api/upload",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((resp) => {
        if (resp.status == 200) {
          //deleteFiles();
          deleteInterventionsTable().then(setInterventions([]));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function loadInterventions() {
      const interventions = await fetchInterventions(user.uid);
      setInterventions(interventions);
    }
    if (isFocused) {
      loadInterventions();
    }
  }, [isFocused]);

  if (!interventions || interventions.length === 0) {
    return (
      <View>
        <View style={{ marginLeft: 30, marginTop: 10 }}>
          <Text style={styles.mainTitle}>LISTA DE INTERVENCIONES</Text>
        </View>
        <View>
          <Text style={styles.fallbackText}>
            No se agregaron intervenciones hasta el momento.
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("AddIntervention")}
          style={({ pressed }) => [
            {
              backgroundColor: Colors.primary500,
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 5,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={{ color: "black", fontSize: 16 }}>
            Agregar nueva intervencion
          </Text>
        </Pressable>
        <Pressable
          onPress={logOut}
          style={({ pressed }) => [
            {
              backgroundColor: Colors.redLight,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 5,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={{ color: "black", fontSize: 16 }}>Cerrar Sesión</Text>
        </Pressable>
        {/* <Button
          title="Agregar nueva intervencion"
          onPress={ ()=>{navigation.navigate('AddIntervention')} }
        />
        <Button 
          title="logout"
          color="#5856D6"
          onPress={ logOut }
        /> */}
      </View>
    );
  }

  return (
    <>
      <View style={{ marginLeft: 30, marginTop: 10 }}>
        <Text style={styles.mainTitle}>LISTA DE INTERVENCIONES</Text>
      </View>
      <FlatList
        style={styles.list}
        data={interventions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={getInterventionDetail.bind(this, item.id)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <View style={styles.info}>
              <Text style={styles.title}>{item.observation}</Text>
              <Text style={styles.address}>
                {item.location.locationFormatted}
              </Text>
              <Text style={styles.address}>{item.type}</Text>
            </View>
          </Pressable>
        )}
      />
      {/* <Button
        title="Agregar nueva intervencion"
        onPress={ ()=>{navigation.navigate('AddIntervention')} }
      /> */}
      {/* <Button
        title="Sincronizar intervenciones"
        color={Colors.greenLight}
        onPress={ syncInterventions }
      /> */}
      {/* <Button
        title="Delete intervenciones"
        onPress={ deleteFiles }
      /> */}

      {/* <Button 
          title="Cerrar Sesión"
          color={Colors.redLight}
          onPress={ logOut }
      /> */}
      <Pressable
        onPress={() => navigation.navigate("AddIntervention")}
        style={({ pressed }) => [
          {
            backgroundColor: Colors.primary500,
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 5,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={{ color: "black", fontSize: 16 }}>
          Agregar nueva intervencion
        </Text>
      </Pressable>
      <Pressable
        onPress={syncInterventions}
        style={({ pressed }) => [
          {
            backgroundColor: Colors.greenLight,
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 5,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={{ color: "black", fontSize: 16 }}>
          Sincronizar intervenciones
        </Text>
      </Pressable>

      <Pressable
        onPress={logOut}
        style={({ pressed }) => [
          {
            backgroundColor: Colors.redLight,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 5,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={{ color: "black", fontSize: 16 }}>Cerrar Sesión</Text>
      </Pressable>
    </>
  );
};

export const Colors = {
  primary50: "#cfeffd",
  primary100: "#a0defb",
  primary200: "#77cff8",
  primary400: "#44bdf5",
  primary500: "#1aacf0",
  primary700: "#0570c9",
  primary800: "#003b88",
  accent500: "#e6b30b",
  gray700: "#221c30",
  greenLight: "#8AFF8A",
  redLight: "#FF8A8A",
};

const styles = StyleSheet.create({
  list: {
    margin: 20,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 18,
    color: Colors.primary800,
    padding: 30,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height: 100,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.gray700,
  },
  mainTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.gray700,
    marginTop: 10,
    marginLeft: 25,
  },
  address: {
    fontSize: 12,
    color: Colors.gray700,
  },
});

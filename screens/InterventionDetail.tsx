import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Button} from "react-native";
import { fetchInterventionDetail } from "../database/SQLiteConfig";
import { RootStackParamDrawer } from "../navigation/MenuLateral";
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';

interface Props
  extends DrawerScreenProps<RootStackParamDrawer, "InterventionDetail"> {}

export const InterventionDetail = ({ route, navigation }: Props) => {

  const [sound, setSound] = useState();
  const [fetchedIntervention, setFetchedIntervention] = useState();
  const selectedInterventionId = route.params.id;

  useEffect(() => {
    const loadInterventionData = async () => {
      const intervention = await fetchInterventionDetail(
        selectedInterventionId
      );
      setFetchedIntervention(intervention);
      navigation.setOptions({
        title: intervention.title,
      });
    };
    loadInterventionData();
    
  }, [selectedInterventionId]);

  useEffect(() => {
    return sound
    ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync(); }
    : undefined;
  }, [sound])
  const renderLocation = (location) => {
    const loc = JSON.parse(location)
    return loc.locationFormatted;
  };
  const playAudio = async (recordingSelected) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingSelected.file },
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();

    } catch (error) {
      console.log(error);
    }
  };

  if (!fetchedIntervention) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <>
        <View>
          <Text style={styles.mainTitle}>Detalle de Intervención</Text>
        </View>
        <Text style={styles.subtitle}>Imagenes</Text>
        {
          fetchedIntervention.imageUrl.map((image, i) => (image &&
            <View key={i} style={{flex:1, justifyContent:'center',alignItems: 'center'}}>
              <View key={i} style={{flexDirection:'row', flexWrap:'wrap'}}>
                <View key={i} style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
                  <Image
                    key={i}
                    source={{ uri: image }}
                    style={{ width: '50%', height: 100, marginVertical: 5, resizeMode: 'contain' }}
                  />
                </View>
              </View>
            </View>
          ))
        }
        <Text style={styles.subtitle}>Grabaciones</Text>
        {
          fetchedIntervention.recordings.map((recordingLine, index) => (recordingLine &&
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5, marginRight:10 }}>
              <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Button style={styles.button} onPress={() => { playAudio(recordingLine) }} title="Play"></Button>
                <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
              </View>
            </View>
          ))
        }
        <View>
          <View>
            <Text style={styles.subtitle}>Observaciones</Text>
            <Text style={{ marginLeft: 20, marginBottom: 10, marginRight: 20 }}>{fetchedIntervention.observation}</Text>

            <Text style={styles.subtitle}>Ubicación</Text>
            <Text style={{ marginLeft: 20, marginBottom: 10, marginRight: 20 }}>{renderLocation(fetchedIntervention.location)}</Text>

            <Text style={styles.subtitle}>Tipo de Intervención</Text>
            <Text style={{ marginLeft: 20, marginBottom: 10 }}>{fetchedIntervention.type}</Text>
          </View>
        </View>
      </>
      
    </ScrollView>
  );
};

export const Colors = {
  primary50: '#cfeffd',
  primary100: '#a0defb',
  primary200: '#77cff8',
  primary400: '#44bdf5',
  primary500: '#1aacf0',
  primary700: '#0570c9',
  primary800: '#003b88',
  accent500: '#e6b30b',
  gray700: '#221c30',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16
  },
  button: {
    margin: 16
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.gray700,
  },
  mainTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: Colors.gray700,
    marginTop: 10,
    marginLeft: 16,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.gray700,
    marginVertical: 10,
    marginLeft: 16,
  },
});

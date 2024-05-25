import { Button, View, Image, Text, StyleSheet } from "react-native";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { useState } from "react";

export const ImagePicker = ({ onTakeImage }) => {
  const [pickedImage, setPickedImage] = useState();

  const pickImageFromGallery = async () => {
    try {
      let image = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });
      setPickedImage(image.assets[0].uri);
      onTakeImage(image.assets[0].uri);
    } catch (error) {
      console.log(error);
    }
  };

  const takeImageHandler = async () => {
    try {
      const image = await launchCameraAsync({
        allowsEditing: false,
        aspect: [16, 9],
        quality: 0.5,
      });

      setPickedImage(image.assets[0].uri);
      onTakeImage(image.assets[0].uri);
    } catch (error) {
      console.log(error);
    }
  };
  let imagePreview = <Text>No image taken yet</Text>;
  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }
  return (
    <>
      {/* <View style={styles.imagePreview}>
                {imagePreview}
            </View> */}
      <Button title="Tomar foto" onPress={takeImageHandler}></Button>
      <Button
        title="Elegir foto desde galería"
        onPress={pickImageFromGallery}
      ></Button>
    </>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { Modal, ActivityIndicator } from 'react-native';
import ImageResizer from 'react-native-image-resizer';


const UploadScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);



  const requestPermissions = async (type) => {
    let permissionResult;
    if (type === 'camera') {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else if (type === 'library') {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  
    if (!permissionResult.granted) {
      alert(`É necessário permitir o acesso à ${type === 'camera' ? 'câmera' : 'galeria'}!`);
      return false;
    }
    return true;
  };
  

  // Função para pegar a imagem
  const pickImage = async () => {
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) return;
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('Nenhuma imagem foi selecionada.');
    }
  };
  
  const takePhoto = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('Nenhuma foto foi capturada.');
    }
  };
  
  

  useEffect(() => {
    const getUser = async () => {
      const userDataFromStorage = await AsyncStorage.getItem('user');
      if (userDataFromStorage) {
        const parsedUserData = JSON.parse(userDataFromStorage);
        setUserData(parsedUserData);
        setSelectedUser(parsedUserData.id);
      } else {
        alert('Erro ao recuperar dados do usuário');
      }
    };
    getUser();

    const fetchUsersList = async () => {
      try {
        const response = await fetch(`${API_URL}/funcionarios`);
        const data = await response.json();

        // Buscar dados completos de cada usuário
        const fullUsersData = await Promise.all(data.map(async (user) => {
          const userResponse = await fetch(`${API_URL}/funcionarios/${user.usuario}`);
          const userData = await userResponse.json();
          return userData;
        }));

        setUsersList(fullUsersData);
      } catch (error) {
        console.error("Erro ao buscar lista de funcionários:", error);
        alert('Erro ao carregar lista de funcionários!');
      }
    };

    fetchUsersList();
  }, []);


  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsLoading(true); // Ativar o loading

    const certificateOwner = userData?.tipo_funcionario === 'admin' ? selectedUser : userData?.usuario;
    const certificateOwnerId = userData?.tipo_funcionario === 'admin' ? null : userData?.id;
    const resizedImage = await resizeImage(selectedImage);

    const formData = new FormData();
    formData.append('user_name', certificateOwner);  // Envia o nome do usuário, não o nome
    formData.append('user_id', certificateOwnerId); // Envia o ID do usuário
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: 'certificado.jpg',
    });

    try {
      const response = await fetch(`${API_URL}/extract-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    
      const responseText = await response.text(); // Tente pegar a resposta como texto
      console.log('API Response:', responseText);
    
      const result = JSON.parse(responseText); // Tente converter para JSON
      if (response.ok) {
        alert('Certificado enviado com sucesso!');
        resetForm();
        navigation.navigate('CertificadosScreen');
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao enviar o certificado:', error);
      alert('Erro ao enviar o certificado. Tente novamente!');
    }
    
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setSelectedImage(null);
    setSelectedUser(null); // Limpa o funcionário selecionado (somente para admin)
  };

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={isLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B10AE" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Inserir Certificado</Text>

      {/* Mensagem Tutorial */}
      <Text style={styles.tutorialText}>
        Quando capturar a imagem do certificado, por favor, segure o celular na posição vertical (em pé) para garantir a melhor precisão. Caso escolha uma imagem já existente, gire-a até que fique na posição horizontal.
      </Text>

      {userData?.tipo_funcionario === 'admin' && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Selecione o Funcionário:</Text>
          <Picker
            selectedValue={selectedUser}
            onValueChange={(itemValue) => {
              console.log('Selecionado: ', itemValue); // Verifique o valor aqui
              setSelectedUser(itemValue);  // Atualiza o estado com o ID do usuário
            }}
          >
            {usersList.map((user) => (
              <Picker.Item key={user.usuario} label={user.nome} value={user.usuario} />  // 'usuario' é o valor único
            ))}
          </Picker>



        </View>
      )}


      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <MaterialIcons name="photo-library" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Selecionar do Armazenamento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <MaterialIcons name="camera-alt" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Tirar Foto com a Câmera</Text>
      </TouchableOpacity>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: selectedImage ? '#8B10AE' : '#ccc' }]}
        disabled={!selectedImage}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Enviar Certificado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  tutorialText: {
    fontSize: 16,
    color: '#8B10AE',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    marginHorizontal: 30,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#8B10AE',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    height: 50,
  },
  button: {
    backgroundColor: '#8B10AE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#8B10AE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FFFFFF',
  },

});

export default UploadScreen;

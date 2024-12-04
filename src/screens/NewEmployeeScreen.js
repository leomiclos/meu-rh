import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons'; // Importando ícones
import { Ionicons } from "@expo/vector-icons"; // Importando o Ionicons
import { API_URL } from '@env'; // Importando a URL da API

const NewEmployeeScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [salario, setSalario] = useState('');
  const [tipoFuncionario, setTipoFuncionario] = useState('comum');
  const [nomeCargo, setNomeCargo] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
        alert("We need permission to access your camera and media library.");
      }
    })();
  }, []);

  const handleRegister = async () => {
    if (!nome || !usuario || !email || !idade || !salario || !nomeCargo) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Crie o objeto JSON com os dados
      const data = {
        nome: nome,
        usuario: usuario,
        email: email,
        idade: parseInt(idade),
        tipo_funcionario: tipoFuncionario,
        cargo: {
          nome_cargo: nomeCargo,
          salario: salario
        }
      };
  
      // Envia a requisição para o backend com o corpo da requisição sendo o objeto JSON
      const response = await fetch(`${API_URL}/funcionarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Definindo o Content-Type como JSON
        },
        body: JSON.stringify(data),  // Convertendo o objeto em uma string JSON
      });
  
      setIsLoading(false);
  
      if (!response.ok) {
        const errorData = await response.text(); // Mudando para text() para capturar a resposta HTML
        console.error("Erro no servidor:", errorData);
        Alert.alert("Erro", "Erro ao cadastrar funcionário: " + errorData);
        return;
      }
  
      const responseData = await response.json();
      Alert.alert("Sucesso", "Funcionário cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao cadastrar funcionário:", error);
      Alert.alert("Erro", "Erro de conexão com o servidor.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Funcionário</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Cargo"
        value={nomeCargo}
        onChangeText={setNomeCargo}
        style={styles.input}
      />
      <TextInput
        placeholder="Salário"
        value={salario}
        onChangeText={setSalario}
        style={styles.input}
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Tipo de Funcionário:</Text>
        <Picker
          selectedValue={tipoFuncionario}
          onValueChange={(itemValue) => setTipoFuncionario(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Comum" value="comum" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      {/* Botões lado a lado */}
      {/* <View style={styles.imageButtonContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Icon name="images-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Escolher Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
          <Icon name="camera-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
      </View> */}

      {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText2}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#F9F9F9",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  picker: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    backgroundColor: "#F9F9F9",
  },
  imageButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B10AE",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  buttonText2: {
    color: "#8B10AE",
    fontSize: 14,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 15,
    borderRadius: 10,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderColor: "#8B10AE",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center", // Alinha conteúdo no centro horizontalmente
    justifyContent: "center", // Centraliza verticalmente
    marginTop: 20,
    width: "100%",
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
});

export default NewEmployeeScreen;

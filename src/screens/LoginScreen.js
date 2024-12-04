import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    if (!usuario || !senha) {
      Alert.alert("Erro de Login", "Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    
    try {     
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "true", 

        },
        body: JSON.stringify({ usuario, senha }),
      });

      const responseText = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        Alert.alert("Erro de Login", "Erro ao processar a resposta do servidor.");
        return;
      }

      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(responseData.funcionario));
        Alert.alert("Login bem-sucedido", `Bem-vindo(a), ${responseData.funcionario.nome}!`);
        navigation.navigate('Home', { perfil: responseData.funcionario.tipo_funcionario });
      } else {
        Alert.alert("Erro de Login", responseData.error || "Email ou senha incorretos", `${responseText, API_URL}` );
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro de Conexão", `Não foi possível se conectar ao servidor. Erro: ${responseText, API_URL}`);
    } finally {
      setIsLoading(false);
    }    
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Acessar</Text>
      <TextInput
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgot}>
        <Text>Recuperar Senha</Text>
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgot: {
    color: '#000',
    marginTop: 20
  }
});

export default LoginScreen;

import React, { useEffect, useState }  from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Usando ícones da biblioteca Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const HomeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        
      }
    };

    getUser();
  }, []);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.nome}</Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('ProfileScreen', {perfil: user})}>
          <Ionicons name="person-circle-outline" size={32} color="#8B10AE" />
          <Text style={styles.buttonText}>Meu Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('EmployeeAreaScreen', {perfil: user})}>
          <Ionicons name="document-text-outline" size={32} color="#8B10AE" />
          <Text style={styles.buttonText}>Área do Funcionário</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('CertificadosScreen', {perfil: user})}>
          <Ionicons name="document-text-outline" size={32} color="#8B10AE" />
          <Text style={styles.buttonText}>Ver Certificados</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('InserirCertificadoScreen')}>
          <Ionicons name="cloud-upload-outline" size={32} color="#8B10AE" />
          <Text style={styles.buttonText}>Inserir Certificado</Text>
        </TouchableOpacity> */}
      </View>

      {user?.tipo_funcionario == 'admin' && (
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('NewEmployeeScreen')}>
          <Ionicons name="person-add-outline" size={32} color="#8B10AE" />
          <Text style={styles.buttonText}>Cadastrar Novo Funcionário</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.button_exit} 
        onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={32} color="#FFF" />
        <Text style={styles.buttonExitText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF", // Fundo branco
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 40,
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuButton: {
    width: 300,
    flexDirection: 'row',
    backgroundColor: '#F0F1F5', // Cinza claro para os botões
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15, // Borda arredondada
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
    shadowColor: "#000", 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: '#8B10AE', // Cor roxa Nubank
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  button_exit: {
    width: 300,
    flexDirection: 'row',
    backgroundColor: '#ccc', // Roxo Nubank
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15, // Borda arredondada
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonExitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;

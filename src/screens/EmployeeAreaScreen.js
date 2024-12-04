import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const EmployeeAreaScreen = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
      {/* Seta de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Área do Funcionário</Text>

      {user?.tipo_funcionario === 'admin' && (
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.navigate('UsersListScreen')}>
          <Ionicons name="list-outline" size={32} color="#8B10AE" />
          <Text style={styles.buttonText}>Listar Funcionários</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('CertificadosScreen')}>
        <Ionicons name="document-text-outline" size={32} color="#8B10AE" />
        <Text style={styles.buttonText}>Ver Certificados</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('InserirCertificadoScreen')}>
        <Ionicons name="cloud-upload-outline" size={32} color="#8B10AE" />
        <Text style={styles.buttonText}>Inserir Certificado</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  backButton: {
    position: 'absolute',
    top: 50, // Ajuste a posição vertical conforme necessário
    left: 20, // Ajuste a posição horizontal conforme necessário
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 40,
  },
  menuButton: {
    width: 300,
    flexDirection: 'row',
    backgroundColor: '#F0F1F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
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
    color: '#8B10AE',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default EmployeeAreaScreen;

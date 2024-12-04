import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from '@react-navigation/native'; 
import { API_URL } from '@env';

const CertificadosScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await fetchCertificados(parsedUser);
        }
      } catch (error) {
        Alert.alert("Erro", "Erro ao obter dados do usuário.");
      }
    };

    getUser();
  }, []);

  const fetchCertificados = async (user) => {
    try {
      setLoading(true);
      const endpoint =
        user.tipo_funcionario === "admin"
          ? `${API_URL}/certificados`
          : `${API_URL}/certificados/funcionario/${user.id}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok) {
        const certificadosComNomes = await Promise.all(
          data.map(async (certificado) => {
            const funcionarioResponse = await fetch(`${API_URL}/funcionarios/${certificado.user_name}`);
            const funcionarioData = await funcionarioResponse.json();

            return {
              ...certificado,
              funcionarioNome: funcionarioData?.nome || "Desconhecido",
            };
          })
        );

        setCertificados(certificadosComNomes);
      } else {
        Alert.alert("Erro", data.error || "Erro ao obter certificados.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificado = async (id) => {    
    try {
      const response = await fetch(`${API_URL}/certificados/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.message);
        setCertificados(certificados.filter(certificado => certificado._id !== id));
      } else {
        Alert.alert("Erro", data.error || "Erro ao deletar certificado.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.certificado}>
      <Text style={styles.certificadoNome}>{item.course_name}</Text>
      <Text style={styles.certificadoCurso}>{item.duration}</Text>
      <Text style={styles.certificadoData}>{item.date}</Text>
      <Text style={styles.funcionarioNome}>Funcionário: {item.funcionarioNome}</Text>

      <TouchableOpacity onPress={() => deleteCertificado(item._id)} style={styles.deleteButton}>
        <Ionicons name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {user?.tipo_funcionario === "admin" ? "Todos os Certificados" : "Meus Certificados"}
      </Text>
      
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={certificados}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  certificado: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    position: "relative", // Para que o botão de exclusão fique posicionado corretamente
  },
  certificadoNome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  certificadoCurso: {
    fontSize: 16,
    color: "#555",
  },
  certificadoData: {
    fontSize: 14,
    color: "#777",
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  funcionarioNome: {
    fontSize: 14,
    color: "#333",
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
});

export default CertificadosScreen;

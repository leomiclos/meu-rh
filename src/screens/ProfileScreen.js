import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Biblioteca de ícones
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Para navegar entre as telas
import { Ionicons } from "@expo/vector-icons"; // Importando o Ionicons
import { API_URL } from '@env'; // Importando a URL da API

const ProfileScreen = () => {
    const [imageLoaded, setImageLoaded] = useState(true); // Estado para monitorar se a imagem foi carregada
    const [user, setUser] = useState(null); // Estado para armazenar os dados do usuário
    const navigation = useNavigation(); // Navegação para editar perfil

    // Ao carregar a tela, obtemos os dados do usuário do AsyncStorage
    useEffect(() => {
        const getUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };

        getUser();
    }, []);

    // Função que lida com a falha no carregamento da imagem de perfil
    const handleImageError = () => {
        setImageLoaded(false); // Se a imagem não carregar, mostra um ícone genérico
    };

    // Função que navega para a tela de edição de perfil
    const handleEditProfile = () => {
        navigation.navigate("EditProfileScreen"); // Navegar para a tela de edição
    };

    // Verificando se a imagem é base64 e construindo o formato correto
    const imageUrl = user?.usuario ? `${API_URL}/funcionarios/${user.usuario}/imagem` : null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {imageLoaded ? (
                imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }} // Usando a URL para carregar a imagem
                        style={styles.profileImage}
                        onError={handleImageError} // Chama essa função caso a imagem não carregue
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <MaterialIcons name="person" size={80} color="#ccc" />
                    </View>
                )
            ) : (
                <View style={styles.placeholder}>
                    <MaterialIcons name="person" size={80} color="#ccc" />
                </View>
            )}

            <Text style={styles.name}>{user?.nome}</Text>
            <Text style={styles.info}>Usuário: {user?.usuario}</Text>
            <Text style={styles.info}>Idade: {user?.idade}</Text>
            <Text style={styles.info}>E-mail: {user?.email}</Text>
            <Text style={styles.info}>Tipo de Perfil: {user?.tipo_funcionario}</Text>
            <Text style={styles.info}>Cargo: {user?.cargo?.nome_cargo}</Text>
            <Text style={styles.info}>
                Salário: R$ {user?.cargo?.salario
                    ? parseFloat(user.cargo.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                    : "Não informado"}
            </Text>

            {/* Botão para editar perfil */}
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: "#000",
        textAlign: "center",
        position: "relative"
    },
    backButton: {
        position: 'absolute',
        top: 50, // Ajuste a posição vertical conforme necessário
        left: 20, // Ajuste a posição horizontal conforme necessário
        zIndex: 1,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#000',
    },
    placeholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    editButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#8B10AE',
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ProfileScreen;

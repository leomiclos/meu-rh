import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from '@env'; // Importando a URL da API

const EditProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [user_name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [cargo, setCargo] = useState("");
    const [salario, setSalario] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Editar Perfil',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const getUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const userObj = JSON.parse(userData);
                setUser(userObj);
                setName(userObj.nome);
                setUsername(userObj.usuario);
                setEmail(userObj.email);
                setCargo(userObj.cargo?.nome_cargo || "");
                setSalario(userObj.cargo?.salario || "");
            }
        };
        getUser();
    }, []);

    const handleSave = async () => {
        const data = {
            nome: name || user?.nome,
            email: email || user?.email,
            cargo: {
                nome_cargo: cargo || user?.cargo?.nome_cargo,
                salario: salario || user?.cargo?.salario,
            },
        };

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/funcionarios/${user_name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // JSON no body
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
                const updatedUser = {
                    ...user,
                    ...data,
                };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                navigation.goBack();
            } else {
                Alert.alert('Erro', result.error || 'Erro ao atualizar perfil');
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao se conectar ao servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Cargo"
                value={cargo}
                onChangeText={setCargo}
            />
            <TextInput
                style={styles.input}
                placeholder="Salário"
                value={salario}
                keyboardType="numeric"
                onChangeText={setSalario}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    saveButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#8B10AE',
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default EditProfileScreen;

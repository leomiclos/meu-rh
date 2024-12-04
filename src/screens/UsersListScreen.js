import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const UsersListScreen = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${API_URL}/funcionarios`);
                const data = await response.json();
                setFuncionarios(data);
            } catch (error) {
                console.error("Error fetching funcionarios:", error);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Lista de Funcionários</Text>
            </View>
            <FlatList
                data={funcionarios}
                keyExtractor={(item) => item.id || item.email} // Assuming email is unique if id is missing
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Nome: {item.nome || "N/A"}</Text>
                        <Text style={styles.itemText}>Cargo: {item.cargo?.nome_cargo || "N/A"}</Text>
                        <Text style={styles.info}>
                            Salário: R$ {item?.cargo?.salario
                                ? parseFloat(item.cargo.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                                : "Não informado"}
                        </Text>

                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10, // Espaçamento para a seta de voltar
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#f0f0f5',
        marginBottom: 10,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
    },
});

export default UsersListScreen;

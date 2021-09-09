import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from "react-native";
import colors from "../styles/colors";
import { Header } from "../components/Header";
import { EnviromentButton } from "../components/EnviromentButton";
import fonts from "../styles/fonts";
import api from "../services/api";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";
import { useNavigation } from "@react-navigation/core";
import { PlantProps } from "../libs/storage";
import ServerJson from "../services/server.json";

interface EnviromentProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const [environments, setEnvironments] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [plantsBkp, setPlantsBkp] = useState<PlantProps[]>(ServerJson.plants as any);
    const [limit, setLimit] = useState(10);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(true);
    const navigation = useNavigation();

    function handleEnviromentSelected(environments: string) {
        setEnvironmentSelected(environments);

        if (environments == "all") return setFilteredPlants(plants);

        const filtered = plants.filter(plant =>
            plant.environments.includes(environments)
        );

        setFilteredPlants(filtered);
    }

    async function fetchEnvironments() {
        // const { data } = await api.get(
        //     "plants_environments?_sort=title&_order=asc"
        // );
        const data = ServerJson.plants_environments
        setEnvironments([
            {
                key: "all",
                title: "Todos"
            },
            ...data
        ]);
    }

    async function fetchPlants() {
        // const { data } = await api.get(
        //     `plants?_sort=name&_order=asc&_page=${page}&_limit=8`
        // );
        // const data = plantsBkp.slice(page, limit);
        const data = plantsBkp;
        if (!data) return setLoading(true);

        if (page > limit) {
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        } else {
            setPlants(data);
            setFilteredPlants(data);
        }
        // if (page > 1) {
        //     setPlants(oldValue => [...oldValue, ...data]);
        //     setFilteredPlants(oldValue => [...oldValue, ...data]);
        // } else {
        //     setPlants(data);
        //     setFilteredPlants(data);
        // }

        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1) return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + limit > plants.length ? plants.length : oldValue + limit);
        fetchPlants();
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', { plant });
    }

    useEffect(() => {
        fetchEnvironments();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, []);

    if (loading) return <Load />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
            </View>
            <View>
                <FlatList
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === environmentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <PlantCardPrimary data={item} onPress={() => handlePlantSelect(item)} />}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    // onEndReachedThreshold={0.1}
                    // onEndReached={({ distanceFromEnd }) =>
                    //     handleFetchMore(distanceFromEnd)
                    // }
                    ListFooterComponent={
                        loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList: {
        height: 40,
        justifyContent: "center",
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center"
    }
});

import { Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BarProps = {
    title: string;
}

export default function Bar(props: BarProps) {
    const [fontsLoaded] = useFonts({
        Nunito_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                <Image source={require('@/assets/images/house.png')} style={styles.image} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 65,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#912391',
        paddingHorizontal: 18,
        shadowColor: '#000',
        shadowRadius: 15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        elevation: 10,
        opacity: 0.9,
    },
    image: {
        width: 25,
        height: 25,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Nunito_700Bold',
        color: '#fff',
    },
    button: {
        backgroundColor: '#FFCA3A',
        padding: 6,
        borderRadius: 10,
        shadowColor: '#000',
        shadowRadius: 15,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        elevation: 10,
    },
});


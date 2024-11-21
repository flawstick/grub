import { ScrollView, SafeAreaView, Platform, View } from 'react-native';
import MapView from 'react-native-maps';
import tw from 'twrnc'; // Make sure to install twrnc

export default function CheckoutScreen() {

    return (
        <>
        <View style={tw`flex-1 bg-white mt-20`}>
        <ScrollView
            style={tw`flex-1 bg-white`}
            contentContainerStyle={tw`items-center`}
        >
            <MapView
            style={{ width: '100%', height: 250, marginBottom: 20 }}
            showsUserLocation={false}
            showsMyLocationButton={true}
            >
            </MapView>
        </ScrollView>
        </View>
        </>
    );
    }


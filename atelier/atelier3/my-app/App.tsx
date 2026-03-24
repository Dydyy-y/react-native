import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#4052D6" }} />
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={require("./assets/apou.png")}
              style={{ flex: 1 }}
              resizeMode="cover"
            ></ImageBackground>
          </View>
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={require("./assets/julien.jpg")}
              style={{ flex: 1 }}
              resizeMode="cover"
            ></ImageBackground>
          </View>
        </View>
      </View>

      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 2, backgroundColor: "blue" }} />
          <View style={{ flex: 1, backgroundColor: "purple" }} />
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "#4F2B4E" }} />
          <View style={{ flex: 1, backgroundColor: "#ED80E9" }} />
          <View style={{ flex: 1, backgroundColor: "pink" }} />
        </View>
      </View>

      <View style={{ flex: 2}}>
        <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 2, backgroundColor: "purple" }} />

            <View style={{ flex: 2}}>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View
                  style={{
                    flex: 2,
                    backgroundColor: "#e3a",
                  }}
                />
                <View
                  style={{
                    flex: 2,
                    backgroundColor: "#f8c",
                    margin: 4,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
    </View>
  );
}

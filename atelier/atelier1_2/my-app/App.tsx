import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Vibration,
  Image,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  FlatList
} from "react-native";
import { useState, useEffect } from "react";

//tableau calecon juju
const products = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Les caleçon de juju : #${i + 1}`,
  price: 19.99,
  size: "M",
  color: "noir",
}));

// composant pour afficher un produit
function ProductItem({ product }: { product: (typeof products)[0] }) {
  return (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDetails}>Prix : {product.price} €</Text>
      <Text style={styles.productDetails}>Taille : {product.size}</Text>
      <Text style={styles.productDetails}>Couleur : {product.color}</Text>
    </View>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  //fond (background color alternée)
  const [bg, setBg] = useState<"violet" | "red">("violet");
  const slide = useState(new Animated.Value(0))[0];
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const id = setInterval(() => {
      setBg((b) => (b === "violet" ? "red" : "violet"));
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // animation de défilement infini de l'image en fond
    Animated.loop(
      Animated.timing(slide, {
        toValue: -width,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [slide, width]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* background sliding image */}
      <Animated.Image
        source={require("./assets/julien.jpg")}
        style={{
          position: "absolute",
          width: width * 2,
          height: "100%",
          transform: [{ translateX: slide }],
        }}
        resizeMode="cover"
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={require("./assets/julien.jpg")}
          style={{ width: 400, height: 500, marginBottom: 0, marginTop: 70 }}
        />
        <FlatList style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 24, marginBottom: 10 }}>
            Julien de Plop
          </Text>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginHorizontal: 20,
            }}
          >
            Julien est un passionné de football : on le retrouve souvent sur le
            terrain ou devant un match, en train de commenter chaque passe. Il
            aime profondément sa ville natale, où il a grandi et dans laquelle
            il retrouve ses amis et ses habitudes. Mais si on lui demande ce
            qu’il préfère par‑dessus tout, il te dira sans hésiter que c’est
            Pdydy, une passion qui le suit partout et qui fait vraiment partie
            de son univers.
          </Text>
          <View style={{ marginTop: 20, alignItems: "flex-start" }}>
            <Text style={{ color: "white" }}>• Ville : Plobsheim</Text>
            <Text style={{ color: "white" }}>• Métier : Plobsheim</Text>
            <Text style={{ color: "white" }}>
              • Passion : Football et Pdydy
            </Text>
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Prénom ?"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              marginTop: 8,
            }}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email ?"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              marginTop: 8,
            }}
          />
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message ?"
            multiline
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              marginTop: 8,
              textAlignVertical: "top",
            }}
          />

          <Text style={{ marginTop: 16 }}>Tu as tapé : {message}</Text>

          {/*produit juju */}
          {products.map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </FlatList>
      </View>
    </View>
  );
}
// style definitions
const styles = StyleSheet.create({
  hearts: {
    fontSize: 40,
    textAlign: "center",
    marginVertical: 10,
  },
  productContainer: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  productName: {
    fontWeight: "bold",
  },
  productDetails: {
    fontSize: 12,
  },
});

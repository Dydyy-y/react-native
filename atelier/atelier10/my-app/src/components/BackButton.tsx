import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export interface BackButtonProps {
  style?: TouchableOpacityProps["style"];
  onPress: () => void;
}

const BackButton = ({ onPress, style }: BackButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.backButton, style]}>
      <Ionicons name="arrow-back" size={18} color="#007AFF" />
      <Text style={{ color: "#007AFF" }}>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

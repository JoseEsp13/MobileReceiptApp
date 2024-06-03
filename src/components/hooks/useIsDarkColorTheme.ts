import { useColorScheme } from "react-native";


export default function useIsDarkColorTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === "dark";
}
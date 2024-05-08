import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../Navigator";


export default function useAppNavigation() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return navigation;
}
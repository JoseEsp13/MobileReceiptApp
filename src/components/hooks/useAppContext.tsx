import { useContext } from "react";
import { AppContext } from "../state/AppState";


export default function useAppContext() {
    const ctx = useContext(AppContext);
    return ctx;
}
import {Container, CssBaseline} from "@mui/material";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import {Route, Routes} from "react-router-dom";
import Register from "./features/Users/Register.tsx";
import Login from "./features/Users/Login.tsx";
import Cocktails from "./features/Cocktails/Cocktails.tsx";
import NewCocktail from "./features/Cocktails/NewCocktail/NewCocktail.tsx";

const App = () => {
    return (
        <>
            <CssBaseline/>
            <header>
                <AppToolbar/>
            </header>
            <main>
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/" element={<Cocktails/>}/>
                        <Route path="/cocktails" element={<Cocktails/>}/>
                        <Route path="/add-cocktail" element={<NewCocktail/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Container>
            </main>
        </>
    );
};

export default App;
import React from "react";
import Header from "./components/Header";
import Poster from "./components/Poster";
import Meals from "./components/Meals";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import { CartContextProvider } from "./store/CartContext.jsx";
import { UserProgressContextProvider } from "./store/UserProgressContext.jsx";

function App() {
  return (
    <>
    <UserProgressContextProvider>
    <CartContextProvider>
    <Header/>
    <Poster/>
    <Meals/>
    <Cart/>
    <Checkout/>
    </CartContextProvider>
    </UserProgressContextProvider>

    </>
  );
}

export default App;

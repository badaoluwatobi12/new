import { useContext } from 'react'
import tattoo from '../assets/tattoo.jpg'
import Button from '../UI/Button.jsx'
import CartContext from '../store/CartContext.jsx'
import UserProgressContext from '../store/UserProgressContext.jsx'


export default function Header(){
const cartCtx = useContext(CartContext)
const userProgressCtx = useContext(UserProgressContext)


const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item)=>{
    return totalNumberOfItems + item.quantity
}, 0);


function handleShowCart() {
    userProgressCtx.showCart()
}


    return (
        <>
        {/* <main id="main-center">
        <div id="center-img">
            <img src={tattoo} alt=""/>
        </div>

    </main>
    
    */}


<main>
      <section class="section-hero">
        <div class="hero">
          <div class="hero-text-box">
            <p class="hero-description">
          
    Please read carefully to understand how the shop works
            </p >
   
            <p class="delivered-text">
            This website is created to help you explore the type of tattoo you're interested in. Please note that the price may vary after you connect with the artist, as it could be higher or lower than the initial estimate. Feel free to 
            choose your design and reach out to the artist for further details.
            </p>
       
          </div>
          </div>
          </section>
          </main>
    </>
    )
}
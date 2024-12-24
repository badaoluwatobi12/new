import { useContext } from "react"
import Modal from "../UI/Modal"
import CartContext from "../store/CartContext"
import { currencyFormatter } from "../util/formatting.js";
import Input from "../UI/Input.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import Button from "../UI/Button.jsx";

export default function Checkout() {
const cartCtx = useContext(CartContext)
const userProgressCtx = useContext(UserProgressContext)

const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price, 0)

    function handleClose() {
        userProgressCtx.hideCheckout()
    }



    async function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());
      
        try {
          const response = await fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order: {
                items: cartCtx.items,
                customer: customerData,
              },
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error:", errorData.message);
            alert(errorData.message);
            return;
          }
            const data= await response.json() 
      
            // console.log("Order submitted successfully:", await response.json());
            alert(data.message)
            handleClose()
        } catch (error) {
          console.error("Error submitting order:", error);
            alert("Failed to submit order. Please try again.");
            // handleClose()
        }
      }
      


    return ( 
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
     <h2>Checkout</h2>
     <p>Total Amount:{currencyFormatter.format(cartTotal)}</p>
     <Input label="Full Name" type="text" id="name" />
     <Input label="E-mail Address" type="email" id="email" />
     <Input label="Street" type="text" id="street" />
     <div className="control-row">
     <Input label="Postal Code" type="text" id="postal-code" />
     <Input label="City" type="text" id="city" />
     </div>
     <p className="modal-actions">
 <Button type="button" textOnly onClick={handleClose}>
    Close
</Button>
      
       <Button>Submit Order</Button>
     
     </p>
    </form>
    </Modal>
    )
}
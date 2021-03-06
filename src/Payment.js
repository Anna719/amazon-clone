import React, {useState, useEffect} from 'react';
import './Payment.css';
import {useStateValue} from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import {Link, useHistory} from "react-router-dom";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import CurrencyFormat from 'react-currency-format';
import {getBasketTotal} from "./reducer";
import axios from "axios";

function Payment(){
    const [{basket,user}, dispatch]=useStateValue();

    const stripe=useStripe();
    const elements=useElements();
    const history = useHistory();

    const [succeeded, setSucceeded] =useState(false);
    const [processing, setProcessing]=useState("");

    const [error, setError]=useState(null);
    const [clientSecret, setClientSecret]=useState(true);
    const [disabled, setDisabled]=useState(true);

    useEffect(() => {
        //generate a special stripe secret that allows us to charge the customer
        const getClientSecret = async () =>{
            const response=await axios ({
                method: 'post',
                //sreipes expects the total in a currencies subunits (ex:10$ u should write like 1000)
                url: `/payments/create&total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        };
        getClientSecret();

    },[basket]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) => {

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            history.replace('/orders');
        })
    };





    const handleChange=event=>{
        //Listen for changes in the CardElement
        //and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };


    return(
        <div className="payment">
            <div className="payment__container">
                {/*Payment section - delivery address */}
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, California</p>
                    </div>

                </div>

                {/*Review items*/}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                 </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>

                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />

                            <div className="payment__priceContainer">
                                <CurrencyFormat renderText={(value) => (
                                    <>
                                        <h3>Order Total: {value}</h3>
                                    </>
                                )}
                                                decimalScale={2}
                                                value={getBasketTotal(basket)} // part of the homework
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>{/*if its processing write "processing" otherwise write "buy now"*/}
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Payment;
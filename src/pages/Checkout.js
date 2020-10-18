import React from "react";
import {CartContext} from "../context/cart";
import {UserContext} from "../context/user";
import {useHistory} from 'react-router-dom';
import EmptyCart from "../components/Cart/EmptyCart";
import {CardElement, StripeProvider, Elements, injectStripe} from "react-stripe-elements";
import submitOrder from '../strapi/submitOrder';


function Checkout(props) {
    const {cart, total, clearCart} = React.useContext(CartContext);
    const {user, showAlert, hideAlert, alert} = React.useContext(UserContext);
    const history = useHistory();
    // state values
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const isEmpty = !name || alert.show;

    async function handleSubmit(e) {
        showAlert({msg: 'submitting order ... please wait'})
        e.preventDefault();
        const response = await props.stripe
            .createToken()
            .catch(error => console.log(error));

        const {token} = response;
        if (token) {
            setError('');
            const {id} = token;
            let order = await submitOrder({
                name: name,
                total: total,
                items: cart,
                stripeTokenId: id,
                userToken: user.token
            });
            if (order) {
                showAlert({msg: 'your order is complete'});
                clearCart();
                history.push('/');
                return;
            } else {
                showAlert({msg: 'the was an error with your order. please try again.', type: 'danger'});
            }
        } else {
            hideAlert();
            setError(response.error.message);
        }
    }

    if (cart.length < 1) return <EmptyCart/>;

    return (
        <section className="section form">
            <h2 className="section-title">checkout</h2>
            <form className="checkout-form">
                <h3>order total: <span>${total}</span></h3>
                {/* single input */}

                <div className="form-control">
                    <label htmlFor="name">name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                        }}/>
                </div>
                {/* end of single input */}
                {/* card element */}
                <div className="stripe-input">
                    <label htmlFor="card-element">Credit or Debit Card</label>
                    <p className="stripe-info">
                        Test using this credit card : <span>4242424242424242</span>
                        <br/>
                        enter any 6 leters for postal code
                        <br/>
                        enter any 3 digits for CVC
                    </p>
                </div>
                {/* end of card element */}
                {/* STRIPE ELEMENTS */}
                <CardElement className="card-element"></CardElement>

                {/* STRIPE Errors */}
                {error && <p className="form-empty">{error}</p>}
                {/* Empty value */}
                {isEmpty ? (
                        <p className="form-empty">please fill out name field</p>)
                    : (<button type="submit" onClick={handleSubmit}
                               className="btn btn-primary btn-block">submit</button>)}
            </form>
        </section>
    );
}

const CardForm = injectStripe(Checkout);

const StripeWrapper = () => {
    return (
        <StripeProvider
            apiKey="pk_test_51Hd5JlD4cVmPFXn7cTM3mU6TAj6Zzvl7dBetEy0LAfh2n8lizo0hQOKaElVNgeRN3wnN5IEO0qlKy9oaJ31IRuI6009XGTRvs9">
            <Elements>
                <CardForm></CardForm>
            </Elements>
        </StripeProvider>
    );
}

export default StripeWrapper;
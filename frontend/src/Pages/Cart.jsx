import React, { useContext } from 'react';
import CartItems from '../Components/CartItems/CartItems';
import Checkout from '../Components/Checkout';
import { ShopContext } from '../Context/ShopContext';

const Cart = () => {
  const { cartItems, products } = useContext(ShopContext);

  const isCartEmpty = Object.values(cartItems).every((qty) => qty === 0);

  return (
    <div>
      {!products.length ? (
        <p>Loading products...</p>
      ) : isCartEmpty ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <CartItems cartItems={cartItems} products={products} />
          <Checkout cartItems={cartItems} products={products} />
        </>
      )}
    </div>
  );
};

export default Cart;

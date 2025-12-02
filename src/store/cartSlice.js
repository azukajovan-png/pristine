import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart:[],
        wishList:[],
    },

    reducers:{
        // create the addToCart function
        addToCart:(state, action)=>{
            const { id } = action.payload;
          const item = state.cart.find( p => p.id === id); // check if item already exist in the cart azukajovani@gmail.com
          if(item){
            state.cart.push({qty:item.qty++, ...item});
          }else{ 
              state.cart.push( { qty:1, ...action.payload });
          }
         state.cart.push( action.payload );
        }, 
        // remove item from cart
        removeCartItem:(state, action)=>{
         state.cart = state.cart.filter( ( p )=> p.id !== action.payload);
        }, 
        // clear cart/ remove all items
        clearCart: (state)=>{
            state.cart = [];
        },

        // whisList
        addToWishList:(state, action)=>{
          const item = state.wishList.find( p => p.id === action.payload.id); // check if item already exist in the cart
          if(item) return;
          state.cart.push( action.payload );
        },

        removeWishListItem:( state, action )=>{
            state.wishList = state.wishList.filter( ( item ) => item.id !== action.payload );
        },
        
        clearWishList: ( state )=>{
            state.wishList = [];
        }



    }
});

export const { addToCart, removeCartItem, clearCart, addToWishList,removeWishListItem,clearWishList } = cartSlice.actions;
export default cartSlice.reducer;
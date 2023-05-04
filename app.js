const initialState = {
  products: [],
  cart: [],
  error: null,
};

// Redux actions
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const SET_PRODUCTS = "SET_PRODUCTS";
const SET_ERROR = "SET_ERROR";

// Redux action creators
function addToCart(product) {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
}

function removeFromCart(productId) {
  return {
    type: REMOVE_FROM_CART,
    payload: productId,
  };
}

function setProducts(products) {
  return {
    type: SET_PRODUCTS,
    payload: products,
  };
}

function setError(error) {
  return {
    type: SET_ERROR,
    payload: error,
  };
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      const existingCartItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingCartItem) {
        existingCartItem.quantity++;
        return {
          ...state,
          cart: [...state.cart],
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Initialize the Redux store
const store = Redux.createStore(
  reducer,
  Redux.applyMiddleware(ReduxThunk.default)
);

// Define the render function to update the UI
function render() {
  const productList = document.querySelector("#product-list");
  const cartList = document.querySelector("#cart");
  const state = store.getState();
  console.log(state.products);

  // Render the product list
  productList.innerHTML = "";
  state.products.map((product) => {
    const productElem = document.createElement("div");
    productElem.classList.add("product");
    productElem.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>$${product.price}</p>
        <button onclick="handleAddToCartClick(${product.id})">Add to cart</button>
      `;
    productList.appendChild(productElem);
  });

  // Render the cart
  cartList.innerHTML = "";
  state.cart.forEach((item) => {
    const cartItemElem = document.createElement("div");
    cartItemElem.classList.add("cart-item");
    cartItemElem.innerHTML = `
        <p>${item.title}</p>
        <p>Quantity: ${item.quantity}</p>
        <button onclick="handleRemoveFromCartClick(${item.id})">Remove</button>
      `;
    cartList.appendChild(cartItemElem);
  });
}

// Define the event handlers for adding and removing items from the cart
function handleAddToCartClick(productId) {
  const state = store.getState();
  const product = state.products.find((item) => item.id === productId);

  store.dispatch(addToCart(product));
}

function handleRemoveFromCartClick(productId) {
  store.dispatch(removeFromCart(productId));
}

// Define the async action creator to fetch products data from the API
function fetchProducts() {
  return async function (dispatch) {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      dispatch(setProducts(data));
    } catch {
      (error) => {
        dispatch(setError("An error occurred while fetching products."));
      };
    }
  };
}

store.subscribe(render);

store.dispatch(fetchProducts());

render();

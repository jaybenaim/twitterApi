import { SAMPLE_TYPE } from "../types";

const initialState = {
  products: [],
  productToAdd: null,
  data: {
    productQuantity: 0,
    totalPrice: 0,
  },
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SAMPLE_TYPE:
      return {
        ...state,
        productToAdd: Object.assign({}, action.payload),
      };

    default:
      return state;
  }
}

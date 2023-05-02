export default function productsReducer(products, action) {
  switch (action.type) {
    case "add-product": {
      return [
        ...products,
        {
          id: action.id,
          name: action.name,
          quantity: action.quantity,
          status: action.status,
        },
      ];
    }
    case "change-index": {
      const { dragIndex, hoverIndex } = action;
      const draggedProduct = products[dragIndex];
      const updatedProducts = [...products];
      updatedProducts.splice(dragIndex, 1);
      updatedProducts.splice(hoverIndex, 0, draggedProduct);
      return updatedProducts;
    }
    case "add-quantity": {
      return products.map((p) => {
        if (p.id === action.id) {
          const quantityNumber = Number(p.quantity) + 1;
          p.quantity = quantityNumber;
          return p;
        } else {
          return p;
        }
      });
    }
    case "substract-quantity": {
      return products.filter((p) => {
        if (p.id === action.id) {
          if (p.quantity > 1) {
            p.quantity--;
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
    }
    case "delete-product": {
      return products.filter((p) => p.id !== action.id);
    }
    case "change-status": {
      return products.map((p) => {
        if (p.id === action.id) {
          if (p.status === "completed") {
            p.status = "uncompleted";
          } else {
            p.status = "completed";
          }
          return p;
        } else {
          return p;
        }
      });
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

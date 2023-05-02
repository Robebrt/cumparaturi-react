import { useState, useReducer, useEffect } from 'react'
import CardList from './CardList';
import './App.css';
import productsReducer from './productsReducer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback } from 'react';

let id = 0;
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function App() {

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    status: "uncompleted"
  });

  const [errors, setErrors] = useState({});

  const [products, dispatch] = useReducer(productsReducer, []);

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (form.name === "") {
      formIsValid = false;
      errors["name"] = "Name field cannot be empty!";
    }
    if (!form.name.match(/^[a-zA-Z]+$/)) {
      formIsValid = false;
      errors["name"] = "Name field can only contains letters!";
    }
    if (form.quantity === "") {
      formIsValid = false;
      errors["quantity"] = "Quantity field cannot be empty!";
    }

    if (!isNumeric(form.quantity)) {
      formIsValid = false;
      errors["quantity"] = "Quantity field must be a number!"
    }
    else if (Number(form.quantity) === 0) {
      formIsValid = false;
      errors["quantity"] = "Quantity cannot be 0!"
    }
    setErrors(errors);
    return formIsValid;
  }

  const moveCard = useCallback((dragIndex, hoverIndex, dragStatus, hoverStatus) => {
    dispatch({
      type: "change-index",
      dragIndex: dragIndex,
      hoverIndex: hoverIndex,
      dragStatus: dragStatus,
      hoverStatus, hoverStatus
    }
    )

  }, [])
  
  const addHandler = () => {
    if (handleValidation()) {
      setForm({
        name: "",
        quantity: "",
        status: "uncompleted"
      })
      dispatch(
        {
          type: "add-product",
          id: id++,
          name: form.name,
          quantity: parseInt(form.quantity),
          status: form.status
        }
      )
    }
  }

  const quantityAddHandler = productId => {
    dispatch(
      {
        type: "add-quantity",
        id: productId
      }
    )
  }

  const quantitySubstractHandler = productId => {
    dispatch(
      {
        type: "substract-quantity",
        id: productId
      }
    )
  }
  const statusChangeHandler = productId => {
    dispatch(
      {
        type: "change-status",
        id: productId
      }
    )
  }

  return (
    <>
      <div className='app-box'>
        <header>
          <h3>CUMPARATURI</h3>
        </header>
        <main>
          <div className='div-form'>
            <h4>Adauga elemente!</h4>
            <form className='add-form'>
              <input value={form.name}
                onChange={e => {
                  setForm({
                    ...form,
                    name: e.target.value
                  });
                }}
                name="name" placeholder='Name' />
              <span className="error">{errors["name"]}</span>
              <input value={form.quantity}
                onChange={e => {
                  setForm({
                    ...form,
                    quantity: e.target.value
                  });
                }}
                name="quantity" placeholder='Quantity' />
              <span className="error">{errors["quantity"]}</span>
              <button type="button" className='add-button' onClick={addHandler}>Adauga</button>
            </form>
          </div>
          <div className='columns'>
            <div className='column to-be-bought-column'>
              <h2>{products.filter((p) => p.status === "uncompleted").length} de cumparat</h2>
              <DndProvider backend={HTML5Backend}>
                <CardList
                  products={products.filter((p) => p.status === "uncompleted")}
                  quantityAdd={quantityAddHandler}
                  quantitySubstract={quantitySubstractHandler}
                  statusChange={statusChangeHandler}
                  moveCard={moveCard}
                  BigProducts={products}
                />
              </DndProvider>
            </div>
            <div className='column bought-column'>
              <h2>{products.filter((p) => p.status === "completed").length} cumparate</h2>
              <DndProvider backend={HTML5Backend}>
                <CardList
                  products={products.filter((p) => p.status === "completed")}
                  quantityAdd={quantityAddHandler}
                  quantitySubstract={quantitySubstractHandler}
                  statusChange={statusChangeHandler}
                  moveCard={moveCard}
                  BigProducts={products}
                />
              </DndProvider>
            </div>
          </div>
        </main>
        <footer>
          <h3>©2023 Enache Robert</h3>
        </footer>
      </div>
    </>
  )
}

export default App

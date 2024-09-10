import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from './ContextReducer';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export default function Card(props) {
  const data = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const priceRef = useRef();
  const dispatch = useDispatchCart();

  const options = props.options;
  const priceOptions = Object.keys(options);
  const foodItem = props.item;

  useEffect(() => {
    // Set default size from options if available
    if (priceOptions.length > 0) {
      setSize(priceOptions[0]);
      priceRef.current.value = priceOptions[0];
    }
  }, [priceOptions]);

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleOptions = (e) => {
    setSize(e.target.value);
  };

  const handleAddToCart = async () => {
    const existingItem = data.find(item => item.id === foodItem._id);

    const finalPrice = qty * parseInt(options[size], 10);

    if (existingItem) {
      if (existingItem.size === size) {
        await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty });
      } else {
        await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty, size, img: props.ImgSrc });
      }
    } else {
      await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty, size });
    }
  };

  const finalPrice = qty * parseInt(options[size], 10);

  return (
    <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
      <img src={props.ImgSrc} className="card-img-top" alt={props.foodName} style={{ height: "120px", objectFit: "fill" }} />
      <div className="card-body">
        <h5 className="card-title">{props.foodName}</h5>
        <div className='container w-100 p-0' style={{ height: "38px" }}>
          <select className="m-2 h-100 w-20 bg-success text-black rounded" onChange={handleQty}>
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select className="m-2 h-100 w-20 bg-success text-black rounded" ref={priceRef} onChange={handleOptions}>
            {priceOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <div className='d-inline ms-2 h-100 w-20 fs-5'>
            ₹{finalPrice}/-
          </div>
        </div>
        <hr />
        <button className="btn btn-success ms-2" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

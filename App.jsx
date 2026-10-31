
import { useEffect, useState } from "react";
import "./App.css";

const products = [
  {
    id: "tshirt",
    name: "Classic T-Shirt",
    category: "Everyday essentials",
    price: 499,
    emoji: "👕",
    color: "#e9e2ff",
    description: "Comfort meets everyday style",
    options: [
      { label: "Size", values: ["S", "M", "L", "XL", "XXL"] },
      { label: "Color", values: ["Black", "White", "Blue", "Lavender"] },
    ],
  },
  {
    id: "mug",
    name: "Coffee Mug",
    category: "For your coffee moments",
    price: 299,
    emoji: "☕",
    color: "#ffe9d8",
    description: "Make every sip special",
    options: [
      { label: "Capacity", values: ["250 ml", "350 ml", "450 ml"] },
      { label: "Color", values: ["White", "Black", "Pink"] },
    ],
  },
  {
    id: "shoes",
    name: "Urban Sneakers",
    category: "Move in your own style",
    price: 1999,
    emoji: "👟",
    color: "#dff3ee",
    description: "Comfort for every step",
    options: [
      { label: "Shoe Size", values: ["6", "7", "8", "9", "10", "11"] },
      { label: "Color", values: ["White", "Black", "Grey"] },
    ],
  },
];

function ProductCard({ product, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`product-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="product-emoji" style={{ background: product.color }}>
        {product.emoji}
      </span>
      <span className="product-info">
        <strong>{product.name}</strong>
        <small>{product.category}</small>
        <b>₹{product.price.toLocaleString("en-IN")}</b>
      </span>
      <span className="select-indicator">{selected ? "✓" : "+"}</span>
    </button>
  );
}

function ProductCustomizer({ product, options, onOptionChange }) {
  return (
    <div className="customizer">
      <div className="section-heading">
        <span className="step-number">02</span>
        <div>
          <h3>Make it yours</h3>
          <p>Choose your preferred options</p>
        </div>
      </div>

      <div className="option-grid">
        {product.options.map((option) => (
          <label className="field" key={option.label}>
            <span>{option.label}</span>
            <select
              value={options[option.label] || ""}
              onChange={(e) => onOptionChange(option.label, e.target.value)}
            >
              <option value="">Select {option.label}</option>
              {option.values.map((value) => (
                <option value={value} key={value}>{value}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

function OrderSummary({ product, quantity, options, total }) {
  return (
    <aside className="summary-card">
      <div className="summary-title">
        <div>
          <span className="eyebrow">YOUR CART</span>
          <h3>Order summary</h3>
        </div>
        <span className="cart-icon">🛍️</span>
      </div>

      <div className="summary-product">
        <span className="summary-emoji" style={{ background: product.color }}>
          {product.emoji}
        </span>
        <div>
          <strong>{product.name}</strong>
          <small>Quantity: {quantity}</small>
          {Object.entries(options).map(([key, value]) => (
            <small key={key}>{key}: {value}</small>
          ))}
        </div>
      </div>

      <div className="price-row">
        <span>Price per item</span>
        <span>₹{product.price.toLocaleString("en-IN")}</span>
      </div>
      <div className="price-row">
        <span>Quantity</span>
        <span>× {quantity}</span>
      </div>
      <div className="price-row">
        <span>Delivery</span>
        <span className="free">FREE</span>
      </div>

      <div className="summary-total">
        <span>Total amount</span>
        <strong>₹{total.toLocaleString("en-IN")}</strong>
      </div>
      <p className="secure-note">🔒 Secure order details</p>
    </aside>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const defaultOptions = {};
    selectedProduct.options.forEach((option) => {
      defaultOptions[option.label] = "";
    });
    setOptions(defaultOptions);
    setQuantity(1);
  }, [selectedProduct]);

  const total = selectedProduct.price * quantity;

  const errors = {
    name:
      customer.name.trim().length < 3
        ? "Please enter at least 3 characters."
        : "",
    email:
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
        ? "Enter a valid email address."
        : "",
    phone:
      !/^[6-9]\d{9}$/.test(customer.phone)
        ? "Enter a valid 10-digit Indian mobile number."
        : "",
    address:
      customer.address.trim().length < 10
        ? "Please enter an address of at least 10 characters."
        : "",
  };

  const customerValid = Object.values(errors).every((error) => !error);
  const optionsValid = selectedProduct.options.every(
    (option) => options[option.label]
  );
  const formValid = customerValid && optionsValid && quantity >= 1;

  function handleCustomerChange(e) {
    const { name, value } = e.target;
    setCustomer((previous) => ({ ...previous, [name]: value }));
  }

  function handleOptionChange(label, value) {
    setOptions((previous) => ({ ...previous, [label]: value }));
  }

  function handleProductChange(product) {
    setSelectedProduct(product);
    setSubmitted(false);
    setOrderNumber("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
    });

    if (!formValid) return;

    setOrderNumber("ORD" + Date.now().toString().slice(-7));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <span className="eyebrow">ORDER CONFIRMED</span>
          <h1>Thank you, {customer.name}!</h1>
          <p>Your order has been placed successfully.</p>
          <div className="order-number">
            <span>Order ID</span>
            <strong>{orderNumber}</strong>
          </div>
          <div className="success-details">
            <span>{selectedProduct.emoji} {selectedProduct.name}</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
          <p className="success-message">
            Your order details have been recorded for this session.
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setSubmitted(false);
              setCustomer({ name: "", email: "", phone: "", address: "" });
              setTouched({});
              setOptions({});
              setQuantity(1);
            }}
          >
            Place another order →
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">O</span>
          orderly<span className="brand-dot">.</span>
        </a>
        <span className="topbar-note">A little joy in every order ✨</span>
        <span className="topbar-cart">🛍️ <b>My order</b></span>
      </header>

      <main className="main-content" id="top">
        <section className="hero">
          <span className="hero-label">THE EASY WAY TO SHOP</span>
          <h1>Make your choice.<br /><span>We'll handle the rest.</span></h1>
          <p>Pick your favourite product, personalise it and place your order in just a few steps.</p>
          <div className="hero-points">
            <span>✓ Easy customisation</span>
            <span>✓ Simple checkout</span>
            <span>✓ Free delivery</span>
          </div>
        </section>

        <form onSubmit={handleSubmit} noValidate>
          <div className="content-grid">
            <div className="form-column">
              <section className="form-section">
                <div className="section-heading">
                  <span className="step-number">01</span>
                  <div>
                    <h3>Choose your product</h3>
                    <p>What would you like to order today?</p>
                  </div>
                </div>

                <div className="product-list">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={selectedProduct.id === product.id}
                      onSelect={() => handleProductChange(product)}
                    />
                  ))}
                </div>
              </section>

              <section className="form-section">
                <ProductCustomizer
                  product={selectedProduct}
                  options={options}
                  onOptionChange={handleOptionChange}
                />
              </section>

              <section className="form-section">
                <div className="section-heading">
                  <span className="step-number">03</span>
                  <div>
                    <h3>How many do you need?</h3>
                    <p>Select your order quantity</p>
                  </div>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >−</button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >+</button>
                  <span>Maximum 10 items</span>
                </div>
              </section>

              <section className="form-section">
                <div className="section-heading">
                  <span className="step-number">04</span>
                  <div>
                    <h3>Your details</h3>
                    <p>Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="customer-grid">
                  <label className="field">
                    <span>Full name *</span>
                    <input
                      name="name"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="e.g. Arya Bhat"
                    />
                    {touched.name && errors.name && <small className="error">{errors.name}</small>}
                  </label>

                  <label className="field">
                    <span>Email address *</span>
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      placeholder="you@example.com"
                    />
                    {touched.email && errors.email && <small className="error">{errors.email}</small>}
                  </label>

                  <label className="field">
                    <span>Mobile number *</span>
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                    {touched.phone && errors.phone && <small className="error">{errors.phone}</small>}
                  </label>

                  <label className="field full-width">
                    <span>Delivery address *</span>
                    <textarea
                      name="address"
                      value={customer.address}
                      onChange={handleCustomerChange}
                      onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                      placeholder="House no., street, area, city and PIN code"
                      rows={3}
                    />
                    {touched.address && errors.address && <small className="error">{errors.address}</small>}
                  </label>
                </div>
              </section>
            </div>

            <div className="summary-column">
              <OrderSummary
                product={selectedProduct}
                quantity={quantity}
                options={options}
                total={total}
              />
              <button className="primary-button place-order" type="submit" disabled={!formValid}>
                Place my order <span>→</span>
              </button>
              <p className="validation-note">
                {formValid
                  ? "✓ All details look good. You can place your order."
                  : "Complete all required fields and product options to enable ordering."}
              </p>
            </div>
          </div>
        </form>

        <footer className="footer">
          <span>orderly. © 2026</span>
          <span>Made for a smoother shopping experience ♡</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

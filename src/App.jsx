import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "تيشيرت شبابي أسود",
      price: "350 جنيه",
      category: "شبابي",
      image: "/uploads/shirt1.jpg",
    },
    {
      id: 2,
      title: "بنطلون جينز",
      price: "450 جنيه",
      category: "بناطيل",
      image: "/uploads/jeans1.jpg",
    },
    {
      id: 3,
      title: "ترينج رياضي",
      price: "550 جنيه",
      category: "رياضي",
      image: "/uploads/sport1.jpg",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) navbar.classList.add("navbar-scrolled");
      else navbar.classList.remove("navbar-scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilter = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "الكل"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "شبابي",
    image: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert("من فضلك املأ كل الحقول");
      return;
    }

    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ title: "", price: "", category: "شبابي", image: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setNewProduct({ ...newProduct, image: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "mansy123") {
      setShowLogin(false);
      setShowAdmin(true);
      setError("");
    } else {
      setError("كلمة المرور غير صحيحة ❌");
    }
  };

  const handleLogout = () => {
    setShowAdmin(false);
  };

  return (
    <div className="App fade-in">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="brand">
            Mansy <span>Store</span>
          </div>
          <div>
            <button
              className="btn gold"
              onClick={() => setShowLogin(!showLogin)}
            >
              لوحة التحكم
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Mansy Store</h1>
        <p>أحدث صيحات الموضة الشبابية والرياضية</p>
        <button
          className="btn gold"
          onClick={() =>
            window.scrollTo({ top: 700, behavior: "smooth" })
          }
        >
          تصفح المنتجات
        </button>
      </section>

      {/* Category Filter */}
      <div className="container">
        <div className="category-filter">
          {["الكل", "شبابي", "رياضي", "بناطيل"].map((cat) => (
            <div
              key={cat}
              className={`chip ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid">
          {filteredProducts.map((product) => (
            <div className="card fade-in" key={product.id}>
              <div className="card-media">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="card-body">
                <h3>{product.title}</h3>
                <div className="meta">
                  <span>{product.price}</span>
                  <span>{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Login */}
      {showLogin && !showAdmin && (
        <div className="admin-panel fade-in">
          <h3>تسجيل الدخول</h3>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="ادخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn gold full">
              دخول
            </button>
            <button
              type="button"
              className="btn full"
              onClick={() => setShowLogin(false)}
            >
              إلغاء
            </button>
          </form>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="admin-panel fade-in">
          <h3>لوحة التحكم 🛠️</h3>
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="السعر"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="شبابي">شبابي</option>
            <option value="رياضي">رياضي</option>
            <option value="بناطيل">بناطيل</option>
          </select>
          <input type="file" onChange={handleImageUpload} />
          {newProduct.image && (
            <div className="preview">
              <img src={newProduct.image} alt="preview" />
            </div>
          )}
          <button className="btn gold full" onClick={handleAddProduct}>
            إضافة المنتج
          </button>
          <button className="btn full" onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} ENG:Ahmed ELmansy| جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

export default App;

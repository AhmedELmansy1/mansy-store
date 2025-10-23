import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("الكل");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "شبابي",
    imageURL: "",
  });
  const [adminVisible, setAdminVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAdmin(true);
      setAdminVisible(false);
    } else {
      alert("كلمة المرور غلط 😅");
    }
  };

  const handleUpload = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageURL) {
      alert("من فضلك املأ كل البيانات");
      return;
    }
    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        imageURL: newProduct.imageURL,
        timestamp: serverTimestamp(),
      });
      alert("✅ تم رفع المنتج بنجاح!");
      setNewProduct({ name: "", price: "", category: "شبابي", imageURL: "" });
      window.location.reload();
    } catch (error) {
      console.error("خطأ أثناء الرفع:", error);
      alert("❌ حدث خطأ أثناء الرفع. افتح Console وشوف التفاصيل");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("متأكد إنك عايز تحذف المنتج؟")) {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleEdit = async (product) => {
    const newName = prompt("اسم المنتج الجديد:", product.name);
    const newPrice = prompt("السعر الجديد:", product.price);
    const newImage = prompt("رابط الصورة الجديد:", product.imageURL);
    if (newName && newPrice && newImage) {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { name: newName, price: newPrice, imageURL: newImage });
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, name: newName, price: newPrice, imageURL: newImage } : p
        )
      );
    }
  };

  const filteredProducts =
    filter === "الكل" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand">
            Mansy <span>Store</span>
          </div>
          {!isAdmin && (
            <button className="btn gold" onClick={() => setAdminVisible(!adminVisible)}>
              ⚙️
            </button>
          )}
        </div>
      </nav>

      {adminVisible && !isAdmin && (
        <div className="admin-panel">
          <h3>لوحة الدخول</h3>
          <input
            type="password"
            placeholder="ادخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn gold full" onClick={handleLogin}>
            دخول
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="admin-panel">
          <h3>لوحة التحكم</h3>
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="السعر"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option value="شبابي">شبابي</option>
            <option value="رياضي">رياضي</option>
            <option value="بناطيل">بناطيل</option>
          </select>
          <input
            type="text"
            placeholder="رابط الصورة (Direct URL)"
            value={newProduct.imageURL}
            onChange={(e) => setNewProduct({ ...newProduct, imageURL: e.target.value })}
          />
          <button className="btn gold full" onClick={handleUpload}>
            رفع المنتج
          </button>
        </div>
      )}

      <div className="container">
        <div className="category-filter">
          {["الكل", "شبابي", "رياضي", "بناطيل"].map((cat) => (
            <button
              key={cat}
              className={`chip ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="card">
              <div className="card-media">
                <img src={p.imageURL} alt={p.name} />
              </div>
              <div className="card-body">
                <h3>{p.name}</h3>
                <div className="meta">{p.price} EGP</div>
                {isAdmin && (
                  <div className="admin-buttons">
                    <button className="btn gold" onClick={() => handleEdit(p)}>
                      ✏️ تعديل
                    </button>
                    <button className="btn gold" onClick={() => handleDelete(p.id)}>
                      🗑️ حذف
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <p>© 2025 ENG: Ahmed Elmansy. All Rights Reserved.</p>
          <div className="contact">
            <a href="tel:+201030537395">📞 +20 1030537395</a>
            <a
              href="https://wa.me/201030537395"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 واتساب
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

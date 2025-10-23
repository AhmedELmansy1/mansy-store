import React, { useState, useEffect } from "react";
import "./App.css";
import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "شبابي",
    image: null,
  });

  const categories = ["all", "شبابي", "رياضي", "بناطيل"];

  // ✅ تحميل المنتجات من Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // ✅ رفع منتج جديد
  const handleUpload = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("من فضلك املأ كل البيانات");
      return;
    }

    try {
      // 1️⃣ رفع الصورة إلى Firebase Storage
      const imageRef = ref(storage, `products/${Date.now()}_${newProduct.image.name}`);
      await uploadBytes(imageRef, newProduct.image);
      const imageURL = await getDownloadURL(imageRef);

      // 2️⃣ حفظ بيانات المنتج في Firestore
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        imageURL,
        timestamp: serverTimestamp(),
      });

      alert("✅ تم رفع المنتج بنجاح!");
      setNewProduct({ name: "", price: "", category: "شبابي", image: null });
      window.location.reload();
    } catch (error) {
      console.error("خطأ أثناء الرفع:", error);
    }
  };

  // ✅ تسجيل الدخول للوحة التحكم
  const handleLogin = () => {
    if (password === "admin123") {
      setIsAdmin(true);
      setError("");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  // ✅ تصفية المنتجات حسب النوع
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="App">
      {/* ===== Navbar ===== */}
      <nav className="navbar">
        <div className="nav-inner container">
          <div className="brand">
            Mansy <span>Store</span>
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="hero fade-in">
        <h1>Mansy Store</h1>
        <p>اكتشف أحدث الموديلات الفاخرة</p>
      </section>

      {/* ===== Category Filter ===== */}
      <div className="category-filter container fade-in">
        {categories.map((c) => (
          <div
            key={c}
            className={`chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c === "all" ? "الكل" : c}
          </div>
        ))}
      </div>

      {/* ===== Products Grid ===== */}
      <div className="grid container fade-in">
        {filteredProducts.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-media">
              <img src={p.imageURL} alt={p.name} />
            </div>
            <div className="card-body">
              <h3>{p.name}</h3>
              <div className="meta">
                <span>{p.price} ج.م</span>
                <span>{p.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Admin Login ===== */}
      {!isAdmin && (
        <div className="admin-panel fade-in">
          <h3>تسجيل دخول المدير</h3>
          <input
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>}
          <button className="btn full gold" onClick={handleLogin}>
            دخول
          </button>
        </div>
      )}

      {/* ===== Admin Panel ===== */}
      {isAdmin && (
        <div className="admin-panel fade-in">
          <h3>إضافة منتج جديد</h3>
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="number"
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
          <input
            type="file"
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.files[0] })
            }
          />
          <button className="btn full gold" onClick={handleUpload}>
            رفع المنتج ✅
          </button>
        </div>
      )}

      {/* ===== Footer ===== */}
      <footer className="footer fade-in">
        <p>© 2025 ENG: Ahmed Elmansy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

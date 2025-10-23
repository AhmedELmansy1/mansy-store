import React, { useState } from "react";

function uid() {
  return "p" + Math.random().toString(36).slice(2, 9);
}

export default function AdminPanel({ products, onSave, onDelete }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("ملابس شبابي");
  const [imagePreview, setImagePreview] = useState("");

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    const product = {
      id: id || uid(),
      name: name || "بدون اسم",
      price: price || "—",
      category,
      image: imagePreview || "/placeholder.png",
    };
    onSave(product);
    setId("");
    setName("");
    setPrice("");
    setCategory("ملابس شبابي");
    setImagePreview("");
  }

  return (
    <aside className="admin-panel">
      <h2>لوحة التحكم</h2>
      <form onSubmit={handleSave}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المنتج"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="السعر"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>ملابس شبابي</option>
          <option>ملابس رياضية</option>
          <option>بناطيل</option>
        </select>
        <input type="file" accept="image/*" onChange={handleFile} />
        {imagePreview && (
          <div className="preview">
            <img src={imagePreview} alt="preview" />
          </div>
        )}
        <button type="submit" className="btn gold full">حفظ</button>
      </form>

      <div className="product-list">
        {products.map((p) => (
          <div className="product-row" key={p.id}>
            <img src={p.image} alt="img" />
            <div className="meta">
              <div>{p.name}</div>
              <div className="price">{p.price}</div>
            </div>
            <button onClick={() => onDelete(p.id)} className="btn small danger">
              حذف
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

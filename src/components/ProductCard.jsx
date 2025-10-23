import React from "react";

export default function ProductCard({ product }) {
  return (
    <article className="card fade-in">
      <div className="card-media">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="meta">
          <span className="price">{product.price}</span>
          <span className="cat">{product.category}</span>
        </div>
      </div>
    </article>
  );
}

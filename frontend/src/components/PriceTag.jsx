import React from "react";

export default function PriceTag({ price = 0, discount = 0 }) {
  const discounted = +(price * (1 - (discount || 0) / 100)).toFixed(2);

  // formata em BRL
  const format = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="price-block">
      {discount > 0 ? (
        <>
          <div className="price-left">
            <div className="original-price">{format(price)}</div>
            <div className="discounted-price">{format(discounted)}</div>
          </div>

          <div className="price-badge">-{discount}%</div>
        </>
      ) : (
        <div className="discounted-price single">{format(price)}</div>
      )}
    </div>
  );
}

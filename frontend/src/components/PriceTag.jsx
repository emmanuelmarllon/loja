import React from "react";

/**
 * Componente de exibição de preço
 * @param {number} price - Preço original do produto
 * @param {number} discount - Desconto em %
 */
export default function PriceTag({ price = 0, discount = 0 }) {
  // Calcula o preço com desconto, se houver
  const discountedPrice = +(price * (1 - (discount || 0) / 100)).toFixed(2);

  // Função para formatar valores em BRL
  const formatBRL = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="price-block">
      {discount > 0 ? (
        <>
          <div className="price-left">
            <div className="original-price">{formatBRL(price)}</div>
            <div className="discounted-price">{formatBRL(discountedPrice)}</div>
          </div>
          <div className="price-badge">-{discount}%</div>
        </>
      ) : (
        <div className="discounted-price single">{formatBRL(price)}</div>
      )}
    </div>
  );
}

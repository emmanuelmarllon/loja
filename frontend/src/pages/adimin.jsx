import React, { useEffect, useState } from "react";

// ===== ProductForm Component =====
const ProductForm = ({ product, onSave, onCancel }) => {
  const [name, setName] = useState(product?.name || "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [discount, setDiscount] = useState(product?.discount || 0);
  const [category, setCategory] = useState(product?.category || "");
  const [details, setDetails] = useState(product?.details || []);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [image, setImage] = useState(product?.image || "");
  const [gallery, setGallery] = useState(product?.gallery || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prodData = {
      id: product?.id,
      name,
      shortDesc,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount),
      category,
      details: details.filter((d) => d.trim() !== ""),
      featured,
      image,
      gallery: gallery.filter((g) => g.trim() !== ""),
    };
    onSave(prodData);
  };

  const handleDetailsChange = (idx, value) => {
    const newDetails = [...details];
    newDetails[idx] = value;
    setDetails(newDetails);
  };
  const addDetail = () => setDetails([...details, ""]);
  const removeDetail = () => setDetails(details.slice(0, -1));

  const handleGalleryChange = (idx, value) => {
    const newGallery = [...gallery];
    newGallery[idx] = value;
    setGallery(newGallery);
  };
  const addGallery = () => setGallery([...gallery, ""]);
  const removeGallery = () => setGallery(gallery.slice(0, -1));

  return (
    <form className="productForm" onSubmit={handleSubmit}>
      <h3>{product ? "Editar Produto" : "Adicionar Produto"}</h3>

      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Short Desc"
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
        required
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Desconto (%)"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />
      <input
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <label>
        Produto Destaque
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
      </label>

      <div className="formSection">
        <h4>Detalhes</h4>
        {details.map((d, i) => (
          <input
            key={i}
            value={d}
            placeholder={`Detalhe ${i + 1}`}
            onChange={(e) => handleDetailsChange(i, e.target.value)}
          />
        ))}
        <button type="button" onClick={addDetail}>
          Adicionar detalhe
        </button>
        <button type="button" onClick={removeDetail}>
          Remover detalhe
        </button>
      </div>

      <div className="formSection">
        <h4>Galeria</h4>
        {gallery.map((g, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              value={g}
              placeholder={`URL da imagem ${i + 1}`}
              onChange={(e) => handleGalleryChange(i, e.target.value)}
            />
            {g.trim() && (
              <img
                src={g}
                alt={`Preview ${i + 1}`}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  marginTop: 5,
                }}
              />
            )}
          </div>
        ))}
        <button type="button" onClick={addGallery}>
          Adicionar imagem
        </button>
        <button type="button" onClick={removeGallery}>
          Remover imagem
        </button>
      </div>

      <div className="formSection">
        <input
          placeholder="Imagem principal"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {image.trim() && (
          <img
            src={image}
            alt="Imagem principal"
            style={{
              width: 150,
              height: 150,
              objectFit: "cover",
              marginTop: 5,
            }}
          />
        )}
      </div>

      <div className="formSection">
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

// ===== AdminPage Component =====
const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (prod) => {
    try {
      const method = prod.id ? "PUT" : "POST";
      const url = prod.id
        ? `http://localhost:3000/products/${prod.id}`
        : "http://localhost:3000/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar produto");
      }

      setEditing(null);
      fetchProducts();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deletar produto?")) return;

    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Erro ao deletar produto: ${res.status}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="adminPage">
      <h1>Painel Admin - Produtos</h1>

      {editing && (
        <ProductForm
          product={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Destaque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                )}
                {p.name}
              </td>
              <td>R$ {p.price.toFixed(2)}</td>
              <td>{p.featured ? "✅" : "❌"}</td>
              <td>
                <button onClick={() => setEditing(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">
              Total de produtos: {products.length}
              <button style={{ marginLeft: 20 }} onClick={() => setEditing({})}>
                Adicionar Produto
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AdminPage;

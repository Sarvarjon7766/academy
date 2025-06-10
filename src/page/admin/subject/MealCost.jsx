import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:4000/api/product";

const MealCost = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/getAll`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Ovqat ma'lumotlarini olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (productName && productPrice) {
      try {
        const productData = { productName, productPrice };

        if (editId) {
          await axios.put(`${import.meta.env.VITE_API_URL}/product/update/${editId}`, productData);
          setProducts(
            products.map((product) =>
              product._id === editId ? { ...product, ...productData } : product
            )
          );
          setEditId(null);
        } else {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/product/create`, productData);
          setProducts([...products, response.data.product]);
        }

        setProductName("");
        setProductPrice("");
      } catch (error) {
        console.error("Ovqat qo‘shishda xatolik:", error);
      }
    } else {
      alert("Iltimos, mahsulot nomi va narxini kiriting");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/product/delete/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Ovqat o‘chirishda xatolik:", error);
    }
  };

  const editProduct = (product) => {
    setProductName(product.productName);
    setProductPrice(product.productPrice);
    setEditId(product._id);
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">🍽️ Ovqat Narxlari</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Mahsulot nomi"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Narxi (so'm)"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addProduct}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition col-span-1 md:col-span-1"
        >
          {editId ? "✏️ O‘zgartirish" : "➕ Qo‘shish"}
        </button>
      </div>

      {/* Table-like UL Layout */}
      <ul className="w-full border border-gray-300 rounded-lg overflow-hidden">
        {/* Header */}
        <li className="grid grid-cols-4 bg-indigo-200 text-indigo-800 font-semibold p-3 border-b border-gray-300">
          <span>🍲 Mahsulot nomi</span>
          <span>💰 Narxi</span>
          <span></span> {/* Bo'sh ustun */}
          <span>⚙️ Amallar</span>
        </li>

        {/* Product Rows */}
        {products.length > 0 ? (
          products.map((product) => (
            <li
              key={product._id}
              className="grid grid-cols-4 items-center px-4 py-3 border-b hover:bg-indigo-50"
            >
              <span>{product.productName}</span>
              <span>{Number(product.productPrice).toLocaleString("ru-RU")} so'm</span>
              <span></span> {/* Bo'sh ustun */}
              <span className="flex gap-4 justify-start">
                <button
                  onClick={() => editProduct(product)}
                  className="text-blue-600 bg-[#F1F4FF] hover:text-blue-800 rounded-md p-1"
                  title="Tahrirlash"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-600 bg-[#F1F4FF] hover:text-red-800 rounded-md p-1"
                  title="O‘chirish"
                >
                  <FaTrash size={18} />
                </button>
              </span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-600 p-6">Ovqatlar mavjud emas</li>
        )}
      </ul>
    </div>
  );
};

export default MealCost;

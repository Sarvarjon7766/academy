import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaUtensils, FaMoneyBillWave } from "react-icons/fa";

const MealCost = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getAll`);
      setProducts(res.data.products);
    } catch (error) {
      console.error("Ovqat ma'lumotlarini olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!productName || !productPrice) {
      alert("Iltimos, mahsulot nomi va narxini kiriting");
      return;
    }

    const productData = { productName, productPrice };

    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/product/update/${editId}`, productData);
        setProducts((prev) =>
          prev.map((item) =>
            item._id === editId ? { ...item, ...productData } : item
          )
        );
        setEditId(null);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/product/create`, productData);
        setProducts([...products, res.data.product]);
      }

      setProductName("");
      setProductPrice("");
    } catch (error) {
      console.error("Ovqat qo‘shishda xatolik:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/product/delete/${id}`);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Ovqat o‘chirishda xatolik:", error);
    }
  };

  const editProduct = (item) => {
    setProductName(item.productName);
    setProductPrice(item.productPrice);
    setEditId(item._id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="relative z-0">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Mahsulot nomi
            </label>
            <FaUtensils className="absolute right-3 top-3.5 text-gray-400" />
          </div>

          <div className="relative z-0">
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="block py-3 px-4 w-full text-sm bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Narxi (so'm)
            </label>
            <FaMoneyBillWave className="absolute right-3 top-3.5 text-gray-400" />
          </div>

          <button
            onClick={addProduct}
            className={`flex items-center justify-center gap-2 h-full rounded-lg px-4 py-3 text-white font-medium transition-all shadow-lg ${
              editId
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            }`}
          >
            {editId ? <FaEdit /> : "➕"}
            {editId ? "O‘zgartirish" : "Yangi qo‘shish"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  Mahsulot nomi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  Narxi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <FaUtensils className="text-indigo-600" />
                        </div>
                        <span className="font-medium">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                      {Number(item.productPrice).toLocaleString("ru-RU")} so'm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => editProduct(item)}
                          className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Tahrirlash"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(item._id)}
                          className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
                          title="O‘chirish"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-indigo-100 p-4 rounded-full mb-3">
                        <FaUtensils className="text-indigo-500 text-xl" />
                      </div>
                      <p className="text-lg">Hozircha ovqatlar mavjud emas</p>
                      <p className="mt-1">Yuqoridagi formani to‘ldirib yangi mahsulot kiriting</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealCost;

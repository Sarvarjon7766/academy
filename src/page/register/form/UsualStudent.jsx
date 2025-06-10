// import axios from 'axios'
// import React, { useEffect, useState } from 'react'

// const UsualStudent = () => {
//   const [subjects, setSubjects] = useState([])
//   const [addSubjects, setAddSubjects] = useState([])
//   const [teachers, setTeachers] = useState([])
//   const [groups, setGroups] = useState([])
//   const [transports, setTransports] = useState([])
//   const [products, setProducts] = useState([])
//   const [hostels, setHostel] = useState([])

//   const [selectedFan, setSelectedFan] = useState(null)
//   const [selectedTeacher, setSelectedTeacher] = useState(null)
//   const [selectedGroup, setSelectedGroup] = useState(null)

//   //Personal ma'lumotlar
//   const [personal, setPersonal] = useState({
//     isPrivileged: false,
//     fullName: "",
//     date_of_birth: "",
//     gender: "",
//     address: "",
//     old_school: "",
//     old_class: "",
//     phone: "",
//     login: "",
//     password: "",
//     photo: null
//   })
//   //Fan Ma'lumotlari
//   const [subjectForm, setSubjectForm] = useState({
//     MainSubjectId1: "",
//     MainSubjectId2: "",
//     MainSubject1Payment: 0,
//     MainSubject2Payment: 0,
//     AdditionalSubjectId1: "",
//     AdditionalSubjectId2: "",
//     AdditionalSubjectId3: "",
//     AdditionalSubject1Payment: 0,
//     AdditionalSubject2Payment: 0,
//     AdditionalSubject3Payment: 0
//   })
//   //teacherlar ma'lumotlar
//   const [teacherForm, setTeacherForm] = useState({
//     MainTeacherId1: "",
//     MainTeacherId2: "",
//     AdditionalTeacherId1: "",
//     AdditionalTeacherId2: "",
//     AdditionalTeacherId3: "",

//   })
//   //Guruhlarni olish
//   const [groupForm, setGroupForm] = useState({
//     MainGroupId1: "",
//     MainGroupId2: "",
//     AdditionalGroupId1: "",
//     AdditionalGroupId2: "",
//     AdditionalGroupId3: "",
//   })
//   const [hotel, setHotel] = useState({
//     hotelId: '',
//     hotelPrice: 0
//   })
//   const [product, setProduct] = useState({
//     productId: '',
//     productPrice: 0
//   })
//   const [transport, setTransport] = useState({
//     transportId: '',
//     transportPrice: 0
//   })
//   const [payment,setPayment] = useState({
//     DueAmount:0,
//     paidAmount:0
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       setLoading(true)
//       try {
//         const res = await axios.get("http://localhost:4000/api/subject/getAll")
//         const allowedSubjects = ["Matematika", "Tarix", "Ona tili"]
//         const filteredSubjects = res.data.subject.filter(sub =>
//           allowedSubjects.includes(sub.subjectName)
//         )
//         setSubjects(res.data.subject)
//         setAddSubjects(filteredSubjects)
//       } catch (error) {
//         setError("Fanlarni yuklab bo‘lmadi!")
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchSubjects()
//   }, [])

//   useEffect(() => {
//     const fetchOtherCost = async () => {
//       try {
//         const resHotel = await axios.get('http://localhost:4000/api/hostel/getAll')
//         const resTransport = await axios.get('http://localhost:4000/api/transport/getAll')
//         const resProduct = await axios.get('http://localhost:4000/api/product/getAll')
//         setHostel(resHotel.data.hostels || [])
//         setTransports(resTransport.data.transports || [])
//         setProducts(resProduct.data.products || [])
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       }
//     }
//     fetchOtherCost()
//   }, [])
//   useEffect(()=>{
//     const total = subjectForm.MainSubject1Payment + subjectForm.MainSubject2Payment + subjectForm.AdditionalSubject1Payment + subjectForm.AdditionalSubject2Payment + subjectForm.AdditionalSubject3Payment + hotel.hotelPrice + product.productPrice + transport.transportPrice
//     setPayment((prev) =>({
//       ...prev,
//       DueAmount:total
//     }))
//   },[subjectForm.MainSubject1Payment,subjectForm.MainSubject2Payment,subjectForm.AdditionalSubject1Payment,subjectForm.AdditionalSubject2Payment,subjectForm.AdditionalSubject3Payment,hotel.hotelPrice,product.productPrice,transport.transportPrice])
//   const handleSelectFan = async (fan) => {
//     console.log(fan)
//     setSelectedFan(fan)
//     setSelectedTeacher(null)
//     setSelectedGroup(null)
//     setLoading(true)
//     try {
//       const res = await axios.get(`http://localhost:4000/api/teacher/subject/${fan._id}`)
//       setTeachers(res.data.teachers || [])
//     } catch (error) {
//       setError("O‘qituvchilarni yuklab bo‘lmadi!")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSelectTeacher = async (teacher) => {
//     setSelectedTeacher(teacher)
//     setSelectedGroup(null)
//     setLoading(true)

//     try {
//       const res = await axios.get(`http://localhost:4000/api/group/groups/${teacher._id}/${selectedFan._id}`)
//       setGroups(res.data.groups || [])
//     } catch (error) {
//       setError("Guruhlarni yuklab bo‘lmadi!")
//     } finally {
//       setLoading(false)
//     }
//   }
//   const handleSubject = (e) => {
//     const { name, value } = e.target
//     const index = parseInt(e.target.getAttribute("data-index"))
//     const subjectData = JSON.parse(value)
//     if (name === "MainSubjectId1" || name === "MainSubjectId2") {
//       setSubjectForm((prev) => {
//         switch (index) {
//           case 1:
//             return { ...prev, [name]: subjectData._id, MainSubject1Payment: subjectData.mainPrice }
//           case 2:
//             return { ...prev, [name]: subjectData._id, MainSubject2Payment: subjectData.mainPrice }
//           default:
//             return { ...prev, [name]: subjectData.subjectName }
//         }
//       })
//     }
//     if (name === 'AdditionalSubjectId1' || name === 'AdditionalSubjectId2' || name === 'AdditionalSubjectId3') {
//       setSubjectForm((prev) => {
//         switch (index) {
//           case 1:
//             return { ...prev, [name]: subjectData._id, AdditionalSubject1Payment: subjectData.additionalPrice || 0 }
//           case 2:
//             return { ...prev, [name]: subjectData._id, AdditionalSubject2Payment: subjectData.additionalPrice || 0 }
//           case 3:
//             return { ...prev, [name]: subjectData._id, AdditionalSubject3Payment: subjectData.additionalPrice || 0}
//           default:
//             return { ...prev }
//         }
//       })
//     }
//   }
//   const handleTeacher = (e) => {
//     const { name, value } = e.target
//     const index = parseInt(e.target.getAttribute("data-index"))
//     const teacher = JSON.parse(value)
//     if (name === 'MainTeacher1' || name === 'MainTeacher2') {
//       setTeacherForm((prev) => {
//         switch (index) {
//           case 1:
//             return { ...prev, MainTeacherId1: teacher._id }
//           case 2:
//             return { ...prev, MainTeacherId2: teacher._id }
//           default:
//             return { ...prev }
//         }
//       })
//     }
//     if (name === 'AdditionalTeacher1' || name === 'AdditionalTeacher2' || name === 'AdditionalTeacher3') {
//       setTeacherForm((prev) => {
//         switch (index) {
//           case 1:
//             return { ...prev, AdditionalTeacherId1: teacher._id }
//           case 2:
//             return { ...prev, AdditionalTeacherId2: teacher._id }
//           case 3:
//             return { ...prev, AdditionalTeacherId3: teacher._id }
//           default:
//             return { ...prev }
//         }
//       })
//     }
//   }
//   const handleGroup = (e) => {
//     const { name, value } = e.target
//     const index = parseInt(e.target.getAttribute("data-index"))
//     const group = JSON.parse(value)
//     if (name === "MainGroupId1" || name === 'MainGroupId2') {
//       setGroupForm((prev) => {
//         switch (index) {
//           case 1:
//             return { ...prev, [name]: group._id }
//           case 2:
//             return { ...prev, [name]: group._id }
//           default:
//             return { ...prev }
//         }
//       })
//     }
//     if (name === 'AdditionalGroupId1' || name === 'AdditionalGroupId2' || name === 'AdditionalGroupId3') {
//       setGroupForm((prev) => {
//         switch (index) {
//           case 1:
//             return { ...prev, [name]: group._id }
//           case 2:
//             return { ...prev, [name]: group._id }
//           case 3:
//             return { ...prev, [name]: group._id }
//           default:
//             return { ...prev }
//         }
//       })
//     }
//   }
//   const handleHotel = (e) => {
//     const { value, type, checked } = e.target
//     const checkValue = JSON.parse(value)
//     if (type === 'checkbox') {
//       if (checked) {
//         setHotel({ hotelId: checkValue._id, hotelPrice: checkValue.hostelPrice })
//       } else {
//         setHotel({ hotelId: "", hotelPrice: "" })
//       }
//     }
//   }
//   const handleProduct = (e) => {
//     const { value, type, checked } = e.target
//     const checkValue = JSON.parse(value)
//     if (type === 'checkbox') {
//       if (checked) {
//         setProduct({ productId: checkValue._id, productPrice: checkValue.productPrice })
//       } else {
//         setProduct({ productId: "", productPrice: "" })
//       }
//     }}
//   const handleTransport = (e) => {
//     const { value, type, checked } = e.target
//     const checkValue = JSON.parse(value)
//     if (type === 'checkbox') {
//       if (checked) {
//         setTransport({ transportId: checkValue._id, transportPrice: checkValue.transportPrice })
//       } else {
//         setTransport({ transportId: "", transportPrice: "" })
//       }
//     }

//   }
//   const handlePayment = (e) =>{
//     const {name,value} = e.target
//     setPayment((prev)=>({
//       ...prev,
//       [name]:value
//     }))

//   }
  

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target

//     if (type === "file") {
//       console.log(e.target.files[0])
//       setPersonal((prevData) => ({
//         ...prevData,
//         photo: e.target.files[0],
//       }))
//     }
//     setPersonal((prev) => ({
//       ...prev,
//       [name]: value
//     }))
//     console.log(personal)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const newFormData = new FormData()
//     newFormData.append("personal", [JSON.stringify(personal)] || "Sarvar!!!")
//     newFormData.append("subjectForm", [JSON.stringify(subjectForm)] || "Sarvar!!!")
//     newFormData.append("hotel", [JSON.stringify(hotel)] || "Sarvar!!!")
//     newFormData.append("teacherForm", [JSON.stringify(teacherForm)] || "Sarvar!!!")
//     newFormData.append("groupForm", [JSON.stringify(groupForm)] || "Sarvar!!!")
//     newFormData.append("productForm", [JSON.stringify(product)] || "Sarvar!!!")
//     newFormData.append("transportForm", [JSON.stringify(transport)] || "Sarvar!!!")
//     newFormData.append("payment", [JSON.stringify(payment)] || "Sarvar!!!")
//     newFormData.append("photo", personal.photo || null)
//     try {
//       await axios.post("http://localhost:4000/api/student/create", newFormData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       alert("Student registered successfully")
//     } catch (err) {
//       const errorMessage = JSON.stringify(err.response.data)
//       const errornew = JSON.parse(errorMessage)
//       alert(errornew.message)
//     }
//   }


//   return (
//     <form action="" onSubmit={handleSubmit} className="w-full p-4 border rounded mt-2">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
//         <input type="text" name="fullName" placeholder="To'liq ism familiyasi" onChange={handleChange} className="w-full p-2 outline-indigo-700 border rounded" />
//         <input type="date" name="date_of_birth" onChange={handleChange} className="w-full outline-indigo-700 p-2 border rounded" />
//         <select name="gender" onChange={handleChange} className="w-full outline-indigo-700 p-2 border rounded">
//           <option value="">Jinsi</option>
//           <option value="erkak">Erkak</option>
//           <option value="ayol">Ayol</option>
//         </select>
//         <input type="text" name="address" placeholder="Manzili" onChange={handleChange} className="w-full p-2 outline-indigo-700 border rounded" />
//         <input type="text" name="old_school" placeholder="Eski Maktabi" onChange={handleChange} className="w-full outline-indigo-700 p-2 border rounded" />
//         <input type="text" name="old_class" placeholder="sinfi" onChange={handleChange} className="w-full p-2 outline-indigo-700 border rounded" />
//         <input type="text" name="phone" placeholder="Telefon" onChange={handleChange} className="w-full outline-indigo-700 p-2 border rounded" />
//         <input type="text" name="login" placeholder="Login" onChange={handleChange} className="w-full outline-indigo-700 p-2 border rounded" />
//         <input type="password" name="password" placeholder="Parol" onChange={handleChange} className="w-full outline-indigo-700 p-2 border rounded" />
//       </div>
//       <div className='m-5'>
//         <h1 className='font-semibold mt-3 text-indigo-700 mb-2 text-center text-xl'>Asosiy Fanlar</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//           {[1, 2].map((index) => (
//             <div key={index} className="my-2 p-4 rounded w-full">
//               <h3 className="font-semibold text-indigo-700 mb-2">Asosiy Fan {index}</h3>

//               {/* Fan tanlash */}
//               <select
//                 name={`MainSubjectId${index}`}
//                 data-index={index}
//                 className="border outline-indigo-700 p-2 w-full mb-2"
//                 onChange={(e) => {
//                   handleSelectFan(JSON.parse(e.target.value)|| {})
//                   handleSubject(e)
//                 }}
//               >
//                 <option className="outline-indigo-700" value="">Fan tanlang</option>
//                 {subjects.map((subj) => (
//                   <option key={subj._id} value={JSON.stringify(subj) || {}}>{subj.subjectName}</option>
//                 ))}
//               </select>

//               {/* O'qituvchi tanlash */}
//               <select
//                 name={`MainTeacher${index}`}
//                 data-index={index}
//                 className="border outline-indigo-700 p-2 w-full mb-2"
//                 disabled={!subjectForm[`MainSubjectId${index}`]}
//                 onChange={(e) => {
//                   handleSelectTeacher(JSON.parse(e.target.value))
//                   handleTeacher(e)
//                 }}
//               >
//                 <option value="">O‘qituvchi tanlang</option>
//                 {teachers.map((teacher) => (
//                   <option key={teacher._id} value={JSON.stringify(teacher)}>{teacher.fullName}</option>
//                 ))}
//               </select>

//               {/* Guruh tanlash */}
//               <select
//                 name={`MainGroupId${index}`}
//                 data-index={index}
//                 className="border outline-indigo-700 p-2 w-full mb-2"
//                 disabled={!teacherForm[`MainTeacherId${index}`]}
//                 onChange={(e) => {
//                   setSelectedGroup(JSON.parse(e.target.value))
//                   handleGroup(e)
//                 }}
//               >
//                 <option value="">Guruh tanlang</option>
//                 {groups.map((group) => (
//                   <option key={group._id} value={JSON.stringify(group)}>{group.groupName}</option>
//                 ))}
//               </select>

//               {/* Yuklanish yoki xatolik xabari */}
//               {loading && <p className="text-blue-500">Yuklanmoqda...</p>}
//               {error && <p className="text-red-500">{error}</p>}
//             </div>
//           ))}
//         </div>

//         <h1 className='font-semibold text-indigo-700 mb-2 text-center text-xl'>Qo'shimcha Fanlar</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//           {[1, 2, 3].map((index) => (
//             <div key={index} className="my-2 p-4 rounded w-full">
//               <h3 className="font-semibold text-indigo-700 mb-2">Qo'shimcha Fan {index}</h3>

//               {/* Fan tanlash */}
//               <select
//                 name={`AdditionalSubjectId${index}`}
//                 data-index={index}
//                 className="border outline-indigo-700 p-2 w-full mb-2"
//                 onChange={(e) => {
//                   handleSelectFan(JSON.parse(e.target.value))
//                   handleSubject(e)
//                 }}
//               >
//                 <option value="">Fan tanlang</option>
//                 {addSubjects.map((subj) => (
//                   <option key={subj._id} value={JSON.stringify(subj) || {}}>{subj.subjectName}</option>
//                 ))}
//               </select>

//               {/* O'qituvchi tanlash */}
//               <select
//                 name={`AdditionalTeacher${index}`}
//                 data-index={index}
//                 className="border outline-indigo-700 p-2 w-full mb-2"
//                 disabled={!subjectForm[`AdditionalSubjectId${index}`]}
//                 onChange={(e) => {
//                   handleSelectTeacher(JSON.parse(e.target.value))
//                   handleTeacher(e)
//                 }}
//               >
//                 <option value="">O‘qituvchi tanlang</option>
//                 {teachers.map((teacher) => (
//                   <option key={teacher._id} value={JSON.stringify(teacher)}>{teacher.fullName}</option>
//                 ))}
//               </select>

//               {/* Guruh tanlash */}
//               <select
//                 name={`AdditionalGroupId${index}`}
//                 data-index={index}
//                 className="border outline-indigo-700 p-2 w-full mb-2"
//                 disabled={!teacherForm[`AdditionalTeacherId${index}`]}
//                 onChange={(e) => {
//                   setSelectedGroup(JSON.parse(e.target.value))
//                   handleGroup(e)
//                 }}
//               >
//                 <option value="">Guruh tanlang</option>
//                 {groups.map((group) => (
//                   <option key={group._id} value={JSON.stringify(group)}>{group.groupName}</option>
//                 ))}
//               </select>

//               {/* Yuklanish yoki xatolik xabari */}
//               {loading && <p className="text-blue-500">Yuklanmoqda...</p>}
//               {error && <p className="text-red-500">{error}</p>}
//             </div>
//           ))}
//         </div>

//         <div className="mt-4 p-4">
//           <label className="block text-lg text-indigo-700 font-semibold">Qo'shimcha harajatlar</label>

//           {/* Hostel */}
//           <div className="flex flex-wrap lg:flex-nowrap md:grid md:grid-cols-2 sm:grid sm:grid-cols-1 gap-4">
//             {hostels.map((hostel, index) => (
//               <label key={index} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value={JSON.stringify(hostel)}
//                   onChange={(e) => handleHotel(e)}
//                 />
//                 {hostel.hostelName}
//               </label>
//             ))}
//           </div>

//           {/* Product */}
//           <div className="flex flex-wrap lg:flex-nowrap md:grid md:grid-cols-2 sm:grid sm:grid-cols-1 gap-4 mt-4">
//             {products.map((product, index) => (
//               <label key={index} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value={JSON.stringify(product)}
//                   onChange={(e) => handleProduct(e)}
//                 />
//                 {product.productName}
//               </label>
//             ))}
//           </div>

//           {/* Transport */}
//           <div className="flex flex-wrap lg:flex-nowrap md:grid md:grid-cols-2 sm:grid sm:grid-cols-1 gap-4 mt-4">
//             {transports.map((transport, index) => (
//               <label key={index} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value={JSON.stringify(transport)}
//                   onChange={(e) => handleTransport(e)}
//                 />
//                 {transport.transportName}
//               </label>
//             ))}
//           </div>


//         </div>

//         <div className="mt-4 block">
//           <label className="block text-lg text-indigo-700 font-semibold">Rasm yuklash</label>
//           <input
//             type="file"
//             name="photo"
//             onChange={handleChange}
//             className="w-full outline-indigo-700 p-2 border rounded mt-2"
//             accept="image/*"
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//           <div className="w-full">
//             <label className="block text-lg text-indigo-700 font-semibold">Jami oylik to'lov</label>
//             <input
//               type="number"
//               name="DueAmount"
//               value={payment.DueAmount}
//               readOnly
//               className="w-full p-2 border rounded mt-2 bg-gray-100"
//             />
//           </div>

//           <div className="w-full">
//             <label className="block text-lg text-indigo-700 font-semibold">To'langan summa</label>
//             <input
//               type="number"
//               name="paidAmount"
//               onChange={handlePayment}
//               className="w-full p-2 border rounded mt-2"
//               placeholder="To'langan summani kiriting"
//             />
//           </div>
//         </div>
//         <div className="text-center mt-6">
//           <button
//             type="submit"
//             className="px-8 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors"
//           >
//             Ro'yxatdan o'tkazish
//           </button>

//           <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//             <p className="text-xl font-semibold text-indigo-700">
//               Umumiy hisob: {payment.DueAmount.toLocaleString('ru-RU')} so'm
//             </p>
//           </div>
//         </div>

//       </div>
//     </form>
//   )
// }

// export default UsualStudent



const UsualStudent = () => {

  return (
    <div>UsualStudent</div>
  )
}

export default UsualStudent
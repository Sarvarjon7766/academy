import axios from 'axios'
import { useEffect, useState } from 'react'

const RegisterHostel = () => {
	const [hostel, setHostel] = useState([])

	useEffect(() => {
		const fetchHostel = async () => {
			const res = await axios.get('http://localhost:4000/api/room/getAll')
			console.log(res.data)
			if (res.data && res.data.success) {
				setHostel(res.data.data)
			}
		}
		fetchHostel()
	},[])
	return (
		<div>
			<h3 className='text-2xl text-indigo-500 font-bold text-center p-3 m-3'>Yotoq joy holati</h3>

		</div>
	)
}

export default RegisterHostel
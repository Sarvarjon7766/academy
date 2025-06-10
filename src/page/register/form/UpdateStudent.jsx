import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {PersonalUpdate,MainSubjectUpdate,AdditionalSubjectUpdate,OtherCostsUpdate,DeleteStudent} from './studentupdate/index'

const UpdateStudent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { student, section } = location.state || {}

  useEffect(() => {
    if (!student  === undefined) {
      // Agar data mavjud bo'lmasa, foydalanuvchini boshqa sahifaga yo'naltirish
      navigate('/error-or-back-page') // o'zizga kerakli yo'lni yozing
    }
  }, [student, navigate])

  return (
    <div className='p-4 m-3'>
      {Number(section) === 0 && <PersonalUpdate student = {student}/>}
      {Number(section) === 1 && <MainSubjectUpdate student = {student} />}
      {Number(section) === 2 && <AdditionalSubjectUpdate student = {student} />}
      {Number(section) === 3 && <OtherCostsUpdate student = {student} />}
      {Number(section) === 4 && <DeleteStudent student = {student} />}
    </div>
  )
}

export default UpdateStudent

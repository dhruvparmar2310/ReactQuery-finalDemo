/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import './style.css'
import * as api from '../../shared/utils/api/api'

export default function RegistrationForm () {
  const queryClient = useQueryClient()

  const [fName, setFirstName] = useState('')
  const [lName, setLastName] = useState('')
  const [college, setCollege] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')

  // for error
  const [isEmailError, setEmailError] = useState(false)
  const [isContactError, setIsContactError] = useState(false)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['form'],
    queryFn: api.getFormData,
    onSettled: (error) => {
      if (data) {
        console.log('User success data :>> ', data?.data)
      } else {
        console.log('User error :>> ', error.message)
      }
    },
    refetchOnWindowFocus: false
  })

  const { isError, error, mutate } = useMutation({
    mutationFn: async (data) => {
      const result = await axios.post('https://63f4666955677ef68bbb0bf3.mockapi.io/form', data)
      return result
    },
    onSettled: (data, error) => {
      if (data) {
        console.log('Mutation success :>> ', data.data)
      } else {
        console.warn('Mutation Error :>> ', error)
      }
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['form'] })

      const oldData = queryClient.getQueryData(['form'])

      queryClient.setQueryData(['form'], newData)
      return { oldData }
    }
    // onMutate: (data) => console.log('data :>> ', data)
  })
  console.log('User isLoading :>> ', isLoading, 'isFetching :>> ', isFetching)

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    (email.length > 0)
      ? setEmailError(false)
      : setEmailError(true)
  }

  const handleContactChange = (e) => {
    setContact(e.target.value);

    (contact.length > 0)
      ? setIsContactError(false)
      : setIsContactError(true)
  }

  const saveData = (e, fName, lName, college, gender, email, contact) => {
    console.log('fName :>> ', fName)
    console.log('emal :>> ', email)

    // validation pattern
    const contactPattern = /^(\+)?[0|91|1|44]?[-\s]?[6-9]{1}[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/
    const emailPattern = /^([a-zA-Z0-9](\.)?[a-zA-Z0-9]?)+@(gmail|yahoo|yudiz|darshan)\.(com|org|in)$/

    if (!emailPattern.test(email) && !contactPattern.test(contact)) {
      setEmailError(true)
      setIsContactError(true)
    } else if (!emailPattern.test(email) && contactPattern.test(contact)) {
      setEmailError(true)
      setIsContactError(false)
    } else if (emailPattern.test(email) && !contactPattern.test(contact)) {
      setEmailError(false)
      setIsContactError(true)
    } else {
      // mutate logic
      if ((fName && lName && college && gender && emailPattern.test(email) && contactPattern.test(contact)) ||
      (fName && lName && emailPattern.test(email) && contactPattern.test(contact)) ||
      (fName && lName && college && emailPattern.test(email) && contactPattern.test(contact)) ||
      (fName && lName && gender && emailPattern.test(email) && contactPattern.test(contact))) {
        setEmailError(false)
        setIsContactError(false)
        const newData = {
          firstName: fName,
          lastName: lName,
          collegeName: college || '-',
          gender: gender || '-',
          emailId: email,
          contact: contact
        }
        setEmailError(false)
        mutate(newData, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['form']
            })
            console.log('Data Added')
          }
        })
        alert('User Added Successfully...')

        setFirstName('')
        setLastName('')
        setContact('')
        setCollege('')
        setGender('')
        setEmail('')
      }
    }
  }

  if (isError) {
    return <p className='error'>Oops! Something went wrong in Mutation.<br />Error Message: <pre>{error.message}</pre></p>
  }

  return (
    <div className='form'>
      <h4>Registration Form</h4><hr/>
      <span className='warning'><span className='star'>*</span> indicates necessary fields.</span>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className='row'>
          <div className='col'>
            <label>First Name <span className='star'>*</span></label>
            <input className='form-control form-control-sm' type='text' value={fName} onChange={(e) => setFirstName(e.target.value)} required /><br />
          </div>
          <div className='col'>
            <label>Last Name <span className='star'>*</span></label>
            <input className='form-control form-control-sm' type='text' value={lName} onChange={(e) => setLastName(e.target.value)} required /><br />
          </div>
        </div>

        <label>College</label>
        <input className='form-control form-control-sm' type='text' value={college} onChange={(e) => setCollege(e.target.value)} /><br />

        <div className='row'>
          <div className='col'>
            <label id='gender'>Gender</label>
          </div>
          <div className='col option'>
            <input className='form-check-input' type='radio' name='gender' value='male' onChange={(e) => setGender(e.target.value)} />
            <label className="form-check-label" htmlFor="male">
              Male
            </label>
            <input className='form-check-input' type='radio' name='gender' value='female' onChange={(e) => setGender(e.target.value)} />
            <label className="form-check-label" htmlFor="female">
              Female
            </label>
          </div>
        </div>
          <br />

          <label>Email ID <span className='star'>*</span></label>
          {isEmailError && <span className="error">Invalid Email</span>}
          <input className='form-control form-control-sm' type='email' value={email} onChange={(e) => handleEmailChange(e)} required /><br />

          <label>Contact No. <span className='star'>*</span></label>
          {isContactError && <span id="contactError" className="error">Invalid Mobile Number</span>}
          <input className='form-control form-control-sm' id='contactNumber' type='text' value={contact} onChange={(e) => handleContactChange(e)} required /><br />

          <button className='btn btn-sm btn-dark' onClick={(e) => saveData(e, fName, lName, college, gender, email, contact)} type='submit'>Save</button>
      </form>

      <div>
        <h4>User Details</h4><hr/>
        <table className='table table-striped table-hover table-responsive'>
          <thead>
            <tr>
              <th>Name</th>
              <th>College</th>
              <th>Gender</th>
              <th>Email ID</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
          {
            data?.data?.map((user) => {
              return (
                <tr key={user.id}>
                  <td><p>{user?.firstName} {user?.lastName}</p></td>
                  <td><p>{user?.collegeName}</p></td>
                  <td><p>{user?.gender}</p></td>
                  <td><p>{user?.emailId}</p></td>
                  <td><p>{user?.contact}</p></td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

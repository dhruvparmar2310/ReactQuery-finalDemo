/* eslint-disable no-unused-vars */
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import './style.css'
import * as api from '../../shared/utils/api/api'
import axios from 'axios'

export default function User () {
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState(null)

  const { data: userList, isLoading } = useQuery({
    queryKey: ['userList'],
    queryFn: api.getUserList,
    onSettled: (data, error) => {
      if (data) {
        console.log('User list success :>> ', data)
      } else {
        console.log('User list error :>> ', error)
      }
    },
    refetchOnWindowFocus: false
  })

  const handleClick = (e, data) => {
    setUserId(data.id)
    const visibleCard = document.getElementsByClassName('card')
    if (visibleCard.style.display === 'none') {
      visibleCard.style.display = 'block'
    } else {
      visibleCard.style.display = 'none'
    }
    queryClient.invalidateQueries({
      queryKey: ['users']
    })
  }

  const { data: userById, isFetching } = useQuery({
    queryKey: ['users', userId],
    queryFn: async (userId) => {
      // const response = await axios.get(`https://6364ac837b209ece0f4b06db.mockapi.io/userList/${userId.queryKey[1]}`)
      const response = await axios.get(`https://6364ac837b209ece0f4b06db.mockapi.io/users/${userId.queryKey[1]}`)
      return response
    },
    enabled: !!userId
  })

  console.log('isLoading :>> ', isLoading, 'isFetching :>> ', isFetching)

  return (
    <div className='user'>
      <h4>User List</h4><hr/>
      <div>
        <table className='table table-hover table-responsive' cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
          {
            userList?.data.map(data => {
              return (
                <React.Fragment key={data.id}>
                  <tr onClick={(e) => handleClick(e, data)}>
                    <td>
                      {data.id}
                    </td>
                    <td>
                      {data.firstName}
                    </td>
                    <td>
                      {data.lastName}
                    </td>
                    <td>
                      <button className='btn btn-sm btn-warning' onClick={(e) => handleClick(e, data)}>View</button>
                    </td>
                  </tr>
                </React.Fragment>
              )
            })
          }
          </tbody>
        </table>
        <p>User Id: {userId}</p>
        {isFetching && <p className='loading'>Loading Data...</p>}
        {
        userById
          ? <div className='card'>
              <h4>{userById?.data.firstName} {userById?.data.lastName}</h4>
              <p>Email Id : <span className='email'>{userById?.data.email}</span></p>
              <p>College : <span className='college'>{userById?.data.college}</span></p>
              <p>Company : <span className='company'>{userById?.data.company}</span></p>
              <p>City : <span className='city'>{userById?.data.city}</span></p>
            </div>
          : ''
        }
      </div>
    </div>
  )
}

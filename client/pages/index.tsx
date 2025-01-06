import Card from '@/components/card';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const Home = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' })
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '', password: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`)
        setUsers(response.data.reverse()) //Organizes so that newest users are shown first
      } catch (error) {
        console.log('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [])


  //Create user form
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${apiUrl}/users`, newUser)
      setUsers([response.data, ...users])
      setNewUser({ name: '', email: '', password: '' })
    } catch (error) {
      console.log('Error creating user: ', error)
    }
  }

  //Update user form
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(updateUser)
    try {
      await axios.put(`${apiUrl}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email, password: updateUser.password })
      setUpdateUser({ id: '', name: '', password: '', email: '' })
      setUsers(prev => prev.map((user) => {
        if (user.id === parseInt(updateUser.id)) {
          return { ...user, name: updateUser.name, password: updateUser.password, email: updateUser.email, }
        } else {
          return user
        }
      }))
    } catch (error) {
      console.log('Error updating user: ', error)
    }
  }

  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${userId}`)
      setUsers(prev => prev.filter((user) => user.id !== userId))
    } catch (error) {
      console.log('Error creating user: ', error)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          User Management App
        </h1>

        {/* Create user form */}
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input type="text" placeholder='Name' value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <input type="text" placeholder='Password' value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <input type="text" placeholder='Email' value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Add User
          </button>
        </form>


        {/* Update user form */}
        <form onSubmit={handleUpdateUser} className="p-4 bg-green-100 rounded shadow">
          <input type="text" placeholder='User ID' value={updateUser.id} onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <input type="text" placeholder='New Name' value={updateUser.name} onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <input type="text" placeholder='New Password' value={updateUser.password} onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <input type="text" placeholder='New Email' value={updateUser.email} onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })} className='mb-2 w-full p-2 border border-gray-300 rounded' />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-blue-700">
            Update User
          </button>
        </form>

        <div className="space-y-2">
          {users.map((user) => (
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow" key={user.id}>
              <Card {...user} />
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-sm" onClick={() => deleteUser(user.id)}>
                Delete User
              </button>
            </div>
          )
          )}
        </div>
      </div>
    </main>
  )
}

export default Home
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';

export const Home: React.FunctionComponent = () => 
{
  const [content, setContent] = useState<string>('');
  const auth = useContext(AuthContext)

  useEffect(() =>{
    async function fetchUsers() {
      const users = await fetch("/api/v1/auth/user",
      {
        method: 'get',
         headers: {
         Authorization: `Bearer ${auth.jwt}`
         } 
      });

      setContent(await users.text())
    }

    fetchUsers();
  }, [])

  return (
    <div className='container'>
      <h1>Home</h1>
      {content}
    </div>
    )
}

import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';

export const Home: React.FunctionComponent = () => {
  const [content, setContent] = useState<string>('');
  const auth = useContext(AuthContext)

  useEffect(() => {
    
    async function fetchUsers(token: string) {
      const users = await fetch("/api/v1/auth/user",
        {
          method: 'get',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      setContent(await users.text())
    }

    fetchUsers(auth.jwt);
  }, [auth.jwt])

  return (
    <div className='container'>
      <h1>Home</h1>
      {content}
    </div>
  )
}

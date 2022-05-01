import { Container } from '@mui/material';
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

      const json = await users.json()
      setContent(JSON.stringify(json, null, 2))
    }

    fetchUsers(auth.jwt);
  }, [auth.jwt])

  return (
    <div className='container'>
      <Container maxWidth="lg">
        <h1>Home</h1>
        {content}
      </Container>
    </div>
  )
}

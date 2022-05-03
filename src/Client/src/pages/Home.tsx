import { Container } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';

export const Home: React.FunctionComponent = () => {
  const [content, setContent] = useState<string>('');
  const {request} = useContext(AuthContext)

  useEffect(() => {

    async function fetchUsers() {
      const users = await request("/api/v1/auth/user")
      setContent(JSON.stringify(users))
    }

    fetchUsers();
  }, [request])

  return (
    <div className='container'>
      <Container maxWidth="lg">
        <h1>Home</h1>
        {content}
      </Container>
    </div>
  )
}

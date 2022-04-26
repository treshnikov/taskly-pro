import React, { useEffect, useState } from 'react'

export const Home: React.FunctionComponent = () => 
{
  const [content, setContent] = useState<string>('');

  useEffect(() =>{
    async function fetchUsers() {
      const users = await fetch("/api/v1/auth/users",
      {
        method: 'get',

        // jwt will be get from the cookies
        credentials: 'include',
        // headers: {
        //   Authorization: 'Bearer ' + localStorage.getItem("jwt")
        // } 
      });

      setContent(await users.text())
    }

    fetchUsers();
  }, [])

  return (
    <div>
      <h1>Home</h1>
      {content}
    </div>
    )
}

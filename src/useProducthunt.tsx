import { createContext, useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

export const PHContext = createContext('');

export const usePHContext = () => {
  const phContext = useContext(PHContext);
  const router = useRouter();
  const [PHCode, setPHCode] = useState(phContext);


  useEffect(() => {
    if (!PHCode && (!router.query.code && router.isReady)) {
      window.location.href = `${process.env.NEXT_PUBLIC_PH_API_URL}/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_PH_CLIENT_ID}&redirect_uri=${encodeURI(process.env.NEXT_PUBLIC_HOST as string)}&response_type=code&scope=public+private`
    } else {

      const getToken = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PH_API_URL}/oauth/token`, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_PH_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_PH_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_HOST,
            grant_type: 'authorization_code',
            code: router.query.code || PHCode
          }),
        });

        const token = await response.json();

        if(token.access_token) {
          localStorage.setItem('token', token.access_token);
        }
        
        if(router.query.code) {
          setPHCode(router.query.code as string);

          const query = {...router.query};
          delete query.code;

          router.push({
            pathname: router.pathname,
            query,
          })
        }
      }

      getToken();
    }
  }, [router, PHCode, setPHCode])

  return PHCode
}
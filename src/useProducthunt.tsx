import { createContext, useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

export const PHContext = createContext('');

export const usePHContext = () => {
  const phContext = useContext(PHContext);
  const router = useRouter();
  const [PHCode, setPHCode] = useState(phContext);


  useEffect(() => {
    if (!PHCode && (!router.query.code && router.isReady)) {
      window.location.href = `https://api.producthunt.com/v2/oauth/authorize?client_id=${'xqazo43BTFoKiAUGnk7JVtL52GaBfibzfD6j6qtTaYo'}&redirect_uri=${encodeURI('https://nextjs-fetch-test.vercel.app')}&response_type=code&scope=public+private`
    } else {

      const getToken = async () => {
        const response = await fetch('https://api.producthunt.com/v2/oauth/token', {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({
            client_id: 'xqazo43BTFoKiAUGnk7JVtL52GaBfibzfD6j6qtTaYo',
            client_secret: 'ZaAsR_g3HmmKVGSccEY3vkkJ1u7l-Mml2X78Eo6PH9I',
            redirect_uri: 'https://nextjs-fetch-test.vercel.app',
            grant_type: 'authorization_code',
            code: router.query.code || PHCode
          }),
        });

        const token = await response.json();

        setPHCode(router.query.code as string|| PHCode);
        localStorage.setItem('token', token.access_token);
        
        if(router.query.code) {
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
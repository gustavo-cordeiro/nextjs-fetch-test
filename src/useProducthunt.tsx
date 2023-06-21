import { createContext, useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

export const PHContext = createContext('');

export const usePHContext = () => {
  const phContext = useContext(PHContext);
  const router = useRouter();
  const [PHCode, setPHCode] = useState(phContext);


  useEffect(() => {
    if (!PHCode && (!router.query.code && router.isReady)) {
      window.location.href = `https://api.producthunt.com/v2/oauth/authorize?client_id=${'xqazo43BTFoKiAUGnk7JVtL52GaBfibzfD6j6qtTaYo'}&redirect_uri=${encodeURI('https://localhost:3000')}&response_type=code&scope=public+private`
    } else {
      setPHCode(router.query.code || PHCode)
      localStorage.setItem('PHCode', PHCode);
      
      if(router.query.code) {
        const query = {...router.query};
        delete query.code;

        router.push({
          pathname: router.pathname,
          query,
        })
      }
    }
  }, [router, PHCode, setPHCode])

  return PHCode
}
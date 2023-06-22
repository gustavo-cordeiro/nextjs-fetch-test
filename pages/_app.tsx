import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { usePHContext, PHContext } from '../src/useProducthunt';
import { ApolloProvider } from '@apollo/client';
import { client } from 'src/apollo/client';
import { LinearProgress } from '@mui/material';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const PHCode = usePHContext();
  
  return (
    <PHContext.Provider value={PHCode}>
      <ApolloProvider client={client}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {
              !PHCode ?
                <LinearProgress />
              : <Component {...pageProps} />
            }
          </ThemeProvider>
        </CacheProvider>
      </ApolloProvider>
    </PHContext.Provider>
  );
}


export default MyApp;
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { usePHContext } from 'src/useProducthunt';

const httpLink = createHttpLink({
  uri: "https://api.producthunt.com/v2/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  // const PHCode = usePHContext();
  const PHCode = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: PHCode ? `Bearer ${PHCode}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
});
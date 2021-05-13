import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { MessageTypes, SubscriptionClient } from 'subscriptions-transport-ws';


const wsClient = new SubscriptionClient(process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT ?? "", {
  lazy: true,
  reconnect: true,
  connectionParams: () => {
    const token = localStorage.getItem('token');

    return {
      Authorization: token ? `Bearer ${token}` : '',
    };
  },
});

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const wsLink = new WebSocketLink(wsClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

// Forces the client underneat the WebSocketLink to reconnect, regenerating connectionParams
// and giving us an authorized context, since Apollo doesn't give us anyway to do this
// gracefully.
// https://github.com/apollographql/subscriptions-transport-ws/issues/171
function forcefullyResetLink() {
  wsClient.close();
  // This function is private but we need to use it
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  wsClient.connect();

  Object.keys(wsClient.operations).forEach((id) => {
    // This function is private but we need to use it
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    wsClient.sendMessage(id, MessageTypes.GQL_START, wsClient.operations[id].options);
  });
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App forcefullyResetLink={forcefullyResetLink}/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
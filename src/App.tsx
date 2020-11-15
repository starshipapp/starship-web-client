import React from 'react';
import './css/App.css';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://localhost:3000/graphql',
  cache: new InMemoryCache()
});

function App(): JSX.Element {
  return (
    <div className="App">
      <h1>test</h1>
    </div>
  );
}

export default App;

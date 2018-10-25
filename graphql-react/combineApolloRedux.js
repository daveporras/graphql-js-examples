//index.js

import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const init = {
  list: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LIST':
      return {
        state: state,
        list: state.list
      }
    default:
      break;
  }
  return state;
}

const store = createStore(reducer, init);

const client = new ApolloClient({});

const Parent = () => {
  return (
    <ApolloProvider client={client} >
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  )
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);


// App.js

import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';

const query = gql`
query {
  users {
    id,
    name
  }
}
`;

class App extends Component {
  render () {
    console.log(this.props); // Aqui puedes ver las props que redux y Apollo entrega.
    return (
      <ul>
        <span>Here you can render anything...</span>
      </ul>
    );
  }
};

const mapStateToProps = state => ({
  list: state.list
})

const graph = graphql(query);
const reduxx = connect(mapStateToProps, null);

export default compose(reduxx, graph)(SongList);
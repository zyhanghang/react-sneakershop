import React from 'react';
import Products from 'components/Products';

import 'css/app.scss';
import 'css/style.scss';
import Layout from 'Layout';

class App extends React.Component {

  render() {
    return (
      <Layout>
        <Products />
      </Layout>
    );
  }
} 

export default App;
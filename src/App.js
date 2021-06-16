import React from "react";
import { hot } from 'react-hot-loader/root';
import Main from './main.js';
class App extends React.Component {
   render() {
      const { name } = this.props;
      return (<>
        <Main />
        </>);
   }
}
export default hot(App);

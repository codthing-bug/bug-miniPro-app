import { Provider } from 'react-redux';
import { store } from './app/store';

const App = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
};

export default App;



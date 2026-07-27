import { BrowserRouter } from 'react-router-dom';
import './app.css';
import AppRouter from './components/AppRouter';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './state';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 정적 호스팅(GitHub Pages 등)에서 서버 리라이트 없이 동작하도록 HashRouter 를 쓴다 */}
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>,
);

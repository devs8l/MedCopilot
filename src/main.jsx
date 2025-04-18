import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import MedContextProvider from './context/MedContext.jsx';
import ChatContextProvider from './context/ChatContext.jsx';
import { DragDropProvider } from './context/DragDropContext.jsx';
import { ChatTabsProvider } from './context/ChatTabsContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MedContextProvider>
        <ChatContextProvider>
          <DragDropProvider>
            <ChatTabsProvider>
              <App />
            </ChatTabsProvider>
          </DragDropProvider>
        </ChatContextProvider>
      </MedContextProvider>
    </BrowserRouter>
  </StrictMode>
);
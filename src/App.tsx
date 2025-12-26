import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Contact, Help, Home, Login } from './components/pages';
import RutasProtegidas from './components/routes/RutasProtegidas';
import RutasAdmin from './components/routes/RutasAdmin';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from './contexts';
import { ModalManager } from './components/layout/ModalManager';
import { Footer, Sidebar } from './components/common';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from 'antd';
import es from 'antd/locale/es_ES';
import { antdTheme } from './config';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ModalProvider>
        <AuthProvider>
          <ConfigProvider theme={antdTheme} locale={es}>
            <Sidebar />
            <div className="mx-auto lg:pl-64 grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ayuda" element={<Help />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin/*"
                  element={
                    <RutasProtegidas>
                      <RutasAdmin />
                    </RutasProtegidas>
                  }
                />
              </Routes>
            </div>
            <Footer />
            <ModalManager />
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#1f2937',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                  style: {
                    border: '1px solid #10B981',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                  style: {
                    border: '1px solid #EF4444',
                  },
                },
              }}
            />
          </ConfigProvider>
        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;

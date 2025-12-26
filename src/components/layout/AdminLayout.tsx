import { ReactNode } from 'react';
import UserHeader from './UserHeader';
import Breadcrumb from './Breadcrumb';
interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background">
      <UserHeader />
      <Breadcrumb />
      
      {/* Contenido principal */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
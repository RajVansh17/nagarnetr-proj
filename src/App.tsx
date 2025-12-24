import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ReportIssuePage } from './components/ReportIssuePage';
import { TrackIssuesPage } from './components/TrackIssuesPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { Notification } from './components/Notification';
import { UserProfile } from './components/UserProfile';

type Page = 'home' | 'report' | 'track' | 'admin' | 'profile';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    message: '',
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ show: true, type, message });
  };

  const hideNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const handleLogin = (email: string, password: string, isAdmin: boolean) => {
    // Mock authentication - in a real app, this would call an API
    const mockUser: User = {
      id: '12345',
      email,
      name: isAdmin ? 'Admin User' : 'John Doe',
      role: isAdmin ? 'admin' : 'citizen',
    };
    setUser(mockUser);
    setCurrentPage('home');
    showNotification('success', `Welcome back, ${mockUser.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    showNotification('info', 'You have been logged out successfully.');
  };

  const handleNavigate = (page: Page) => {
    // Protect admin routes
    if (page === 'admin' && (!user || user.role !== 'admin')) {
      showNotification('error', 'Access denied. Admin privileges required.');
      return;
    }
    
    // Protect report page from admins
    if (page === 'report' && user && user.role === 'admin') {
      showNotification('error', 'Administrators cannot report issues. Only citizens can report.');
      return;
    }
    
    // Protect report, track, and profile pages for non-authenticated users
    if ((page === 'report' || page === 'track' || page === 'profile') && !user) {
      showNotification('error', 'Please login to access this feature.');
      return;
    }
    
    setCurrentPage(page);
  };

  // Show auth page if not logged in
  if (!user) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        {notification.show && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} user={user} />;
      case 'report':
        return <ReportIssuePage user={user} />;
      case 'track':
        return <TrackIssuesPage userEmail={user.email} userRole={user.role} />;
      case 'profile':
        return <UserProfile user={user} />;
      case 'admin':
        return user.role === 'admin' ? <AdminDashboard /> : <HomePage onNavigate={handleNavigate} user={user} />;
      default:
        return <HomePage onNavigate={handleNavigate} user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
    </div>
  );
}
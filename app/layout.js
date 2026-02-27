import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import PageProgress from '@/components/PageProgress';
import Script from 'next/script';

export const metadata = {
  title: 'Kantri Lawyer | Legal Education Platform',
  description: 'Kantri by Awareness, Honest by Conscience. Access expert legal courses, eBooks, live classes and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <AuthProvider>
          <PageProgress />
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: '90px' }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

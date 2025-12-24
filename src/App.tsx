import { useState } from "react";
import Header from "./components/Header";
import Slideshow from "./components/Slideshow";
import BookingForm from "./components/BookingForm";
import BookingSummary from "./components/BookingSummary";
import BookingTracking from "./components/BookingTracking";
import Facilities from "./components/Facilities";
import About from "./components/About";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import LoadingScreen from "./components/LoadingScreen";
import { SPACING } from "./constants";
import type { BookingFormData } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "booking-summary" | "tracking" | "admin-login" | "admin-dashboard">("home");
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleAdminAccess = () => {
    setIsAdminLoading(true);
    // Pre-mount AdminLogin behind the loading screen
    setTimeout(() => {
      setCurrentView("admin-login");
    }, 50);

    // Reveal after 2 seconds
    setTimeout(() => {
      setIsAdminLoading(false);
    }, 2000);
  };

  const handleBookingSuccess = (data: BookingFormData) => {
    setBookingData(data);
    setCurrentView("booking-summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (id: string) => {
    if (id === 'tracking') {
      setCurrentView('tracking');
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentView("home");
    // Wait for render cycle to restore home view before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      {isAdminLoading && <LoadingScreen />}

      <div className={`min-h-screen bg-gradient-to-br from-neutral-900 via-blue-950/20 to-neutral-900 transition-colors duration-300 ${isAdminLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Decorative Background Pattern */}
        <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Global Ambient Light (Blurred Orbs) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top Left - Blue/Cyan */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>

          {/* Center Right - Purple/Indigo (Floating) */}
          <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-blob delay-2000 mix-blend-screen"></div>

          {/* Bottom Left - Pink/Rose */}
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] animate-pulse-slow delay-4000 mix-blend-screen"></div>
        </div>

        {/* Header with Navigation Handler - Only for public pages */}
        {!['admin-login', 'admin-dashboard'].includes(currentView) && (
          <Header onNavigate={handleNavigation} />
        )}

        {/* Adjust Main Padding based on view */}
        <main className={`relative ${['admin-login', 'admin-dashboard'].includes(currentView) ? '' : 'pt-28'} text-center text-gray-200`}>
          {currentView === "home" ? (
            <>
              {/* Slideshow Section - Full Width */}
              <section id="home" className="mb-4 animate-fadeInUp">
                <Slideshow />
              </section>

              {/* Booking Form - Extra spacing from slideshow */}
              <section className="relative z-20" style={{ marginTop: `${SPACING["4xl"]}px` }}>
                <BookingForm onSuccess={handleBookingSuccess} />
              </section>

              {/* Facilities Section - Generous spacing */}
              <section style={{
                marginTop: `${SPACING["4xl"]}px`,
                marginBottom: `${SPACING["3xl"]}px`
              }}>
                <Facilities />
              </section>

              {/* About Section */}
              <section style={{ marginBottom: `${SPACING["3xl"]}px` }}>
                <About />
              </section>
            </>
          ) : currentView === "booking-summary" ? (
            <BookingSummary
              data={bookingData!}
              onBack={() => setCurrentView("home")}
            />
          ) : currentView === "admin-login" ? (
            <AdminLogin
              onBack={() => setCurrentView("tracking")}
              onLoginSuccess={() => setCurrentView("admin-dashboard")}
            />
          ) : currentView === "admin-dashboard" ? (
            <AdminDashboard onLogout={() => setCurrentView("home")} />
          ) : (
            <BookingTracking
              onBack={() => setCurrentView("home")}
              onAdminLogin={handleAdminAccess}
            />
          )}
        </main>

        {/* Enhanced Footer - Only for public pages */}
        {!['admin-login', 'admin-dashboard'].includes(currentView) && <Footer />}
      </div>
    </>
  );
}

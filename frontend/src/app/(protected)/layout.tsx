import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

export default function AuthenticateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

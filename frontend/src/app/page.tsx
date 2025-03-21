import Footer from "./(protected)/_components/footer";
import Hero from "./_components/hero";
import Navbar from "./_components/navbar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 h-full">
        <Hero />
      </div>
      <Footer />
    </div>
  );
}

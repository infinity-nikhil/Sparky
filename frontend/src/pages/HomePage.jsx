import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero/>
    </div>
  );
}
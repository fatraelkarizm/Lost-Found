import ContactFinder from "@/components/ContactFinders";
import FeaturedItems from "@/components/FeaturedItems";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import SearchFilters from "@/components/SearchFilter";
import SuccessStories from "@/components/SuccessStories";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <SearchFilters />
      <FeaturedItems />
      <ContactFinder />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="success-stories">
        <SuccessStories />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Landing;

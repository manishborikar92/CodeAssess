import Footer from "@/components/marketing/Footer";
import Header from "@/components/marketing/Header";

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

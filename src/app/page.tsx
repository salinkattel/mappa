import Header from "../components/reusables/Header";
import Sidebar from "../components/reusables/Sidebar";
import Map from "../components/main/Map";

export default function TravelAdvicePage() {
  return (
    <div className="min-h-screen bg-[#222831] text-white">
      <Header />
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-grow p-4">
          <Map />
        </main>
      </div>
    </div>
  );
}

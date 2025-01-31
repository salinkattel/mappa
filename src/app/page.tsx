import Header from "../components/reusables/Header";
import Sidebar from "../components/reusables/Sidebar";
import Map from "../components/main/Map";

export default function TravelAdvicePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <main className="flex-grow p-4">
          <Map />
        </main>
      </div>
    </div>
  );
}

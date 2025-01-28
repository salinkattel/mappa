import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";

export default function TravelAdvicePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-grow p-4">
          <Map />
        </main>
      </div>
    </div>
  );
}

import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-screen bg-white overflow-y-auto">
      <header className="border-b border-gray-100">
        <Navbar />
      </header>
      <main className="flex-auto h-full">{children}</main>
    </div>
  );
}

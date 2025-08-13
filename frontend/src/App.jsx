import { useEffect } from "react";
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome 🚀</h1>
      </main>
      <Footer/>
    </div>
  );
}

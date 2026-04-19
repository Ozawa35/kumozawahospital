import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">醫學王</h1>
        <p className="text-2xl text-gray-700 mb-8">醫學診療模擬遊戲</p>
        <Button
          onClick={() => setLocation("/game")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
        >
          進入遊戲
        </Button>
      </div>
    </div>
  );
}

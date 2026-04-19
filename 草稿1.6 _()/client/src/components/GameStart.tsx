import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GameStartProps {
  onStart: (playerInfo: any) => void;
}

export default function GameStart({ onStart }: GameStartProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [workArea, setWorkArea] = useState('');

  const handleStart = () => {
    if (!name || !age || !gender || !workArea) {
      alert('請填寫所有信息');
      return;
    }

    onStart({
      name,
      age: parseInt(age),
      gender,
      workArea,
      level: 1,
      experience: 0,
      successRate: 0
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">醫學王</h1>
        <p className="text-center text-gray-600 mb-8">醫學診療模擬遊戲</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入您的名字"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">年齡</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="輸入年齡"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">性別</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選擇性別</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">工作地區</label>
            <input
              type="text"
              value={workArea}
              onChange={(e) => setWorkArea(e.target.value)}
              placeholder="輸入工作地區"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6"
          >
            開始遊戲
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import GameStart from '../components/GameStart';
import Office from '../components/Office';
import Consultation from '../components/Consultation';

export default function GamePage() {
  const [gameState, setGameState] = useState<'start' | 'office' | 'consultation'>('start');
  const [playerInfo, setPlayerInfo] = useState(null);
  const [currentCase, setCurrentCase] = useState(null);
  const [gameVersion] = useState('1.52');

  const handleGameStart = (info: any) => {
    setPlayerInfo(info);
    setGameState('office');
  };

  const handleSelectCase = (caseData: any) => {
    setCurrentCase(caseData);
    setGameState('consultation');
  };

  const handleReturnToOffice = () => {
    setGameState('office');
    setCurrentCase(null);
  };

  const handleConsultationComplete = (result: any) => {
    console.log('Consultation completed:', result);
    setGameState('office');
    setCurrentCase(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 版本號顯示 */}
      <div className="fixed top-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded">
        v{gameVersion}
      </div>

      {gameState === 'start' && (
        <GameStart onStart={handleGameStart} />
      )}

      {gameState === 'office' && playerInfo && (
        <Office 
          playerInfo={playerInfo}
          onSelectCase={handleSelectCase}
        />
      )}

      {gameState === 'consultation' && currentCase && playerInfo && (
        <Consultation
          caseData={currentCase}
          playerInfo={playerInfo}
          onBack={handleReturnToOffice}
          onComplete={handleConsultationComplete}
        />
      )}
    </div>
  );
}

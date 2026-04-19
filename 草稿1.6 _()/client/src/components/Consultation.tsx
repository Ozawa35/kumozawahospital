import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import MedicalSearch from './MedicalSearch';
import PatientMedicalRecord from './PatientMedicalRecord';
import { calculateDiagnosisScore, calculateToolUsageScore, calculateQuestionScore } from '../utils/scoringSystem';
import { generateSmartResponse } from '../utils/advancedDialogueSystem';

// 預加載圖片
const preloadImages = () => {
  const images = [
    '/clinic-bg.png',
    '/patient-female-1.png',
    '/patient-male-1.png',
    '/patient-female-2.png',
    '/patient-male-2.png'
  ];
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

function Consultation({ caseData, playerInfo, onBack, onComplete }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showMedicalSearch, setShowMedicalSearch] = useState(false);
  const [showBodyMap, setShowBodyMap] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [showDiagnosisInput, setShowDiagnosisInput] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [examinedParts, setExaminedParts] = useState<string[]>([]);
  const [questionsAsked, setQuestionsAsked] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [bodyMapError, setBodyMapError] = useState(null);
  const [userCollectedClues, setUserCollectedClues] = useState<any>({
    symptoms: [],
    medicalHistory: [],
    lifeHistory: []
  });

  // 預加載圖片
  useEffect(() => {
    preloadImages();
    setImagesLoaded(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化對話
  useEffect(() => {
    if (!caseData) return;

    const patientName = caseData.patientInfo?.name || caseData.name || '患者';
    const mainComplaint = caseData.mainComplaint || caseData.symptoms?.[0] || '不茲服';
    const initialMessage = {
      type: 'patient',
      text: `醫生您好，我是${patientName}。我最近${mainComplaint}。`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [caseData]);

  // 處理提問
  const handleQuestion = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'doctor',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestionsAsked(prev => [...prev, inputValue]);
    setInputValue('');

    // 生成患者回答
    const patientResponse = await generateSmartResponse(inputValue, caseData);
    const patientMessage = {
      type: 'patient',
      text: patientResponse,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages(prev => [...prev, patientMessage]);
    }, 500);
  };

  // 處理身體檢查
  const handleBodyCheck = (part: string) => {
    if (!examinedParts.includes(part)) {
      setExaminedParts(prev => [...prev, part]);
    }

    let checkResult = caseData.examinationResults?.[part] || '未發現異常';
    
    // 根據年齡和體重生成不同的數據反饋
    const age = caseData.patientInfo?.age || 0;
    const weight = caseData.patientInfo?.weight || 0;
    
    if (!caseData.examinationResults?.[part]) {
      // 產生基於年齡和體重的診斷結果
      switch(part) {
        case '體溫':
          checkResult = age > 60 ? '體溫36.8℃' : '體溫37.0℃';
          break;
        case '血壓':
          checkResult = age > 50 ? '血壓140/90 mmHg' : '血壓120/80 mmHg';
          break;
        case '血糖':
          checkResult = weight > 80 ? '血糖108 mg/dL' : '血糖95 mg/dL';
          break;
        case '心率':
          checkResult = age > 60 ? '心率72 bpm' : '心率68 bpm';
          break;
        case '呼吸':
          checkResult = age > 50 ? '呼吸18 次/分' : '呼吸16 次/分';
          break;
        default:
          checkResult = '未發現異常';
      }
    }
    
    const message = {
      type: 'system',
      text: `【身體檢查】${part}：${checkResult}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setShowBodyMap(false);
  };

  // 診斷評分邏輯
  const evaluateDiagnosis = (playerDiagnosis: string, correctDisease: string) => {
    if (!correctDisease) {
      return {
        status: '錯誤',
        similarity: 0,
        score: 0
      };
    }
    const playerLower = playerDiagnosis.toLowerCase();
    const correctLower = correctDisease.toLowerCase();

    // 完全相符
    if (playerLower === correctLower) {
      return {
        status: '正確',
        similarity: 100,
        score: 100
      };
    }

    // 部分相符（包含關鍵詞）
    if (playerLower.includes(correctLower) || correctLower.includes(playerLower)) {
      return {
        status: '部分正確',
        similarity: 70,
        score: 70
      };
    }

    // 相關但不完全
    const keywords = correctDisease.split(/[\s、]+/);
    let matchCount = 0;
    keywords.forEach((keyword: string) => {
      if (playerLower.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      const similarity = Math.round((matchCount / keywords.length) * 100);
      return {
        status: '相關診斷',
        similarity: similarity,
        score: Math.round(similarity * 0.5)
      };
    }

    // 完全不符
    return {
      status: '錯誤',
      similarity: 0,
      score: 0
    };
  };

  // 處理診斷提交
  const handleDiagnosisSubmit = () => {
    if (!diagnosis.trim()) return;

    const evaluation = evaluateDiagnosis(diagnosis, caseData.correctDiagnosis || caseData.disease);
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);

    // 根據診斷結果查找疾病資訊
    const diseaseInfo = caseData.diseaseInfo || {};
    
    // 根據疾病類型生成特定的治療理由和後果
    let treatmentReason = '';
    let treatmentConsequence = '';
    
    if (diseaseInfo.name === '急性冠脈綜合徵') {
      treatmentReason = '患者的胸悶和呼吸困難表明心肌缺血，需要立即進行抗血小板治療和硝酸鹽類藥物以恢復冠狀動脈血流。';
      treatmentConsequence = '及時的治療可以防止心肌梗死，降低死亡風險，恢復心臟功能。';
    } else if (diseaseInfo.name === '貧血') {
      treatmentReason = '患者的疲勞和頭暈由紅細胞不足引起，需要補充鐵劑和維生素B12以促進紅細胞生成。';
      treatmentConsequence = '補充營養後，患者的疲勞感會逐漸改善，血氧供應恢復正常。';
    } else if (diseaseInfo.name === '急性胃炎') {
      treatmentReason = '患者的腹痛和嘔吐由胃粘膜炎症引起，需要禁食和抗酸藥物來保護胃粘膜。';
      treatmentConsequence = '正確的治療可以快速緩解症狀，防止胃出血，促進胃粘膜修復。';
    } else if (diseaseInfo.name === '接觸性皮炎') {
      treatmentReason = '患者的皮膚瘙癢和皮疹由過敏原接觸引起，需要避免接觸和使用類固醇藥膏來減輕炎症。';
      treatmentConsequence = '避免接觸後，皮膚炎症會逐漸消退，瘙癢感減輕，皮膚恢復正常。';
    } else if (diseaseInfo.name === '骨關節炎') {
      treatmentReason = '患者的關節疼痛由軟骨退化引起，需要物理治療和止痛藥物來改善活動能力。';
      treatmentConsequence = '適度運動和治療可以延緩病情進展，改善生活質量，減輕疼痛。';
    } else if (diseaseInfo.name === '感冒') {
      treatmentReason = '患者的咳嗽和喉嚨痛由病毒感染引起，需要充分休息和對症治療來幫助身體恢復。';
      treatmentConsequence = '充分休息後，免疫系統可以有效清除病毒，症狀逐漸消退。';
    } else if (diseaseInfo.name === '流感') {
      treatmentReason = '患者的發燒和肌肉酸痛由流感病毒引起，需要抗病毒藥物和充分休息來加速恢復。';
      treatmentConsequence = '及時的抗病毒治療可以縮短病程，防止併發症，促進快速恢復。';
    } else if (diseaseInfo.name === '皮下發炎') {
      treatmentReason = '患者的皮膚瘙癢和紅腫由炎症反應引起，需要冷敷和外用皮質激素來抑制炎症，抗組胺藥可以減輕瘙癢感。';
      treatmentConsequence = '及時的抗炎治療可以快速控制炎症，防止感染，促進皮膚修復。';
    } else if (diseaseInfo.name === '粉瘤') {
      treatmentReason = '患者的皮膚腫塊由角蛋白堆積引起，初期可以觀察，如果腫塊增大或發炎則需要手術切除以防止感染。';
      treatmentConsequence = '早期發現和適當處置可以防止腫塊惡化，避免感染和炎症，改善外觀。';
    } else if (diseaseInfo.name === '過敏性鼻炎') {
      treatmentReason = '患者的打噴嚏和流鼻涕由過敏原引起，需要抗組胺藥和鼻腔噴霧來控制症狀，同時應避免接觸過敏原。';
      treatmentConsequence = '正確的治療和避免過敏原可以顯著改善症狀，提高生活質量，防止症狀加重。';
    } else if (diseaseInfo.name === '灰指甲') {
      treatmentReason = '患者的指甲變厚變色由真菌感染引起，需要長期使用抗真菌藥物和保持指甲乾燥來清除真菌。';
      treatmentConsequence = '堅持治療可以逐漸清除真菌，指甲恢復正常外觀和功能，防止再次感染。';
    } else if (diseaseInfo.name === '唇皰疹') {
      treatmentReason = '患者的嘴角水泡由單純皰疹病毒引起，需要抗病毒藥物和冷敷來加速痊癒，避免接觸他人防止傳播。';
      treatmentConsequence = '及時的抗病毒治療可以縮短病程，減輕疼痛，防止病毒傳播給他人。';
    } else if (diseaseInfo.name === '痔瘡') {
      treatmentReason = '患者的肛門瘙癢和疼痛由血管曲張引起，需要增加纖維攝入、多飲水和使用外用藥物來緩解症狀。';
      treatmentConsequence = '改善飲食習慣和使用外用藥可以緩解症狀，防止出血，改善生活質量。';
    } else if (diseaseInfo.name === '皮膚乾燥症') {
      treatmentReason = '患者的皮膚乾燥和脫皮由缺乏水分和油脂引起，需要定期保濕和補充維生素來恢復皮膚屏障功能。';
      treatmentConsequence = '堅持保濕護理可以逐漸改善皮膚狀況，減輕瘙癢，恢復皮膚光澤。';
    } else {
      treatmentReason = '根據患者的症狀表現和檢查結果，這一處置方案是最合適的。';
      treatmentConsequence = '正確的處置有助於快速緩解患者症狀，促進疾病恢復。'
    }
    
    const scoreReport = {
      playerDiagnosis: diagnosis,
      correctDisease: caseData.disease,
      evaluation: evaluation,
      diagnosisScore: calculateDiagnosisScore(evaluation.score),
      questionScore: calculateQuestionScore(questionsAsked.length),
      toolUsageScore: calculateToolUsageScore(examinedParts.length),
      timeScore: Math.max(0, 100 - Math.round(elapsedTime / 10)),
      totalScore: 0,
      elapsedTime: elapsedTime,
      questionsAsked: questionsAsked.length,
      examinedParts: examinedParts.length,
      initialTreatment: diseaseInfo.treatment || '根據診斷結果進行對症治療',
      treatmentReason: treatmentReason,
      treatmentConsequence: treatmentConsequence
    };

    scoreReport.totalScore = Math.round(
      scoreReport.diagnosisScore * 0.4 +
      scoreReport.questionScore * 0.3 +
      scoreReport.toolUsageScore * 0.2 +
      scoreReport.timeScore * 0.1
    );

    setDiagnosisResult(scoreReport);
    setShowDiagnosisInput(false);
  };

  // 返回辦公室
  const handleReturnToOffice = () => {
    if (onComplete) {
      onComplete(diagnosisResult);
    }
  };

  // 添加玩家線索
  const addClue = (type: string, clue: string) => {
    setUserCollectedClues((prev: any) => ({
      ...prev,
      [type]: prev[type].includes(clue) ? prev[type] : [...prev[type], clue]
    }));
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/雲澤醫院背景拷貝_1aec6581.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* 主要佈局：左側患者 + 中間對話 + 右側病例 */}
        <div className="grid grid-cols-4 gap-4 h-[calc(100vh-100px)]">
          {/* 左側：患者頭像和基本資料 */}
          <div className="bg-white/95 rounded-lg shadow-lg p-4 overflow-y-auto overflow-x-hidden">
            {/* 患者頭像 */}
            <div className="mb-4 text-center">
              <img
                src={caseData?.image || caseData?.patientImage || 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp'}
                alt="患者"
                className="w-full h-64 object-cover rounded-lg mb-3"
                loading="eager"
                decoding="async"
              />
            </div>



            {/* 已搜集線索 */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h3 className="font-bold text-sm mb-2">已搜集線索</h3>
              
              <div className="mb-2">
                <p className="text-xs font-semibold text-red-600">🔴 病狀</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userCollectedClues.symptoms.length > 0 ? (
                    userCollectedClues.symptoms.map((symptom: any, idx: any) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {symptom}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 cursor-pointer hover:text-red-600" onClick={() => {
                      const symptom = prompt('輸入病狀：');
                      if (symptom) {
                        setUserCollectedClues((prev: any) => ({
                          ...prev,
                          symptoms: [...prev.symptoms, symptom]
                        }));
                      }
                    }}>點擊症狀添加</p>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <p className="text-xs font-semibold text-purple-600">🟣 病史</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userCollectedClues.medicalHistory.length > 0 ? (
                    userCollectedClues.medicalHistory.map((history: any, idx: any) => (
                      <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {history}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 cursor-pointer hover:text-purple-600" onClick={() => {
                      const history = prompt('輸入病史：');
                      if (history) {
                        setUserCollectedClues((prev: any) => ({
                          ...prev,
                          medicalHistory: [...prev.medicalHistory, history]
                        }));
                      }
                    }}>點擊病史添加</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-600">🔵 生活史</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userCollectedClues.lifeHistory.length > 0 ? (
                    userCollectedClues.lifeHistory.map((life: any, idx: any) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {life}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 cursor-pointer hover:text-blue-600" onClick={() => {
                      const life = prompt('輸入生活史：');
                      if (life) {
                        setUserCollectedClues((prev: any) => ({
                          ...prev,
                          lifeHistory: [...prev.lifeHistory, life]
                        }));
                      }
                    }}>點擊生活史添加</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 中間：診療對話 */}
          <div className="col-span-2 bg-white/95 rounded-lg shadow-lg p-4 flex flex-col">
            {/* 對話框 */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-lg p-3">
              {messages.map((msg: any, idx: any) => (
                <div key={idx} className={`flex ${msg.type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.type === 'doctor' ? 'bg-blue-500 text-white' :
                    msg.type === 'patient' ? 'bg-gray-300 text-black' :
                    'bg-yellow-200 text-black'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 輸入框 */}
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuestion()}
                placeholder="輸入問題..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600"
              >
                提問
              </button>
            </div>

            {/* 功能列 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowBodyMap(true)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
              >
                身體檢查
              </button>
              <button
                onClick={() => setShowMedicalSearch(!showMedicalSearch)}
                className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600"
              >
                醫學搜索
              </button>
              <button
                onClick={() => setShowDiagnosisInput(!showDiagnosisInput)}
                className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600"
              >
                診斷繳交
              </button>
            </div>

            {/* 身體檢查視窗 */}
            {showBodyMap && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">身體檢查</h3>
                    <button onClick={() => setShowBodyMap(false)} className="text-2xl">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['一般檢查', '體溫', '血壓', '血糖', '心率', '呼吸', '身高', '體重', '頭部', '胸部', '腹部', '四肢', '皮膚', '淋巴結', '耳鼻喉', '眼睛'].map((part) => (
                      <button
                        key={part}
                        onClick={() => handleBodyCheck(part)}
                        className={`px-3 py-2 rounded text-sm font-semibold ${
                          examinedParts.includes(part)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                      >
                        {part} {examinedParts.includes(part) ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 醫學搜索視窗 */}
            {showMedicalSearch && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">醫學搜索</h3>
                    <button onClick={() => setShowMedicalSearch(false)} className="text-2xl">✕</button>
                  </div>
                  <MedicalSearch />
                </div>
              </div>
            )}

            {/* 診斷輸入視窗 */}
            {showDiagnosisInput && !diagnosisResult && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">輸入您的診斷</h3>
                    <button onClick={() => setShowDiagnosisInput(false)} className="text-2xl">✗</button>
                  </div>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="輸入診斷結果..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleDiagnosisSubmit}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
                    >
                      確認
                    </button>
                    <button
                      onClick={() => setShowDiagnosisInput(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 診斷結果視窗 */}
            {diagnosisResult && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">診斷結果</h3>
                    <button onClick={() => setDiagnosisResult(null)} className="text-2xl">✗</button>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>您的診斷：</strong> {diagnosisResult?.playerDiagnosis}</p>
                    <p><strong>正確診斷：</strong> {diagnosisResult?.correctDisease || caseData?.correctDiagnosis || caseData?.disease}</p>
                    <p><strong>結果：</strong> {diagnosisResult?.evaluation?.status}</p>
                    <p><strong>相似度：</strong> {diagnosisResult?.evaluation?.similarity}%</p>
                    <p><strong>總分：</strong> {diagnosisResult?.totalScore}/100</p>
                    <p><strong>診斷精準度：</strong> {diagnosisResult?.diagnosisScore || 0}/100</p>
                    <p><strong>詢問效率：</strong> {diagnosisResult?.questionScore || 0}/100</p>
                    <p><strong>檢查仔細程度：</strong> {diagnosisResult?.toolUsageScore || 0}/100</p>
                    <p><strong>時間分數：</strong> {diagnosisResult?.timeScore || 0}/100</p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded text-xs">
                      <p className="font-semibold mb-2">詢問效率分析：</p>
                      <p className="text-gray-700">您提出了 {diagnosisResult?.questionsAsked || 0} 個提問，效率分數為 {diagnosisResult?.questionScore || 0}/100</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded text-xs">
                      <p className="font-semibold mb-2">檢查仔細程度分析：</p>
                      <p className="text-gray-700">您進行了 {diagnosisResult?.examinedParts || 0} 項檢查，仔細程度分數為 {diagnosisResult?.toolUsageScore || 0}/100</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded text-xs">
                      <p className="font-semibold mb-2">診斷精準度分析：</p>
                      <p className="text-gray-700">您的診斷相似度為 {diagnosisResult?.evaluation?.similarity || 0}%，精準度分數為 {diagnosisResult?.diagnosisScore || 0}/100</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded text-xs">
                      <p className="font-semibold mb-2">初步處置建議：</p>
                      <p className="text-gray-700 mb-2">{diagnosisResult?.initialTreatment || '根據診斷結果進行對症治療'}</p>
                      <p className="font-semibold text-gray-700 mb-1">理由：</p>
                      <p className="text-gray-600 mb-2">{diagnosisResult?.treatmentReason || '根據患者症狀和檢查結果制定'}</p>
                      <p className="font-semibold text-gray-700 mb-1">預期後果：</p>
                      <p className="text-gray-600">{diagnosisResult?.treatmentConsequence || '有助於症狀緩解和疾病恢復'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReturnToOffice}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 mt-3"
                  >
                    確定
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右側：患者病例 */}
          <div className="bg-white/95 rounded-lg shadow-lg p-4 overflow-y-auto overflow-x-hidden">
            <PatientMedicalRecord caseData={caseData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consultation;

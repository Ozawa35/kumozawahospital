export async function generateSmartResponse(question: string, caseData: any) {
  // 根據病例數據和提問內容生成智能回覆
  const lowerQuestion = question.toLowerCase();
  
  // 症狀相關提問 - 更詳細的回覆
  if (lowerQuestion.includes('症狀') || lowerQuestion.includes('感覺') || lowerQuestion.includes('不適') || 
      lowerQuestion.includes('哪裡') || lowerQuestion.includes('怎樣') || lowerQuestion.includes('什麼')) {
    const symptoms = caseData?.symptoms || [];
    if (symptoms.length > 0) {
      const symptomList = symptoms.slice(0, 3).join('、');
      const intensities = ['很嚴重', '比較明顯', '有點不舒服', '中等程度'];
      const intensity = intensities[Math.floor(Math.random() * intensities.length)];
      return `我主要感覺到${symptomList}，症狀${intensity}。`;
    }
    return '我感覺身體不適，主要是一些不明原因的症狀。';
  }
  
  // 持續時間相關提問
  if (lowerQuestion.includes('多久') || lowerQuestion.includes('多長') || lowerQuestion.includes('時間') || 
      lowerQuestion.includes('發作') || lowerQuestion.includes('開始')) {
    const durations = [
      '大約一周前開始的',
      '已經持續兩週了',
      '大概三天前開始',
      '差不多一個月了',
      '最近幾天才開始的'
    ];
    return durations[Math.floor(Math.random() * durations.length)];
  }
  
  // 病史相關提問
  if (lowerQuestion.includes('病史') || lowerQuestion.includes('以前') || lowerQuestion.includes('過去') || 
      lowerQuestion.includes('患過') || lowerQuestion.includes('得過')) {
    const medicalHistory = caseData?.medicalHistory || [];
    if (medicalHistory.length > 0 && medicalHistory[0] !== '無') {
      return `我以前有${medicalHistory.join('、')}的病史。`;
    }
    return '我以前身體還可以，沒有重大疾病。';
  }
  
  // 生活習慣相關提問
  if (lowerQuestion.includes('生活') || lowerQuestion.includes('習慣') || lowerQuestion.includes('工作') || 
      lowerQuestion.includes('日常') || lowerQuestion.includes('平時')) {
    const lifeHistory = caseData?.lifeHistory || [];
    if (lifeHistory.length > 0) {
      return `我的生活習慣是${lifeHistory.join('、')}。`;
    }
    return '我的生活習慣還算規律。';
  }
  
  // 疼痛相關提問
  if (lowerQuestion.includes('痛') || lowerQuestion.includes('疼') || lowerQuestion.includes('酸') || 
      lowerQuestion.includes('脹')) {
    const painLevels = ['有明顯的疼痛', '感覺到酸脹', '有輕微的不適', '疼痛比較厲害'];
    return `是的，${painLevels[Math.floor(Math.random() * painLevels.length)]}。`;
  }
  
  // 飲食相關提問
  if (lowerQuestion.includes('飲食') || lowerQuestion.includes('吃') || lowerQuestion.includes('食物') || 
      lowerQuestion.includes('進食')) {
    return '我最近飲食不太規律，經常吃外賣，也沒有特別忌口。';
  }
  
  // 睡眠相關提問
  if (lowerQuestion.includes('睡眠') || lowerQuestion.includes('休息') || lowerQuestion.includes('疲勞') || 
      lowerQuestion.includes('累')) {
    return '我的睡眠質量不太好，經常熬夜，最近特別感到疲勞。';
  }
  
  // 藥物相關提問
  if (lowerQuestion.includes('藥') || lowerQuestion.includes('吃過') || lowerQuestion.includes('用過')) {
    return '我之前沒有特別吃過什麼藥物，只是偶爾吃些感冒藥。';
  }
  
  // 家族史相關提問
  if (lowerQuestion.includes('家族') || lowerQuestion.includes('父母') || lowerQuestion.includes('親人') || 
      lowerQuestion.includes('遺傳')) {
    return '我的家族中沒有類似的疾病史，父母身體都還可以。';
  }
  
  // 過敏相關提問
  if (lowerQuestion.includes('過敏') || lowerQuestion.includes('敏感') || lowerQuestion.includes('不耐受')) {
    return '我沒有特別的過敏史，但對某些食物可能有輕微反應。';
  }
  
  // 運動相關提問
  if (lowerQuestion.includes('運動') || lowerQuestion.includes('活動') || lowerQuestion.includes('鍛煉')) {
    return '我平時運動比較少，工作比較忙，沒有特別的鍛煉習慣。';
  }
  
  // 預防措施相關提問
  if (lowerQuestion.includes('預防') || lowerQuestion.includes('預防')) {
    return '我平時沒有特別做預防措施，主要是工作太忙。';
  }
  
  // 默認回覆 - 更多樣化
  const defaultResponses = [
    '您能再詳細解釋一下這個問題嗎？',
    '這是個好問題，讓我想一下。',
    '我不太清楚，但我會盡量配合您的檢查。',
    '是的，我注意到這個問題。',
    '這個症狀確實困擾我已經有一段時間了。',
    '我也不太確定原因，希望您能幫我診斷。',
    '您能給我檢查一下嗎？我很擔心。',
    '我覺得可能是工作壓力太大導致的。'
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

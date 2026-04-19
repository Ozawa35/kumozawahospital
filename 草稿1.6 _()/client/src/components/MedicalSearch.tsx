import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';

// 症狀資料庫
const SYMPTOMS_DATABASE = [
  { name: '胸悶', type: 'symptom' },
  { name: '呼吸困難', type: 'symptom' },
  { name: '疲勞', type: 'symptom' },
  { name: '頭暈', type: 'symptom' },
  { name: '頭痛', type: 'symptom' },
  { name: '腹痛', type: 'symptom' },
  { name: '噁心', type: 'symptom' },
  { name: '嘔吐', type: 'symptom' },
  { name: '腹瀉', type: 'symptom' },
  { name: '皮膚瘙癢', type: 'symptom' },
  { name: '皮疹', type: 'symptom' },
  { name: '紅腫', type: 'symptom' },
  { name: '關節疼痛', type: 'symptom' },
  { name: '活動受限', type: 'symptom' },
  { name: '晨僵', type: 'symptom' },
  { name: '咳嗽', type: 'symptom' },
  { name: '流鼻涕', type: 'symptom' },
  { name: '喉嚨痛', type: 'symptom' },
  { name: '發燒', type: 'symptom' },
  { name: '肌肉酸痛', type: 'symptom' }
];

// 疾病資料庫
const DISEASE_DATABASE = [
  {
    name: '急性冠脈綜合徵',
    type: 'disease',
    symptoms: ['胸悶', '呼吸困難', '疲勞', '胸部壓迫感', '左臂酸痛', '出冷汗'],
    treatment: '立即就醫、心電圖檢查、抗血小板藥物、硝酸鹽類',
    description: '由冠狀動脈粥樣硬化引起的心肌缺血，是心臟病的一種嚴重形式。',
    advice: '立即就醫、保持冷靜、避免劇烈運動、監測症狀'
  },
  {
    name: '貧血',
    type: 'disease',
    symptoms: ['疲勞', '頭暈', '蒼白', '臉色蒼白', '指甲蒼白', '心悸'],
    treatment: '補充鐵劑、葉酸、維生素B12、治療原發病',
    description: '紅細胞或血紅蛋白數量不足，導致血液攜氧能力下降。',
    advice: '補充營養、規律作息、避免過度勞累、定期檢查'
  },
  {
    name: '急性胃炎',
    type: 'disease',
    symptoms: ['腹痛', '噁心', '嘔吐', '上腹部疼痛', '食慾不振', '黑便'],
    treatment: '禁食、補液、抗酸藥、止吐藥、治療原因',
    description: '胃粘膜的急性炎症，通常由感染或刺激引起。',
    advice: '清淡飲食、避免刺激性食物、充分休息、監測症狀'
  },
  {
    name: '接觸性皮炎',
    type: 'disease',
    symptoms: ['皮膚瘙癢', '皮疹', '紅腫', '局部紅腫', '水泡', '滲液'],
    treatment: '避免接觸、冷敷、類固醇藥膏、抗組胺藥',
    description: '皮膚與過敏原接觸引起的炎症反應。',
    advice: '避免接觸過敏原、保持皮膚清潔、使用溫和護膚品'
  },
  {
    name: '骨關節炎',
    type: 'disease',
    symptoms: ['關節疼痛', '活動受限', '晨僵', '膝蓋腫脹', '活動時疼痛加重', '晨起僵硬'],
    treatment: '物理治療、止痛藥、抗炎藥、關節注射、手術',
    description: '關節軟骨退化引起的慢性疾病，多見於老年人。',
    advice: '適度運動、體重管理、熱敷、定期檢查'
  },
  {
    name: '感冒',
    type: 'disease',
    symptoms: ['咳嗽', '流鼻涕', '喉嚨痛', '發燒', '疲勞', '頭痛'],
    treatment: '休息、多喝水、對症藥物、維生素C',
    description: '由病毒引起的上呼吸道感染，通常自限性。',
    advice: '多喝溫水、充分休息、避免接觸他人'
  },
  {
    name: '流感',
    type: 'disease',
    symptoms: ['發燒', '咳嗽', '肌肉酸痛', '疲勞', '頭痛', '喉嚨痛'],
    treatment: '休息、多喝水、對症藥物、抗病毒藥',
    description: '由流感病毒引起的呼吸道感染，症狀比感冒更嚴重。',
    advice: '立即就醫、隔離、多喝溫水、充分休息'
  }
];

export default function MedicalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DISEASE_DATABASE>([]);
  const [selectedDisease, setSelectedDisease] = useState<typeof DISEASE_DATABASE[0] | null>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      // 改進搜索邏輯：支持模糊匹配和部分匹配
      const results = DISEASE_DATABASE.filter(disease => {
        const nameMatch = disease.name.toLowerCase().includes(query);
        const symptomMatch = disease.symptoms.some(s => s.toLowerCase().includes(query));
        const descriptionMatch = disease.description.toLowerCase().includes(query);
        return nameMatch || symptomMatch || descriptionMatch;
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectDisease = (disease: typeof DISEASE_DATABASE[0]) => {
    setSelectedDisease(disease);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="搜索症狀或疾病名稱..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {selectedDisease ? (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-800">{selectedDisease.name}</h3>
            <button
              onClick={() => setSelectedDisease(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-1">疾病描述：</p>
              <p className="text-gray-600">{selectedDisease.description}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">常見症狀：</p>
              <div className="flex flex-wrap gap-2">
                {selectedDisease.symptoms.map((symptom, idx) => (
                  <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">治療方法：</p>
              <p className="text-gray-600">{selectedDisease.treatment}</p>
            </div>

          </div>
        </Card>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((disease, idx) => (
              <Card
                key={idx}
                onClick={() => handleSelectDisease(disease)}
                className="p-3 cursor-pointer hover:bg-blue-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{disease.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">症狀：{disease.symptoms.join('、')}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : searchQuery ? (
            <p className="text-gray-500 text-center py-4">未找到相關疾病</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

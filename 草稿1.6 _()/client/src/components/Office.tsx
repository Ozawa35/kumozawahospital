import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiseaseDetailModal } from '@/components/DiseaseDetailModal';
import type { ExtendedDiseaseInfo } from '@/types/disease';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  image: string;
  mainComplaint: string;
  symptoms: string[];
  medicalHistory: string[];
  lifeHistory: string[];
  correctDiagnosis: string;
  disease: string;
  diseaseInfo?: {
    description: string;
    causes: string[];
    prevention: string[];
    treatment: string;
  };
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
  };
}

interface HistoryCase {
  id: number;
  patientName: string;
  diagnosis: string;
  score: number;
  date: string;
  accuracyScore: number;
  efficiencyScore: number;
  carefulness: number;
}

interface PlayerStats {
  diagnosisAccuracy: number;
  historyEfficiency: number;
  carefulness: number;
  totalCases: number;
  successRate: number;
}

const PATIENTS: Patient[] = [
  {
    id: 1,
    name: '王先生',
    age: 45,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '胸悶、呼吸困難',
    symptoms: ['胸痛', '呼吸困難', '出汗'],
    medicalHistory: ['高血壓', '糖尿病'],
    lifeHistory: ['吸菸', '少運動'],
    correctDiagnosis: '急性冠脈綜合徵',
    disease: '急性冠脈綜合徵',
    diseaseInfo: {
      description: '急性冠脈綜合徵是由冠狀動脈粥樣硬化斑塊破裂引起的急性心肌缺血綜合徵',
      causes: ['高血壓', '高血脂', '糖尿病', '吸菸', '肥胖'],
      prevention: ['戒菸', '控制血壓和血糖', '規律運動', '健康飲食'],
      treatment: '緊急醫療干預、抗血小板藥物、他汀類藥物、β受體阻滯劑'
    },
    patientInfo: {
      name: '王先生',
      age: 45,
      gender: '男',
      height: 175,
      weight: 85
    }
  },
  {
    id: 2,
    name: '李女士',
    age: 38,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '頭暈、視物模糊',
    symptoms: ['頭暈', '視物模糊', '疲勞'],
    medicalHistory: ['無'],
    lifeHistory: ['工作壓力大'],
    correctDiagnosis: '貧血',
    disease: '貧血',
    diseaseInfo: {
      description: '貧血是指血液中紅細胞數量或血紅蛋白含量低於正常水平',
      causes: ['鐵缺乏', '維生素B12缺乏', '葉酸缺乏', '慢性疾病'],
      prevention: ['均衡飲食', '補充鐵質食物', '定期檢查'],
      treatment: '補鐵、補充維生素B12、治療原發病'
    },
    patientInfo: {
      name: '李女士',
      age: 38,
      gender: '女',
      height: 165,
      weight: 58
    }
  },
  {
    id: 3,
    name: '陳先生',
    age: 52,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '腹痛、消化不良',
    symptoms: ['腹痛', '消化不良', '便秘'],
    medicalHistory: ['胃潰瘍'],
    lifeHistory: ['飲食不規律'],
    correctDiagnosis: '急性胃炎',
    disease: '急性胃炎',
    diseaseInfo: {
      description: '急性胃炎是胃黏膜的急性炎症',
      causes: ['幽門螺旋菌感染', '刺激性食物', '藥物', '應激'],
      prevention: ['避免刺激性食物', '規律飲食', '減少壓力'],
      treatment: '抑酸藥、保護胃黏膜藥物、飲食調理'
    },
    patientInfo: {
      name: '陳先生',
      age: 52,
      gender: '男',
      height: 172,
      weight: 78
    }
  },
  {
    id: 4,
    name: '張女士',
    age: 35,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '皮膚瘙癢、紅疹',
    symptoms: ['皮膚瘙癢', '紅疹', '脫皮'],
    medicalHistory: ['無'],
    lifeHistory: ['接觸新洗滌劑'],
    correctDiagnosis: '接觸性皮炎',
    disease: '接觸性皮炎',
    diseaseInfo: {
      description: '接觸性皮炎是由接觸刺激物或過敏原引起的皮膚炎症',
      causes: ['接觸過敏原', '刺激性物質', '化學物質'],
      prevention: ['避免接觸過敏原', '使用防護手套', '溫和清潔'],
      treatment: '避免接觸、外用皮質激素、抗組胺藥'
    },
    patientInfo: {
      name: '張女士',
      age: 35,
      gender: '女',
      height: 162,
      weight: 55
    }
  },
  {
    id: 5,
    name: '林先生',
    age: 60,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '關節疼痛、活動受限',
    symptoms: ['關節疼痛', '活動受限', '腫脹'],
    medicalHistory: ['無'],
    lifeHistory: ['長期勞動'],
    correctDiagnosis: '骨關節炎',
    disease: '骨關節炎',
    diseaseInfo: {
      description: '骨關節炎是一種退行性關節疾病，由軟骨磨損引起',
      causes: ['年齡增長', '過度使用', '肥胖', '外傷'],
      prevention: ['保持健康體重', '適度運動', '避免過度勞動'],
      treatment: '物理治療、止痛藥、關節注射、手術'
    },
    patientInfo: {
      name: '林先生',
      age: 60,
      gender: '男',
      height: 170,
      weight: 82
    }
  },
  // 新增 25 個病例
  {
    id: 6,
    name: '劉女士',
    age: 42,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '咳嗽、喉嚨痛',
    symptoms: ['咳嗽', '喉嚨痛', '發熱'],
    medicalHistory: ['無'],
    lifeHistory: ['最近感冒'],
    correctDiagnosis: '急性支氣管炎',
    disease: '急性支氣管炎',
    diseaseInfo: {
      description: '急性支氣管炎是支氣管的急性炎症',
      causes: ['病毒感染', '細菌感染', '吸菸'],
      prevention: ['戒菸', '避免接觸患者', '增強體質'],
      treatment: '止咳藥、祛痰藥、抗生素（如需要）'
    },
    patientInfo: { name: '劉女士', age: 42, gender: '女', height: 160, weight: 60 }
  },
  {
    id: 7,
    name: '周先生',
    age: 55,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '頻尿、口渴',
    symptoms: ['頻尿', '口渴', '體重下降'],
    medicalHistory: ['高血壓'],
    lifeHistory: ['不運動'],
    correctDiagnosis: '2型糖尿病',
    disease: '2型糖尿病',
    diseaseInfo: {
      description: '2型糖尿病是胰島素抵抗導致的代謝疾病',
      causes: ['肥胖', '遺傳', '不良生活方式', '年齡增長'],
      prevention: ['保持健康體重', '規律運動', '健康飲食'],
      treatment: '藥物治療、飲食控制、運動、血糖監測'
    },
    patientInfo: { name: '周先生', age: 55, gender: '男', height: 178, weight: 95 }
  },
  {
    id: 8,
    name: '吳女士',
    age: 28,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '頭痛、噁心',
    symptoms: ['頭痛', '噁心', '視物模糊'],
    medicalHistory: ['無'],
    lifeHistory: ['工作壓力大'],
    correctDiagnosis: '偏頭痛',
    disease: '偏頭痛',
    diseaseInfo: {
      description: '偏頭痛是一種神經血管性頭痛',
      causes: ['遺傳', '激素變化', '壓力', '睡眠不足'],
      prevention: ['減少壓力', '規律作息', '避免觸發因素'],
      treatment: '止痛藥、預防性藥物、生活方式改變'
    },
    patientInfo: { name: '吳女士', age: 28, gender: '女', height: 158, weight: 52 }
  },
  {
    id: 9,
    name: '何先生',
    age: 48,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '失眠、疲勞',
    symptoms: ['失眠', '疲勞', '注意力不集中'],
    medicalHistory: ['無'],
    lifeHistory: ['工作繁忙'],
    correctDiagnosis: '失眠症',
    disease: '失眠症',
    diseaseInfo: {
      description: '失眠症是指難以入睡或保持睡眠的睡眠障礙',
      causes: ['壓力', '焦慮', '不良睡眠習慣', '環境因素'],
      prevention: ['建立規律作息', '放鬆技巧', '避免刺激物'],
      treatment: '認知行為治療、睡眠衛生改善、藥物治療'
    },
    patientInfo: { name: '何先生', age: 48, gender: '男', height: 175, weight: 80 }
  },
  {
    id: 10,
    name: '鄒女士',
    age: 33,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '腹瀉、腹痛',
    symptoms: ['腹瀉', '腹痛', '食慾不振'],
    medicalHistory: ['無'],
    lifeHistory: ['飲食不潔'],
    correctDiagnosis: '急性腸胃炎',
    disease: '急性腸胃炎',
    diseaseInfo: {
      description: '急性腸胃炎是腸胃道的急性炎症',
      causes: ['細菌感染', '病毒感染', '食物中毒', '寄生蟲'],
      prevention: ['食物衛生', '飲用安全水', '手部衛生'],
      treatment: '補液、止瀉藥、抗生素（如需要）、飲食調理'
    },
    patientInfo: { name: '鄒女士', age: 33, gender: '女', height: 163, weight: 58 }
  },
  {
    id: 11,
    name: '馬先生',
    age: 50,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '尿頻、尿急',
    symptoms: ['尿頻', '尿急', '尿痛'],
    medicalHistory: ['無'],
    lifeHistory: ['飲水過多'],
    correctDiagnosis: '尿路感染',
    disease: '尿路感染',
    diseaseInfo: {
      description: '尿路感染是尿道、膀胱或腎臟的細菌感染',
      causes: ['細菌感染', '個人衛生不佳', '免疫力低下'],
      prevention: ['飲用充足水分', '排尿後擦拭', '避免憋尿'],
      treatment: '抗生素、多飲水、止痛藥'
    },
    patientInfo: { name: '馬先生', age: 50, gender: '男', height: 172, weight: 75 }
  },
  {
    id: 12,
    name: '高女士',
    age: 40,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '乳房脹痛、腫塊',
    symptoms: ['乳房脹痛', '乳房腫塊', '乳頭分泌物'],
    medicalHistory: ['無'],
    lifeHistory: ['月經週期不規律'],
    correctDiagnosis: '乳腺增生',
    disease: '乳腺增生',
    diseaseInfo: {
      description: '乳腺增生是乳腺組織的良性增生',
      causes: ['激素失衡', '月經週期', '壓力', '飲食'],
      prevention: ['穿著合適內衣', '減少咖啡因', '管理壓力'],
      treatment: '觀察、止痛藥、激素治療（如需要）'
    },
    patientInfo: { name: '高女士', age: 40, gender: '女', height: 165, weight: 62 }
  },
  {
    id: 13,
    name: '郭先生',
    age: 58,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '排尿困難、尿流弱',
    symptoms: ['排尿困難', '尿流弱', '夜間尿頻'],
    medicalHistory: ['無'],
    lifeHistory: ['年齡增長'],
    correctDiagnosis: '良性前列腺增生',
    disease: '良性前列腺增生',
    diseaseInfo: {
      description: '良性前列腺增生是前列腺的非癌性增大',
      causes: ['年齡增長', '激素變化'],
      prevention: ['保持健康體重', '規律運動', '限制咖啡因'],
      treatment: '藥物治療、手術治療（如需要）'
    },
    patientInfo: { name: '郭先生', age: 58, gender: '男', height: 170, weight: 78 }
  },
  {
    id: 14,
    name: '葉女士',
    age: 45,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '甲狀腺腫大、疲勞',
    symptoms: ['甲狀腺腫大', '疲勞', '體重增加'],
    medicalHistory: ['無'],
    lifeHistory: ['碘攝入不足'],
    correctDiagnosis: '甲狀腺功能減退',
    disease: '甲狀腺功能減退',
    diseaseInfo: {
      description: '甲狀腺功能減退是甲狀腺激素分泌不足',
      causes: ['自身免疫', '碘缺乏', '手術', '放射治療'],
      prevention: ['碘攝入充足', '定期檢查'],
      treatment: '甲狀腺激素替代療法'
    },
    patientInfo: { name: '葉女士', age: 45, gender: '女', height: 160, weight: 68 }
  },
  {
    id: 15,
    name: '石先生',
    age: 52,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '腰痛、下肢放射痛',
    symptoms: ['腰痛', '下肢放射痛', '活動受限'],
    medicalHistory: ['無'],
    lifeHistory: ['久坐工作'],
    correctDiagnosis: '腰椎間盤突出',
    disease: '腰椎間盤突出',
    diseaseInfo: {
      description: '腰椎間盤突出是椎間盤髓核向外突出',
      causes: ['年齡增長', '外傷', '不良姿勢', '過度勞動'],
      prevention: ['正確姿勢', '適度運動', '避免過度勞動'],
      treatment: '物理治療、止痛藥、肌肉鬆弛劑、手術'
    },
    patientInfo: { name: '石先生', age: 52, gender: '男', height: 175, weight: 82 }
  },
  {
    id: 16,
    name: '唐女士',
    age: 36,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '月經不規律、痛經',
    symptoms: ['月經不規律', '痛經', '腹脹'],
    medicalHistory: ['無'],
    lifeHistory: ['壓力大'],
    correctDiagnosis: '月經不調',
    disease: '月經不調',
    diseaseInfo: {
      description: '月經不調是月經週期或流量異常',
      causes: ['激素失衡', '壓力', '體重變化', '疾病'],
      prevention: ['管理壓力', '保持健康體重', '規律作息'],
      treatment: '激素治療、中醫調理、治療原發病'
    },
    patientInfo: { name: '唐女士', age: 36, gender: '女', height: 162, weight: 56 }
  },
  {
    id: 17,
    name: '韋先生',
    age: 44,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '皮膚瘙癢、皮疹',
    symptoms: ['皮膚瘙癢', '皮疹', '乾燥'],
    medicalHistory: ['無'],
    lifeHistory: ['接觸化學物質'],
    correctDiagnosis: '濕疹',
    disease: '濕疹',
    diseaseInfo: {
      description: '濕疹是皮膚的慢性炎症性疾病',
      causes: ['遺傳', '過敏原', '刺激物', '壓力'],
      prevention: ['避免刺激物', '保持皮膚濕潤', '減少壓力'],
      treatment: '外用皮質激素、保濕、抗組胺藥'
    },
    patientInfo: { name: '韋先生', age: 44, gender: '男', height: 173, weight: 76 }
  },
  {
    id: 18,
    name: '馬女士',
    age: 50,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '潮熱、盜汗、情緒波動',
    symptoms: ['潮熱', '盜汗', '情緒波動'],
    medicalHistory: ['無'],
    lifeHistory: ['年齡增長'],
    correctDiagnosis: '更年期綜合徵',
    disease: '更年期綜合徵',
    diseaseInfo: {
      description: '更年期綜合徵是更年期激素變化引起的症狀',
      causes: ['激素水平下降', '年齡增長'],
      prevention: ['規律運動', '健康飲食', '管理壓力'],
      treatment: '激素替代療法、藥物治療、生活方式改變'
    },
    patientInfo: { name: '馬女士', age: 50, gender: '女', height: 160, weight: 65 }
  },
  {
    id: 19,
    name: '龔先生',
    age: 56,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '關節腫脹、疼痛',
    symptoms: ['關節腫脹', '關節疼痛', '晨僵'],
    medicalHistory: ['無'],
    lifeHistory: ['無'],
    correctDiagnosis: '類風濕關節炎',
    disease: '類風濕關節炎',
    diseaseInfo: {
      description: '類風濕關節炎是自身免疫性關節疾病',
      causes: ['自身免疫', '遺傳', '環境因素'],
      prevention: ['早期診斷', '適度運動', '管理壓力'],
      treatment: '免疫抑制劑、生物製劑、物理治療'
    },
    patientInfo: { name: '龔先生', age: 56, gender: '男', height: 172, weight: 80 }
  },
  {
    id: 20,
    name: '侯女士',
    age: 32,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '喘息、胸悶',
    symptoms: ['喘息', '胸悶', '咳嗽'],
    medicalHistory: ['無'],
    lifeHistory: ['過敏體質'],
    correctDiagnosis: '哮喘',
    disease: '哮喘',
    diseaseInfo: {
      description: '哮喘是氣道慢性炎症性疾病',
      causes: ['遺傳', '過敏原', '環境污染', '感染'],
      prevention: ['避免觸發因素', '保持環境清潔', '規律運動'],
      treatment: '吸入皮質激素、支氣管擴張劑、避免觸發因素'
    },
    patientInfo: { name: '侯女士', age: 32, gender: '女', height: 158, weight: 54 }
  },
  {
    id: 21,
    name: '柯先生',
    age: 48,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '肌肉酸痛、無力',
    symptoms: ['肌肉酸痛', '無力', '疲勞'],
    medicalHistory: ['無'],
    lifeHistory: ['過度運動'],
    correctDiagnosis: '肌肉勞損',
    disease: '肌肉勞損',
    diseaseInfo: {
      description: '肌肉勞損是肌肉過度使用引起的損傷',
      causes: ['過度運動', '不良姿勢', '創傷'],
      prevention: ['適度運動', '正確姿勢', '充分休息'],
      treatment: '休息、冰敷、止痛藥、物理治療'
    },
    patientInfo: { name: '柯先生', age: 48, gender: '男', height: 175, weight: 78 }
  },
  {
    id: 22,
    name: '盧女士',
    age: 41,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '頭暈、耳鳴',
    symptoms: ['頭暈', '耳鳴', '聽力下降'],
    medicalHistory: ['無'],
    lifeHistory: ['噪音環境'],
    correctDiagnosis: '梅尼埃病',
    disease: '梅尼埃病',
    diseaseInfo: {
      description: '梅尼埃病是內耳疾病引起的眩暈',
      causes: ['內耳液體積聚', '遺傳', '免疫異常'],
      prevention: ['減少鹽分攝入', '避免刺激', '管理壓力'],
      treatment: '利尿藥、前庭抑制劑、手術治療'
    },
    patientInfo: { name: '盧女士', age: 41, gender: '女', height: 162, weight: 60 }
  },
  {
    id: 23,
    name: '譚先生',
    age: 54,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '吞嚥困難、胸痛',
    symptoms: ['吞嚥困難', '胸痛', '食慾不振'],
    medicalHistory: ['無'],
    lifeHistory: ['吸菸'],
    correctDiagnosis: '食管癌',
    disease: '食管癌',
    diseaseInfo: {
      description: '食管癌是食管上皮細胞的惡性腫瘤',
      causes: ['吸菸', '飲酒', '熱飲', '遺傳'],
      prevention: ['戒菸限酒', '避免熱飲', '健康飲食'],
      treatment: '手術、化療、放療、靶向治療'
    },
    patientInfo: { name: '譚先生', age: 54, gender: '男', height: 170, weight: 75 }
  },
  {
    id: 24,
    name: '余女士',
    age: 38,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '腹脹、便秘',
    symptoms: ['腹脹', '便秘', '腹痛'],
    medicalHistory: ['無'],
    lifeHistory: ['飲食纖維不足'],
    correctDiagnosis: '腸易激綜合徵',
    disease: '腸易激綜合徵',
    diseaseInfo: {
      description: '腸易激綜合徵是腸道功能性疾病',
      causes: ['壓力', '飲食', '腸道菌群失衡'],
      prevention: ['增加纖維攝入', '管理壓力', '規律作息'],
      treatment: '飲食調理、止痛藥、益生菌、心理治療'
    },
    patientInfo: { name: '余女士', age: 38, gender: '女', height: 160, weight: 58 }
  },
  {
    id: 25,
    name: '賴先生',
    age: 46,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '視力模糊、眼痛',
    symptoms: ['視力模糊', '眼痛', '眼紅'],
    medicalHistory: ['無'],
    lifeHistory: ['長期用眼'],
    correctDiagnosis: '青光眼',
    disease: '青光眼',
    diseaseInfo: {
      description: '青光眼是眼內壓升高導致的視神經損傷',
      causes: ['眼內壓升高', '遺傳', '年齡增長'],
      prevention: ['定期檢查', '避免眼部外傷', '管理壓力'],
      treatment: '降眼壓藥、激光治療、手術治療'
    },
    patientInfo: { name: '賴先生', age: 46, gender: '男', height: 172, weight: 76 }
  },
  {
    id: 26,
    name: '顏女士',
    age: 35,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '肌肉無力、下肢癱瘓',
    symptoms: ['肌肉無力', '下肢癱瘓', '感覺異常'],
    medicalHistory: ['無'],
    lifeHistory: ['無'],
    correctDiagnosis: '脊髓炎',
    disease: '脊髓炎',
    diseaseInfo: {
      description: '脊髓炎是脊髓的炎症性疾病',
      causes: ['病毒感染', '自身免疫', '外傷'],
      prevention: ['預防感染', '避免外傷', '增強免疫'],
      treatment: '皮質激素、免疫抑制劑、物理治療'
    },
    patientInfo: { name: '顏女士', age: 35, gender: '女', height: 162, weight: 56 }
  },
  {
    id: 27,
    name: '龍先生',
    age: 52,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '肝區疼痛、黃疸',
    symptoms: ['肝區疼痛', '黃疸', '腹脹'],
    medicalHistory: ['乙肝'],
    lifeHistory: ['飲酒'],
    correctDiagnosis: '肝硬化',
    disease: '肝硬化',
    diseaseInfo: {
      description: '肝硬化是肝臟慢性損傷導致的纖維化',
      causes: ['乙肝', '飲酒', '脂肪肝'],
      prevention: ['戒酒', '乙肝疫苗', '健康飲食'],
      treatment: '藥物治療、飲食調理、併發症管理'
    },
    patientInfo: { name: '龍先生', age: 52, gender: '男', height: 170, weight: 80 }
  },
  {
    id: 28,
    name: '何女士',
    age: 44,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '乳房腫塊、疼痛',
    symptoms: ['乳房腫塊', '乳房疼痛', '乳頭分泌物'],
    medicalHistory: ['無'],
    lifeHistory: ['無'],
    correctDiagnosis: '乳腺纖維腺瘤',
    disease: '乳腺纖維腺瘤',
    diseaseInfo: {
      description: '乳腺纖維腺瘤是乳腺的良性腫瘤',
      causes: ['激素水平', '遺傳'],
      prevention: ['定期自檢', '定期檢查'],
      treatment: '觀察、手術切除（如需要）'
    },
    patientInfo: { name: '何女士', age: 44, gender: '女', height: 162, weight: 62 }
  },
  {
    id: 29,
    name: '曾先生',
    age: 58,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '呼吸困難、咳嗽',
    symptoms: ['呼吸困難', '咳嗽', '胸痛'],
    medicalHistory: ['吸菸'],
    lifeHistory: ['長期吸菸'],
    correctDiagnosis: '慢性阻塞性肺疾病',
    disease: '慢性阻塞性肺疾病',
    diseaseInfo: {
      description: '慢性阻塞性肺疾病是肺氣流受限的疾病',
      causes: ['吸菸', '空氣污染', '職業暴露'],
      prevention: ['戒菸', '避免污染', '職業防護'],
      treatment: '支氣管擴張劑、皮質激素、氧療'
    },
    patientInfo: { name: '曾先生', age: 58, gender: '男', height: 172, weight: 78 }
  },
  {
    id: 30,
    name: '謝女士',
    age: 40,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '焦慮、恐慌發作',
    symptoms: ['焦慮', '恐慌發作', '心悸'],
    medicalHistory: ['無'],
    lifeHistory: ['工作壓力大'],
    correctDiagnosis: '焦慮症',
    disease: '焦慮症',
    diseaseInfo: {
      description: '焦慮症是過度焦慮和恐懼的精神疾病',
      causes: ['遺傳', '壓力', '創傷'],
      prevention: ['管理壓力', '規律運動', '冥想'],
      treatment: '心理治療、抗焦慮藥、認知行為治療'
    },
    patientInfo: { name: '謝女士', age: 40, gender: '女', height: 160, weight: 60 }
  },
  {
    id: 31,
    name: '鄭先生',
    age: 49,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '痛風發作、腳踝腫脹',
    symptoms: ['痛風發作', '腳踝腫脹', '關節疼痛'],
    medicalHistory: ['無'],
    lifeHistory: ['飲食高嘌呤'],
    correctDiagnosis: '痛風',
    disease: '痛風',
    diseaseInfo: {
      description: '痛風是尿酸結晶引起的關節炎',
      causes: ['尿酸升高', '飲食', '遺傳'],
      prevention: ['低嘌呤飲食', '多飲水', '控制體重'],
      treatment: '止痛藥、降尿酸藥、飲食控制'
    },
    patientInfo: { name: '鄭先生', age: 49, gender: '男', height: 175, weight: 88 }
  },
  {
    id: 32,
    name: '林女士',
    age: 37,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '皮膚瘙癢、脫髮',
    symptoms: ['皮膚瘙癢', '脫髮', '皮膚乾燥'],
    medicalHistory: ['無'],
    lifeHistory: ['營養不足'],
    correctDiagnosis: '營養缺乏症',
    disease: '營養缺乏症',
    diseaseInfo: {
      description: '營養缺乏症是由營養物質不足引起的疾病',
      causes: ['飲食不均衡', '吸收不良', '代謝異常'],
      prevention: ['均衡飲食', '營養補充', '定期檢查'],
      treatment: '營養補充、飲食調理、治療原發病'
    },
    patientInfo: { name: '林女士', age: 37, gender: '女', height: 160, weight: 54 }
  },
  {
    id: 33,
    name: '吳先生',
    age: 55,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '記憶力下降、認知障礙',
    symptoms: ['記憶力下降', '認知障礙', '定向障礙'],
    medicalHistory: ['無'],
    lifeHistory: ['年齡增長'],
    correctDiagnosis: '阿爾茨海默病',
    disease: '阿爾茨海默病',
    diseaseInfo: {
      description: '阿爾茨海默病是進行性神經退行性疾病',
      causes: ['年齡增長', '遺傳', '環境因素'],
      prevention: ['認知訓練', '社交活動', '健康飲食'],
      treatment: '認知增強藥、行為治療、護理支持'
    },
    patientInfo: { name: '吳先生', age: 55, gender: '男', height: 170, weight: 75 }
  },
  {
    id: 34,
    name: '陸女士',
    age: 43,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '頭暈、心悸、呼吸困難',
    symptoms: ['頭暈', '心悸', '呼吸困難'],
    medicalHistory: ['無'],
    lifeHistory: ['月經不規律'],
    correctDiagnosis: '貧血',
    disease: '貧血',
    diseaseInfo: {
      description: '貧血是血紅蛋白或紅細胞數量不足',
      causes: ['鐵缺乏', '維生素缺乏', '慢性疾病'],
      prevention: ['均衡飲食', '定期檢查'],
      treatment: '補鐵、補充維生素、治療原發病'
    },
    patientInfo: { name: '陸女士', age: 43, gender: '女', height: 162, weight: 60 }
  },
  {
    id: 35,
    name: '孫先生',
    age: 50,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '排便習慣改變、便血',
    symptoms: ['排便習慣改變', '便血', '腹痛'],
    medicalHistory: ['無'],
    lifeHistory: ['飲食不健康'],
    correctDiagnosis: '結腸癌',
    disease: '結腸癌',
    diseaseInfo: {
      description: '結腸癌是結腸上皮細胞的惡性腫瘤',
      causes: ['年齡增長', '飲食', '遺傳', '炎症性腸病'],
      prevention: ['健康飲食', '定期篩查', '運動'],
      treatment: '手術、化療、放療、靶向治療'
    },
    patientInfo: { name: '孫先生', age: 50, gender: '男', height: 172, weight: 82 }
  },
  // 新增 15 個輕微普遍疾病的病例
  {
    id: 36,
    name: '王女士',
    age: 32,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '皮膚瘙癢、紅腫',
    symptoms: ['皮膚瘙癢', '紅腫', '皮疹'],
    medicalHistory: ['無'],
    lifeHistory: ['最近使用新護膚品'],
    correctDiagnosis: '皮下發炎',
    disease: '皮下發炎',
    diseaseInfo: {
      description: '皮下發炎是皮膚組織的急性炎症反應',
      causes: ['過敏原接觸', '細菌感染', '刺激物質'],
      prevention: ['避免過敏原', '皮膚清潔', '使用溫和護膚品'],
      treatment: '外用皮質激素、抗組胺藥、冷敷'
    },
    patientInfo: { name: '王女士', age: 32, gender: '女', height: 160, weight: 52 }
  },
  {
    id: 37,
    name: '李先生',
    age: 28,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '頭皮上有小腫塊',
    symptoms: ['頭皮腫塊', '無痛', '逐漸增大'],
    medicalHistory: ['無'],
    lifeHistory: ['無特殊'],
    correctDiagnosis: '粉瘤',
    disease: '粉瘤',
    diseaseInfo: {
      description: '粉瘤是皮膚上的良性腫瘤，由角蛋白堆積形成',
      causes: ['皮脂腺阻塞', '毛囊堵塞', '遺傳因素'],
      prevention: ['皮膚清潔', '避免擠壓', '定期檢查'],
      treatment: '觀察、外用藥物、手術切除'
    },
    patientInfo: { name: '李先生', age: 28, gender: '男', height: 175, weight: 70 }
  },
  {
    id: 38,
    name: '張女士',
    age: 26,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '眼睛癢、打噴嚏',
    symptoms: ['眼睛癢', '打噴嚏', '流鼻涕', '鼻塞'],
    medicalHistory: ['無'],
    lifeHistory: ['春季花粉多'],
    correctDiagnosis: '過敏性鼻炎',
    disease: '過敏性鼻炎',
    diseaseInfo: {
      description: '過敏性鼻炎是由過敏原引起的鼻腔炎症',
      causes: ['花粉', '塵蟎', '寵物毛髮', '空氣污染'],
      prevention: ['避免過敏原', '空氣淨化', '定期清潔'],
      treatment: '抗組胺藥、鼻腔噴霧、脫敏治療'
    },
    patientInfo: { name: '張女士', age: 26, gender: '女', height: 162, weight: 50 }
  },
  {
    id: 39,
    name: '陳先生',
    age: 35,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '腳趾甲變厚、變色',
    symptoms: ['腳趾甲增厚', '變色', '易碎'],
    medicalHistory: ['無'],
    lifeHistory: ['經常去公共浴室'],
    correctDiagnosis: '灰指甲',
    disease: '灰指甲',
    diseaseInfo: {
      description: '灰指甲是由真菌感染引起的指甲疾病',
      causes: ['真菌感染', '潮濕環境', '免疫力低下'],
      prevention: ['保持乾燥', '個人衛生', '避免共用物品'],
      treatment: '抗真菌藥物、外用藥、手術移除'
    },
    patientInfo: { name: '陳先生', age: 35, gender: '男', height: 172, weight: 75 }
  },
  {
    id: 40,
    name: '劉女士',
    age: 29,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '嘴角有水泡、疼痛',
    symptoms: ['嘴角水泡', '疼痛', '灼熱感'],
    medicalHistory: ['無'],
    lifeHistory: ['最近壓力大、睡眠不足'],
    correctDiagnosis: '唇皰疹',
    disease: '唇皰疹',
    diseaseInfo: {
      description: '唇皰疹是由單純皰疹病毒引起的感染',
      causes: ['病毒感染', '免疫力低下', '壓力', '紫外線'],
      prevention: ['增強免疫力', '避免接觸患者', '防曬'],
      treatment: '抗病毒藥物、外用藥、冷敷'
    },
    patientInfo: { name: '劉女士', age: 29, gender: '女', height: 158, weight: 48 }
  },
  {
    id: 41,
    name: '周先生',
    age: 40,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '肛門瘙癢、疼痛',
    symptoms: ['肛門瘙癢', '疼痛', '便血'],
    medicalHistory: ['無'],
    lifeHistory: ['久坐、飲食辛辣'],
    correctDiagnosis: '痔瘡',
    disease: '痔瘡',
    diseaseInfo: {
      description: '痔瘡是肛門周圍血管曲張形成的腫塊',
      causes: ['久坐', '便秘', '飲食不當', '妊娠'],
      prevention: ['多飲水', '多吃纖維', '定期排便', '避免久坐'],
      treatment: '飲食調理、外用藥、手術治療'
    },
    patientInfo: { name: '周先生', age: 40, gender: '男', height: 175, weight: 80 }
  },
  {
    id: 42,
    name: '吳女士',
    age: 31,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '皮膚乾燥、脫皮',
    symptoms: ['皮膚乾燥', '脫皮', '瘙癢'],
    medicalHistory: ['無'],
    lifeHistory: ['冬季乾燥'],
    correctDiagnosis: '皮膚乾燥症',
    disease: '皮膚乾燥症',
    diseaseInfo: {
      description: '皮膚乾燥症是皮膚缺乏水分和油脂的狀態',
      causes: ['環境乾燥', '缺乏保濕', '年齡增長', '營養不足'],
      prevention: ['定期保濕', '避免過度清潔', '增加水分攝入'],
      treatment: '保濕乳液、潤膚油、補充維生素'
    },
    patientInfo: { name: '吳女士', age: 31, gender: '女', height: 165, weight: 56 }
  },
  {
    id: 43,
    name: '何先生',
    age: 44,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '鼻子不通氣、打鼾',
    symptoms: ['鼻塞', '打鼾', '睡眠不佳'],
    medicalHistory: ['無'],
    lifeHistory: ['鼻炎史'],
    correctDiagnosis: '鼻中隔偏曲',
    disease: '鼻中隔偏曲',
    diseaseInfo: {
      description: '鼻中隔偏曲是鼻中隔向一側彎曲',
      causes: ['先天畸形', '外傷', '生長發育異常'],
      prevention: ['避免鼻部外傷', '定期檢查'],
      treatment: '藥物治療、手術矯正'
    },
    patientInfo: { name: '何先生', age: 44, gender: '男', height: 178, weight: 82 }
  },
  {
    id: 44,
    name: '鄒女士',
    age: 27,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '膝蓋疼痛、腫脹',
    symptoms: ['膝蓋疼痛', '腫脹', '活動受限'],
    medicalHistory: ['無'],
    lifeHistory: ['經常運動、最近跑步過量'],
    correctDiagnosis: '膝蓋滑囊炎',
    disease: '膝蓋滑囊炎',
    diseaseInfo: {
      description: '膝蓋滑囊炎是膝蓋滑囊的炎症',
      causes: ['過度使用', '外傷', '感染'],
      prevention: ['適度運動', '避免過度勞動', '保護膝蓋'],
      treatment: '冰敷、止痛藥、物理治療、穿刺引流'
    },
    patientInfo: { name: '鄒女士', age: 27, gender: '女', height: 163, weight: 54 }
  },
  {
    id: 45,
    name: '馬先生',
    age: 33,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '手指關節腫痛',
    symptoms: ['手指關節腫痛', '活動受限', '紅腫'],
    medicalHistory: ['無'],
    lifeHistory: ['經常做重體力勞動'],
    correctDiagnosis: '腱鞘炎',
    disease: '腱鞘炎',
    diseaseInfo: {
      description: '腱鞘炎是肌腱和腱鞘的炎症',
      causes: ['過度使用', '重複動作', '外傷'],
      prevention: ['避免重複動作', '適度休息', '熱身'],
      treatment: '冰敷、止痛藥、物理治療、固定'
    },
    patientInfo: { name: '馬先生', age: 33, gender: '男', height: 172, weight: 72 }
  },
  {
    id: 46,
    name: '高女士',
    age: 38,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-1-portrait-WBbV45aDMrUaRZEmXH3vDJ.webp',
    mainComplaint: '眼睛紅、分泌物多',
    symptoms: ['眼睛紅', '分泌物多', '眼睛癢'],
    medicalHistory: ['無'],
    lifeHistory: ['最近接觸患者'],
    correctDiagnosis: '結膜炎',
    disease: '結膜炎',
    diseaseInfo: {
      description: '結膜炎是眼睛結膜的炎症',
      causes: ['病毒感染', '細菌感染', '過敏'],
      prevention: ['個人衛生', '避免接觸患者', '避免過敏原'],
      treatment: '眼藥水、抗生素、抗過敏藥'
    },
    patientInfo: { name: '高女士', age: 38, gender: '女', height: 165, weight: 60 }
  },
  {
    id: 47,
    name: '郭先生',
    age: 41,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-2-portrait-XcdATTyvazhfqJkyBuARq5.webp',
    mainComplaint: '嘴巴潰瘍、疼痛',
    symptoms: ['嘴巴潰瘍', '疼痛', '進食困難'],
    medicalHistory: ['無'],
    lifeHistory: ['最近吃了辛辣食物'],
    correctDiagnosis: '口腔潰瘍',
    disease: '口腔潰瘍',
    diseaseInfo: {
      description: '口腔潰瘍是口腔黏膜的破損',
      causes: ['刺激物質', '營養缺乏', '免疫力低下', '病毒感染'],
      prevention: ['避免刺激物', '補充維生素', '增強免疫力'],
      treatment: '外用藥、漱口水、補充維生素'
    },
    patientInfo: { name: '郭先生', age: 41, gender: '男', height: 175, weight: 78 }
  },
  {
    id: 48,
    name: '葉女士',
    age: 30,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-3-portrait-DktMcZ4wStoXGDZV3KHMMG.webp',
    mainComplaint: '腋下有小腫塊、疼痛',
    symptoms: ['腋下腫塊', '疼痛', '紅腫'],
    medicalHistory: ['無'],
    lifeHistory: ['最近刮腋毛'],
    correctDiagnosis: '腋下淋巴結炎',
    disease: '腋下淋巴結炎',
    diseaseInfo: {
      description: '腋下淋巴結炎是淋巴結的炎症',
      causes: ['細菌感染', '病毒感染', '皮膚損傷'],
      prevention: ['皮膚清潔', '避免損傷', '增強免疫力'],
      treatment: '抗生素、消炎藥、溫敷'
    },
    patientInfo: { name: '葉女士', age: 30, gender: '女', height: 160, weight: 52 }
  },
  {
    id: 49,
    name: '石先生',
    age: 36,
    gender: '男',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-4-portrait-PmJkLnQwRsVhYzXnKpWqVz.webp',
    mainComplaint: '耳朵流膿、疼痛',
    symptoms: ['耳朵流膿', '疼痛', '聽力下降'],
    medicalHistory: ['無'],
    lifeHistory: ['最近感冒、挖耳朵'],
    correctDiagnosis: '中耳炎',
    disease: '中耳炎',
    diseaseInfo: {
      description: '中耳炎是中耳的炎症',
      causes: ['細菌感染', '病毒感染', '感冒'],
      prevention: ['避免進水', '及時治療感冒', '避免挖耳朵'],
      treatment: '抗生素、消炎藥、鼓膜穿刺'
    },
    patientInfo: { name: '石先生', age: 36, gender: '男', height: 175, weight: 76 }
  },
  {
    id: 50,
    name: '唐女士',
    age: 25,
    gender: '女',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/patient-5-portrait-TxYzAbCdEfGhIjKlMnOpQr.webp',
    mainComplaint: '喉嚨痛、吞嚥困難',
    symptoms: ['喉嚨痛', '吞嚥困難', '發熱'],
    medicalHistory: ['無'],
    lifeHistory: ['最近天氣變冷'],
    correctDiagnosis: '急性咽炎',
    disease: '急性咽炎',
    diseaseInfo: {
      description: '急性咽炎是咽部的急性炎症',
      causes: ['病毒感染', '細菌感染', '環境刺激'],
      prevention: ['避免刺激物', '增強免疫力', '保暖'],
      treatment: '抗生素、止痛藥、漱口水、多飲水'
    },
    patientInfo: { name: '唐女士', age: 25, gender: '女', height: 158, weight: 48 }
  }
];

const HISTORY_CASES: HistoryCase[] = [
  {
    id: 1,
    patientName: '王先生',
    diagnosis: '急性冠脈綜合徵',
    score: 92,
    date: '2026-04-01',
    accuracyScore: 95,
    efficiencyScore: 88,
    carefulness: 90
  },
  {
    id: 2,
    patientName: '李女士',
    diagnosis: '貧血',
    score: 78,
    date: '2026-03-30',
    accuracyScore: 75,
    efficiencyScore: 82,
    carefulness: 76
  }
];

const DISEASE_DATABASE = [
  {
    name: '高血壓',
    symptoms: ['頭暈', '頭痛', '疲勞'],
    treatment: '藥物治療、生活方式改變'
  },
  {
    name: '糖尿病',
    symptoms: ['口渴', '頻尿', '疲勞'],
    treatment: '藥物治療、飲食控制、運動'
  },
  {
    name: '急性冠脈綜合徵',
    symptoms: ['胸痛', '胸悶', '呼吸困難'],
    treatment: '緊急醫療干預、藥物治療'
  },
  {
    name: '貧血',
    symptoms: ['疲勞', '頭暈', '蒼白'],
    treatment: '補鐵、補充維生素B12'
  },
  {
    name: '急性胃炎',
    symptoms: ['腹痛', '消化不良', '便秘'],
    treatment: '藥物治療、飲食調理'
  },
  {
    name: '接觸性皮炎',
    symptoms: ['皮膚瘙癢', '紅疹', '脫皮'],
    treatment: '避免接觸過敏原、外用藥物'
  },
  {
    name: '骨關節炎',
    symptoms: ['關節疼痛', '活動受限', '腫脹'],
    treatment: '物理治療、藥物治療、運動'
  },
  {
    name: '急性支氣管炎',
    symptoms: ['咳嗽', '喉嚨痛', '發熱'],
    treatment: '止咳藥、祛痰藥、抗生素'
  },
  {
    name: '2型糖尿病',
    symptoms: ['頻尿', '口渴', '體重下降'],
    treatment: '藥物治療、飲食控制、運動'
  },
  {
    name: '偏頭痛',
    symptoms: ['頭痛', '噁心', '視物模糊'],
    treatment: '止痛藥、預防性藥物、生活方式改變'
  },
  {
    name: '失眠症',
    symptoms: ['失眠', '疲勞', '注意力不集中'],
    treatment: '認知行為治療、睡眠衛生改善、藥物治療'
  },
  {
    name: '急性腸胃炎',
    symptoms: ['腹瀉', '腹痛', '食慾不振'],
    treatment: '補液、止瀉藥、抗生素、飲食調理'
  },
  {
    name: '尿路感染',
    symptoms: ['尿頻', '尿急', '尿痛'],
    treatment: '抗生素、多飲水、止痛藥'
  },
  {
    name: '乳腺增生',
    symptoms: ['乳房脹痛', '乳房腫塊', '乳頭分泌物'],
    treatment: '觀察、止痛藥、激素治療'
  },
  {
    name: '良性前列腺增生',
    symptoms: ['排尿困難', '尿流弱', '夜間尿頻'],
    treatment: '藥物治療、手術治療'
  },
  {
    name: '甲狀腺功能減退',
    symptoms: ['甲狀腺腫大', '疲勞', '體重增加'],
    treatment: '甲狀腺激素替代療法'
  },
  {
    name: '腰椎間盤突出',
    symptoms: ['腰痛', '下肢放射痛', '活動受限'],
    treatment: '物理治療、止痛藥、肌肉鬆弛劑、手術'
  },
  {
    name: '月經不調',
    symptoms: ['月經不規律', '痛經', '腹脹'],
    treatment: '激素治療、中醫調理、治療原發病'
  },
  {
    name: '濕疹',
    symptoms: ['皮膚瘙癢', '皮疹', '乾燥'],
    treatment: '外用皮質激素、保濕、抗組胺藥'
  },
  {
    name: '更年期綜合徵',
    symptoms: ['潮熱', '盜汗', '情緒波動'],
    treatment: '激素替代療法、藥物治療、生活方式改變'
  },
  {
    name: '類風濕關節炎',
    symptoms: ['關節腫脹', '關節疼痛', '晨僵'],
    treatment: '免疫抑制劑、生物製劑、物理治療'
  },
  {
    name: '哮喘',
    symptoms: ['喘息', '胸悶', '咳嗽'],
    treatment: '吸入皮質激素、支氣管擴張劑、避免觸發因素'
  },
  {
    name: '肌肉勞損',
    symptoms: ['肌肉酸痛', '無力', '疲勞'],
    treatment: '休息、冰敷、止痛藥、物理治療'
  },
  {
    name: '梅尼埃病',
    symptoms: ['頭暈', '耳鳴', '聽力下降'],
    treatment: '利尿藥、前庭抑制劑、手術治療'
  },
  {
    name: '食管癌',
    symptoms: ['吞嚥困難', '胸痛', '食慾不振'],
    treatment: '手術、化療、放療、靶向治療'
  },
  {
    name: '腸易激綜合徵',
    symptoms: ['腹脹', '便秘', '腹痛'],
    treatment: '飲食調理、止痛藥、益生菌、心理治療'
  },
  {
    name: '青光眼',
    symptoms: ['視力模糊', '眼痛', '眼紅'],
    treatment: '降眼壓藥、激光治療、手術治療'
  },
  {
    name: '脊髓炎',
    symptoms: ['肌肉無力', '下肢癱瘓', '感覺異常'],
    treatment: '皮質激素、免疫抑制劑、物理治療'
  },
  {
    name: '肝硬化',
    symptoms: ['肝區疼痛', '黃疸', '腹脹'],
    treatment: '藥物治療、飲食調理、併發症管理'
  },
  {
    name: '乳腺纖維腺瘤',
    symptoms: ['乳房腫塊', '乳房疼痛', '乳頭分泌物'],
    treatment: '觀察、手術切除'
  },
  {
    name: '慢性阻塞性肺疾病',
    symptoms: ['呼吸困難', '咳嗽', '胸痛'],
    treatment: '支氣管擴張劑、皮質激素、氧療'
  },
  {
    name: '焦慮症',
    symptoms: ['焦慮', '恐慌發作', '心悸'],
    treatment: '心理治療、抗焦慮藥、認知行為治療'
  },
  {
    name: '痛風',
    symptoms: ['痛風發作', '腳踝腫脹', '關節疼痛'],
    treatment: '止痛藥、降尿酸藥、飲食控制'
  },
  {
    name: '營養缺乏症',
    symptoms: ['皮膚瘙癢', '脫髮', '皮膚乾燥'],
    treatment: '營養補充、飲食調理、治療原發病'
  },
  {
    name: '阿爾茨海默病',
    symptoms: ['記憶力下降', '認知障礙', '定向障礙'],
    treatment: '認知增強藥、行為治療、護理支持'
  },
  {
    name: '結腸癌',
    symptoms: ['排便習慣改變', '便血', '腹痛'],
    treatment: '手術、化療、放療、靶向治療'
  }
];

export default function Office({ playerInfo, onSelectCase }: { playerInfo: any; onSelectCase: (caseData: Patient) => void }) {
  const [searchSymptom, setSearchSymptom] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DISEASE_DATABASE>([]);
  const [selectedDisease, setSelectedDisease] = useState<ExtendedDiseaseInfo | null>(null);
  const [diseaseDetailOpen, setDiseaseDetailOpen] = useState(false);
  const [diagnosedPatientIds, setDiagnosedPatientIds] = useState<number[]>([]);

  // 根據地區篩選患者
  const getFilteredPatients = () => {
    if (!playerInfo?.workArea) return PATIENTS;
    
    const areaPatientMap: { [key: string]: number[] } = {
      '台北': [1, 2, 3, 6, 7],
      '新竹': [2, 3, 4, 8, 9],
      '台中': [3, 4, 5, 10, 11],
      '台南': [4, 5, 1, 12, 13],
      '高雄': [5, 1, 2, 14, 15]
    };
    
    const patientIds = areaPatientMap[playerInfo.workArea] || [1, 2, 3];
    const filteredPatients = PATIENTS.filter(p => patientIds.includes(p.id));
    
    // 過濾掉已診斷的患者
    return filteredPatients.filter(p => !diagnosedPatientIds.includes(p.id));
  };
  
  const handlePatientDiagnosed = (patientId: number) => {
    setDiagnosedPatientIds([...diagnosedPatientIds, patientId]);
  };

  const handleSymptomSearch = () => {
    if (searchSymptom.trim()) {
      const results = DISEASE_DATABASE.filter(disease =>
        disease.symptoms.some(s => s.includes(searchSymptom)) ||
        disease.name.includes(searchSymptom)
      );
      setSearchResults(results);
    }
  };

  const playerStats: PlayerStats = {
    diagnosisAccuracy: 85,
    historyEfficiency: 78,
    carefulness: 82,
    totalCases: 12,
    successRate: 75
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663103090575/VE9bd7KNWY4ETQm7k5sLxT/雲澤醫院背景拷貝_1aec6581.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">醫生辦公室</h1>
          <p className="text-gray-600">歡迎回來，{playerInfo?.name}！</p>
        </div>

        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-150px)]">
          {/* 左側：待診患者 */}
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">待診患者</h2>
            <div className="space-y-3">
              {getFilteredPatients().map(patient => (
                <Card
                  key={patient.id}
                  className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => onSelectCase(patient)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.image}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.age}歲 {patient.gender}</p>
                      <p className="text-xs text-gray-500 mt-1">{patient.mainComplaint}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 中間：歷史病例 + 醫療資料庫 */}
          <div className="col-span-2 bg-white rounded-lg shadow-lg p-6 overflow-hidden flex flex-col">
            <Tabs defaultValue="history" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="history">歷史病例</TabsTrigger>
                <TabsTrigger value="database">醫療資料庫</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {HISTORY_CASES.map(case_ => (
                    <Card key={case_.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{case_.patientName}</p>
                          <p className="text-sm text-gray-600">{case_.diagnosis}</p>
                          <p className="text-xs text-gray-500 mt-1">{case_.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{case_.score}</p>
                          <p className="text-xs text-gray-600">總分</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2 rounded">
                          <p className="text-gray-600">診斷精準度</p>
                          <p className="font-bold text-blue-600">{case_.accuracyScore}%</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <p className="text-gray-600">詢問效率</p>
                          <p className="font-bold text-green-600">{case_.efficiencyScore}%</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <p className="text-gray-600">檢查仔細度</p>
                          <p className="font-bold text-purple-600">{case_.carefulness}%</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="database" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex flex-col gap-3 h-full min-h-0">
                  <div className="flex gap-2 flex-shrink-0">
                    <Input
                      placeholder="搜索症狀或疾病..."
                      value={searchSymptom}
                      onChange={(e) => setSearchSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSymptomSearch()}
                    />
                    <Button onClick={handleSymptomSearch} className="bg-blue-600 hover:bg-blue-700">
                      搜索
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 border rounded-lg min-h-0">
                    <div className="space-y-3 pr-4 p-4">
                      {(searchResults.length > 0 ? searchResults : DISEASE_DATABASE).map((disease, idx) => (
                        <Card 
                          key={idx} 
                          className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedDisease(disease as any);
                            setDiseaseDetailOpen(true);
                          }}
                        >
                          <p className="font-semibold text-gray-800 mb-2">{disease.name}</p>
                          <div className="text-xs space-y-1">
                            <p className="text-gray-600"><strong>常見症狀：</strong> {disease.symptoms.join('、')}</p>
                            <p className="text-gray-600"><strong>治療方式：</strong> {disease.treatment}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右側：玩家個人資料 */}
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">個人資料</h2>

            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">診斷精準度</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-blue-600">{playerStats.diagnosisAccuracy}%</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <p className="text-sm text-gray-600 mb-1">詢問效率</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-green-600">{playerStats.historyEfficiency}%</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">檢查仔細程度</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-purple-600">{playerStats.carefulness}%</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <p className="text-sm text-gray-600 mb-1">診療案例</p>
                <p className="text-3xl font-bold text-orange-600">{playerStats.totalCases}</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <p className="text-sm text-gray-600 mb-1">成功率</p>
                <p className="text-3xl font-bold text-red-600">{playerStats.successRate}%</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 疾病詳情 Modal */}
      <DiseaseDetailModal
        disease={selectedDisease}
        open={diseaseDetailOpen}
        onOpenChange={setDiseaseDetailOpen}
      />
    </div>
  );
}

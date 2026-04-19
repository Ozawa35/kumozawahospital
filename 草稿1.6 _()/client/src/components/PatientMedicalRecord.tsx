export default function PatientMedicalRecord({ caseData }: any) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-3">患者病歷</h3>
      </div>
      
      {/* 基本信息 */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <h4 className="font-semibold text-sm mb-2">基本信息</h4>
        <div className="space-y-1 text-sm">
          <p><strong>姓名：</strong> {caseData?.patientInfo?.name || '患者'}</p>
          <p><strong>年齡：</strong> {caseData?.patientInfo?.age || '未知'}歲</p>
          <p><strong>性別：</strong> {caseData?.patientInfo?.gender || '未知'}</p>
          <p><strong>身高：</strong> {caseData?.patientInfo?.height || '未知'} cm</p>
          <p><strong>體重：</strong> {caseData?.patientInfo?.weight || '未知'} kg</p>
        </div>
      </div>
      
      {/* 主訴症狀 */}
      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
        <h4 className="font-semibold text-sm mb-2">主訴症狀</h4>
        <div className="space-y-1 text-sm">
          {caseData?.symptoms && caseData.symptoms.length > 0 ? (
            caseData.symptoms.map((symptom: any, idx: any) => (
              <p key={idx}>• {symptom}</p>
            ))
          ) : (
            <p className="text-gray-500">無症狀記錄</p>
          )}
        </div>
      </div>
      
      {/* 病史 */}
      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
        <h4 className="font-semibold text-sm mb-2">病史</h4>
        <div className="space-y-1 text-sm">
          {caseData?.medicalHistory && caseData.medicalHistory.length > 0 ? (
            caseData.medicalHistory.map((history: any, idx: any) => (
              <p key={idx}>• {history}</p>
            ))
          ) : (
            <p className="text-gray-500">無病史記錄</p>
          )}
        </div>
      </div>
      
      {/* 生活史 */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <h4 className="font-semibold text-sm mb-2">生活史</h4>
        <div className="space-y-1 text-sm">
          {caseData?.lifeHistory && caseData.lifeHistory.length > 0 ? (
            caseData.lifeHistory.map((history: any, idx: any) => (
              <p key={idx}>• {history}</p>
            ))
          ) : (
            <p className="text-gray-500">無生活史記錄</p>
          )}
        </div>
      </div>
      

    </div>
  );
}

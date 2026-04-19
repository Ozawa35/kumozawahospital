import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import type { ExtendedDiseaseInfo } from '@/types/disease';

interface DiseaseDetailModalProps {
  disease: ExtendedDiseaseInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DiseaseDetailModal({ disease, open, onOpenChange }: DiseaseDetailModalProps) {
  if (!disease) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">{disease.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 p-4">
            {/* 疾病描述 */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">疾病描述</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{disease.description}</p>
            </Card>

            {/* 常見症狀 */}
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-semibold text-gray-800 mb-2">常見症狀</h3>
              <div className="flex flex-wrap gap-2">
                {disease.symptoms.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </Card>

            {/* 好發人群 */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-2">好發人群</h3>
              <p className="text-gray-700 text-sm">{disease.affectedPopulation}</p>
            </Card>

            {/* 病因與風險因素 */}
            <Card className="p-4 bg-orange-50 border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-2">病因與風險因素</h3>
              <p className="text-gray-700 text-sm">{disease.causesAndRiskFactors}</p>
            </Card>

            {/* 初步處置建議 */}
            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <h3 className="font-semibold text-gray-800 mb-2">初步處置建議</h3>
              <p className="text-gray-700 text-sm mb-3">{disease.initialTreatment}</p>
              <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                <p className="text-xs text-gray-600 font-semibold mb-1">為什麼要做這些處置：</p>
                <p className="text-sm text-gray-700">{disease.treatmentReason}</p>
              </div>
            </Card>

            {/* 什麼時候應該就診 */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-semibold text-gray-800 mb-2">什麼時候應該就診</h3>
              <p className="text-gray-700 text-sm">{disease.whenToSeek}</p>
            </Card>

            {/* 全球普及率 */}
            <Card className="p-4 bg-cyan-50 border-cyan-200">
              <h3 className="font-semibold text-gray-800 mb-2">全球普及率</h3>
              <p className="text-gray-700 text-sm">{disease.prevalence}</p>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

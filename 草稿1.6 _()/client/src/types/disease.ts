export interface DiseaseInfo {
  name: string;
  symptoms: string[];
  treatment: string;
  description?: string;
  affectedPopulation?: string;
  initialTreatment?: string;
  treatmentReason?: string;
  whenToSeek?: string;
  causesAndRiskFactors?: string;
  prevalence?: string;
}

export interface ExtendedDiseaseInfo extends DiseaseInfo {
  description: string;
  affectedPopulation: string;
  initialTreatment: string;
  treatmentReason: string;
  whenToSeek: string;
  causesAndRiskFactors: string;
  prevalence: string;
}

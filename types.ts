
export enum Category {
  SYSTEMS_THINKING = "Systems Thinking (FMS/IMS/PMS)",
  GOOGLE_SHEETS = "Advanced Google Sheets",
  APPS_SCRIPT = "Google Apps Script + Web Apps",
  APPSHEET = "AppSheet",
  INTEGRATION = "Integration & Data Model"
}

export interface Question {
  id: number;
  category: Category;
  text: string;
  options: {
    label: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface AssessmentState {
  userInfo: UserInfo | null;
  answers: Record<number, string>;
  isSubmitted: boolean;
  currentQuestionIndex: number;
}

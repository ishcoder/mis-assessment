
import { Category, Question } from './types';

export const QUESTIONS: Question[] = [
  // A) Systems Thinking
  {
    id: 1,
    category: Category.SYSTEMS_THINKING,
    text: "In your context, FMS is best defined as:",
    options: [
      { label: "A", text: "A daily sales report format" },
      { label: "B", text: "A flow-control system that tracks stages, owners, TAT, handoffs, and escalations" },
      { label: "C", text: "An Excel template for follow-ups" },
      { label: "D", text: "A dashboard with charts only" }
    ],
    correctAnswer: "B"
  },
  {
    id: 2,
    category: Category.SYSTEMS_THINKING,
    text: "The most “system-builder” approach to convert a messy process into a measurable system is:",
    options: [
      { label: "A", text: "Start building a dashboard immediately" },
      { label: "B", text: "First map the process steps → define owners + inputs/outputs + control points → then design data structure" },
      { label: "C", text: "Make a KPI list and assign targets" },
      { label: "D", text: "Create a Google Form and start collecting data" }
    ],
    correctAnswer: "B"
  },
  {
    id: 3,
    category: Category.SYSTEMS_THINKING,
    text: "Which is a control mechanism in an FMS (not just reporting)?",
    options: [
      { label: "A", text: "Monthly summary of disbursals" },
      { label: "B", text: "“Follow-up due today” list" },
      { label: "C", text: "Auto-alert when a case crosses TAT + escalation to TL/Manager + reason capture" },
      { label: "D", text: "A pivot table by branch" }
    ],
    correctAnswer: "C"
  },
  // B) Advanced Google Sheets
  {
    id: 4,
    category: Category.GOOGLE_SHEETS,
    text: "In Google Sheets, a spill error like “Array result was not expanded because it would overwrite data” is usually caused by:",
    options: [
      { label: "A", text: "Formula syntax error" },
      { label: "B", text: "Cells below/right of the formula are not empty" },
      { label: "C", text: "Sheet protection" },
      { label: "D", text: "Internet connectivity" }
    ],
    correctAnswer: "B"
  },
  {
    id: 5,
    category: Category.GOOGLE_SHEETS,
    text: "Best practice for performance when building a large system sheet (50k+ rows) is:",
    options: [
      { label: "A", text: "Use full-column ranges everywhere (A:A) in many formulas" },
      { label: "B", text: "Prefer bounded ranges, helper columns, and avoid volatile recalcs" },
      { label: "C", text: "Use more conditional formatting rules" },
      { label: "D", text: "Use merged cells for headings" }
    ],
    correctAnswer: "B"
  },
  {
    id: 6,
    category: Category.GOOGLE_SHEETS,
    text: "Which is the correct use-case for QUERY() in Sheets?",
    options: [
      { label: "A", text: "Formatting cells based on conditions" },
      { label: "B", text: "SQL-like filtering/aggregation over tabular ranges (select/where/group by)" },
      { label: "C", text: "Creating a pivot chart" },
      { label: "D", text: "Converting text to numbers" }
    ],
    correctAnswer: "B"
  },
  {
    id: 7,
    category: Category.GOOGLE_SHEETS,
    text: "ARRAYFORMULA() is most useful when:",
    options: [
      { label: "A", text: "You want manual row-wise formulas for control" },
      { label: "B", text: "You want one formula to auto-fill logic for all rows dynamically" },
      { label: "C", text: "You need a chart" },
      { label: "D", text: "You want to protect columns" }
    ],
    correctAnswer: "B"
  },
  {
    id: 8,
    category: Category.GOOGLE_SHEETS,
    text: "For joining data from multiple columns into one output table in a single formula, the correct structure is:",
    options: [
      { label: "A", text: "(A:A + B:B)" },
      { label: "B", text: "{A:A, B:B, C:C}" },
      { label: "C", text: "[A:A | B:B]" },
      { label: "D", text: "A:A => B:B" }
    ],
    correctAnswer: "B"
  },
  {
    id: 9,
    category: Category.GOOGLE_SHEETS,
    text: "Best approach to make a tracker “auditable” in Sheets without manual mistakes is:",
    options: [
      { label: "A", text: "Allow free-text edits everywhere" },
      { label: "B", text: "Use data validation + protected ranges + timestamp/user logging via Apps Script" },
      { label: "C", text: "Use only conditional formatting" },
      { label: "D", text: "Store everything in one column" }
    ],
    correctAnswer: "B"
  },
  {
    id: 10,
    category: Category.GOOGLE_SHEETS,
    text: "Which is the most reliable way to match phone numbers when formats vary (+91, spaces, leading 0)?",
    options: [
      { label: "A", text: "Compare raw strings as-is" },
      { label: "B", text: "Convert to uppercase" },
      { label: "C", text: "Keep only digits and compare last 10 digits consistently" },
      { label: "D", text: "Use VLOOKUP with approximate match" }
    ],
    correctAnswer: "C"
  },
  {
    id: 11,
    category: Category.GOOGLE_SHEETS,
    text: "A common formula-design anti-pattern in system sheets is:",
    options: [
      { label: "A", text: "Using helper columns for clarity" },
      { label: "B", text: "Making one huge nested formula that nobody can debug" },
      { label: "C", text: "Using named ranges" },
      { label: "D", text: "Using a standardized header row" }
    ],
    correctAnswer: "B"
  },
  // C) Google Apps Script + Web Apps
  {
    id: 12,
    category: Category.APPS_SCRIPT,
    text: "The biggest performance gain in Apps Script when updating sheets is usually from:",
    options: [
      { label: "A", text: "Using more Logger.log()" },
      { label: "B", text: "Minimizing API calls: batch getValues() / process in memory / batch setValues()" },
      { label: "C", text: "Adding more triggers" },
      { label: "D", text: "Using multiple spreadsheets" }
    ],
    correctAnswer: "B"
  },
  {
    id: 13,
    category: Category.APPS_SCRIPT,
    text: "Which trigger runs with the user’s permissions without needing installable trigger setup?",
    options: [
      { label: "A", text: "Simple onEdit(e)" },
      { label: "B", text: "Time-driven trigger" },
      { label: "C", text: "Web app trigger" },
      { label: "D", text: "API trigger" }
    ],
    correctAnswer: "A"
  },
  {
    id: 14,
    category: Category.APPS_SCRIPT,
    text: "Best practice to avoid race conditions when multiple users submit forms/edits simultaneously is:",
    options: [
      { label: "A", text: "Add more columns" },
      { label: "B", text: "Use LockService to control critical sections" },
      { label: "C", text: "Use conditional formatting" },
      { label: "D", text: "Increase spreadsheet size" }
    ],
    correctAnswer: "B"
  },
  {
    id: 15,
    category: Category.APPS_SCRIPT,
    text: "In a Web App using Apps Script, the handler functions are typically:",
    options: [
      { label: "A", text: "start() and stop()" },
      { label: "B", text: "doGet(e) and doPost(e)" },
      { label: "C", text: "open() and close()" },
      { label: "D", text: "init() and render()" }
    ],
    correctAnswer: "B"
  },
  {
    id: 16,
    category: Category.APPS_SCRIPT,
    text: "Where would you store configurable parameters (like sheet names, email IDs, thresholds) to avoid hardcoding?",
    options: [
      { label: "A", text: "In comments" },
      { label: "B", text: "In PropertiesService (Script/User/Document properties) and/or a SETTINGS sheet" },
      { label: "C", text: "Inside formulas only" },
      { label: "D", text: "In a separate Google Doc" }
    ],
    correctAnswer: "B"
  },
  {
    id: 17,
    category: Category.APPS_SCRIPT,
    text: "If you need to call an external API from Apps Script, the standard service is:",
    options: [
      { label: "A", text: "DriveApp" },
      { label: "B", text: "UrlFetchApp" },
      { label: "C", text: "CalendarApp" },
      { label: "D", text: "GmailApp" }
    ],
    correctAnswer: "B"
  },
  {
    id: 18,
    category: Category.APPS_SCRIPT,
    text: "To log every status change (old→new) in a workflow tracker, the most robust approach is:",
    options: [
      { label: "A", text: "Overwrite the status cell only" },
      { label: "B", text: "Keep a separate HISTORY_LOG capturing timestamp, user, record ID, old status, new status, remark" },
      { label: "C", text: "Use conditional formatting colors as history" },
      { label: "D", text: "Take daily screenshots" }
    ],
    correctAnswer: "B"
  },
  {
    id: 19,
    category: Category.APPS_SCRIPT,
    text: "A “system must work even if people don’t follow manually” is best achieved by:",
    options: [
      { label: "A", text: "Trusting users to update sheets daily" },
      { label: "B", text: "Automations: validations, required fields, controlled inputs, auto-alerts, and exception queues" },
      { label: "C", text: "Making a prettier sheet" },
      { label: "D", text: "Giving more training only" }
    ],
    correctAnswer: "B"
  },
  // D) AppSheet
  {
    id: 20,
    category: Category.APPSHEET,
    text: "The most important concept to prevent data leakage between teams/branches in AppSheet is:",
    options: [
      { label: "A", text: "Colors and themes" },
      { label: "B", text: "Security Filters (row-level security)" },
      { label: "C", text: "Slices only" },
      { label: "D", text: "Virtual columns only" }
    ],
    correctAnswer: "B"
  },
  {
    id: 21,
    category: Category.APPSHEET,
    text: "In AppSheet, a “Slice” is mainly used to:",
    options: [
      { label: "A", text: "Increase sheet size" },
      { label: "B", text: "Create a filtered view/subset of data for a specific purpose" },
      { label: "C", text: "Replace the database" },
      { label: "D", text: "Send emails" }
    ],
    correctAnswer: "B"
  },
  {
    id: 22,
    category: Category.APPSHEET,
    text: "Best way to ensure field team can’t enter incomplete applications is:",
    options: [
      { label: "A", text: "Trust them" },
      { label: "B", text: "Required fields + Valid_If rules + conditional actions on status transitions" },
      { label: "C", text: "One long form with no validation" },
      { label: "D", text: "Allow free text everywhere" }
    ],
    correctAnswer: "B"
  },
  {
    id: 23,
    category: Category.APPSHEET,
    text: "In AppSheet automation, the modern pattern is:",
    options: [
      { label: "A", text: "Manual reminders on WhatsApp" },
      { label: "B", text: "Bots/Events/Processes (automation workflows)" },
      { label: "C", text: "Printing reports daily" },
      { label: "D", text: "Multiple copies of the same app" }
    ],
    correctAnswer: "B"
  },
  // E) Integration & Data Model
  {
    id: 24,
    category: Category.INTEGRATION,
    text: "“Integrate FMS/IMS/PMS into a single management view” usually requires:",
    options: [
      { label: "A", text: "Copy-paste between sheets daily" },
      { label: "B", text: "A consistent unique ID + standardized statuses + a unified data model" },
      { label: "C", text: "More colors" },
      { label: "D", text: "Separate dashboards for each department only" }
    ],
    correctAnswer: "B"
  }
];

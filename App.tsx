import React, { useMemo, useState } from 'react';
import { QUESTIONS } from './constants';
import { AssessmentState } from './types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

type ChartRow = { name: string; score: number; label: string };

type ScoreResults = {
  totalScore: number;
  totalQuestions: number;
  categoryScores: Record<string, { correct: number; total: number }>;
  chartData: ChartRow[];
};

type CategoryBreakdown = {
  shortName: string;
  fullName: string;
  correct: number;
  total: number;
  percent: number;
};

function shortCategoryName(full: string) {
  return full.split(' (')[0];
}

const COACHING_BY_SHORT: Record<string, { strengths: string[]; improve: string[] }> = {
  'Systems Thinking': {
    strengths: [
      'Understands process mapping, ownership, and control points (TAT/escalations).',
      'Thinks in workflows, not just reports and dashboards.'
    ],
    improve: [
      'Practice defining a clean data model: unique IDs, statuses, SLA, exception queues.',
      'Design control mechanisms (auto-alerts + reason capture), not only visibility.'
    ]
  },
  'Advanced Google Sheets': {
    strengths: [
      'Comfortable with array logic (FILTER/QUERY/ARRAYFORMULA) and structured tables.',
      'Understands reliability patterns: validation, protections, audit logs.'
    ],
    improve: [
      'Optimize for scale: bounded ranges, helper columns, avoid giant nested formulas.',
      'Standardize data cleaning (e.g., phone normalization) to prevent silent mismatches.'
    ]
  },
  'Google Apps Script + Web Apps': {
    strengths: [
      'Knows performance basics: batch reads/writes, process in memory.',
      'Understands workflow logging patterns (history log, status change tracking).' 
    ],
    improve: [
      'Get sharper on concurrency & safety: LockService, idempotency, retries.',
      'Move configs to PropertiesService/SETTINGS sheet and reduce hardcoding.'
    ]
  },
  'AppSheet': {
    strengths: [
      'Understands core app concepts: slices, automations/bots, controlled transitions.',
      'Recognizes row-level security as a first-class requirement.'
    ],
    improve: [
      'Go deeper on security filters + role-based UX (branch/team isolation).',
      'Design status-driven validations/actions to prevent incomplete submissions.'
    ]
  },
  'Integration & Data Model': {
    strengths: [
      'Understands the importance of unique IDs and standardized statuses.',
      'Thinks about unified views across systems (FMS/IMS/PMS) using a single model.'
    ],
    improve: [
      'Learn event-driven pipelines (source of truth, sync rules, conflict handling).',
      'Define canonical entities + mapping tables to avoid copy-paste integration.'
    ]
  }
};

function generateAutoEvaluation(args: {
  candidateName: string;
  scorePercentage: number;
  breakdown: CategoryBreakdown[];
}) {
  const { candidateName, scorePercentage, breakdown } = args;

  const sorted = [...breakdown].sort((a, b) => b.percent - a.percent);
  const strengths = sorted.slice(0, 2);
  const gaps = [...breakdown].sort((a, b) => a.percent - b.percent).slice(0, 2);

  const level =
    scorePercentage >= 85
      ? 'Strong'
      : scorePercentage >= 75
        ? 'Good'
        : scorePercentage >= 60
          ? 'Developing'
          : 'Not Ready';

  const recommendation = scorePercentage >= 75 ? 'Hire' : 'Train Further';

  const strengthsLine = strengths
    .map((c) => `${c.shortName} (${c.correct}/${c.total})`)
    .join(', ');

  const gapBullets = gaps
    .map((c) => {
      const tips = COACHING_BY_SHORT[c.shortName]?.improve ?? ['Focus on fundamentals and real projects.'];
      return `• ${c.shortName}: ${tips[0]}`;
    })
    .join('\n');

  // Keep it concise (~120-150 words)
  return (
    `${candidateName}: ${level} fit for MIS Systems + Automation. ` +
    `Overall score ${scorePercentage}%. Strength areas: ${strengthsLine}.\n\n` +
    `Biggest gaps to close next (practical, not theory):\n${gapBullets}\n\n` +
    `Recommendation: ${recommendation} (threshold 75%).`
  );
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [state, setState] = useState<AssessmentState>({
    userInfo: null,
    answers: {},
    isSubmitted: false,
    currentQuestionIndex: 0
  });

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[state.currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(state.answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const scoreResults: ScoreResults | null = useMemo(() => {
    if (!state.isSubmitted) return null;

    let totalScore = 0;
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    QUESTIONS.forEach((q) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total += 1;
      if (state.answers[q.id] === q.correctAnswer) {
        totalScore += 1;
        categoryScores[q.category].correct += 1;
      }
    });

    const chartData: ChartRow[] = Object.entries(categoryScores).map(([name, stats]) => ({
      name: shortCategoryName(name),
      score: Math.round((stats.correct / stats.total) * 100),
      label: `${stats.correct}/${stats.total}`
    }));

    return { totalScore, totalQuestions, categoryScores, chartData };
  }, [state.isSubmitted, state.answers]);

  const breakdown: CategoryBreakdown[] = useMemo(() => {
    if (!scoreResults) return [];
    return Object.entries(scoreResults.categoryScores).map(([fullName, stats]) => {
      const percent = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
      return {
        shortName: shortCategoryName(fullName),
        fullName,
        correct: stats.correct,
        total: stats.total,
        percent
      };
    });
  }, [scoreResults]);

  const autoEvaluation = useMemo(() => {
    if (!scoreResults || !state.userInfo) return null;
    const scorePercentage = Math.round((scoreResults.totalScore / scoreResults.totalQuestions) * 100);
    return generateAutoEvaluation({
      candidateName: state.userInfo.name,
      scorePercentage,
      breakdown
    });
  }, [scoreResults, state.userInfo, breakdown]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && userEmail) {
      setState((prev) => ({ ...prev, userInfo: { name: userName, email: userEmail } }));
    }
  };

  const handleOptionSelect = (optionLabel: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: optionLabel }
    }));
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < totalQuestions - 1) {
      setState((prev) => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    }
  };

  const handlePrev = () => {
    if (state.currentQuestionIndex > 0) {
      setState((prev) => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const handleSubmit = () => {
    setState((prev) => ({ ...prev, isSubmitted: true }));
  };

  const buildSummaryText = () => {
    if (!scoreResults || !state.userInfo) return '';

    const scorePercentage = Math.round((scoreResults.totalScore / scoreResults.totalQuestions) * 100);
    const categorySummary = breakdown
      .sort((a, b) => b.percent - a.percent)
      .map((c) => `${c.shortName}: ${c.correct}/${c.total} (${c.percent}%)`)
      .join('\n');

    const now = new Date();
    const ts = now.toISOString();

    return [
      'MIS Executive Assessment — Summary',
      `Candidate: ${state.userInfo.name}`,
      `Email: ${state.userInfo.email}`,
      `Timestamp: ${ts}`,
      `Overall: ${scoreResults.totalScore}/${scoreResults.totalQuestions} (${scorePercentage}%)`,
      '',
      'Category Breakdown:',
      categorySummary,
      '',
      'Evaluation:',
      autoEvaluation ?? ''
    ].join('\n');
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopyStatus('Copied.');
      setTimeout(() => setCopyStatus(null), 1500);
    } catch {
      setCopyStatus('Copy failed (browser blocked).');
      setTimeout(() => setCopyStatus(null), 2500);
    }
  };

  const downloadSummary = () => {
    downloadTextFile('mis-assessment-summary.txt', buildSummaryText());
  };

  if (!state.userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V21m0-11V3m0 0a11.95 11.95 0 01-8.618-3.04M12 21.48a11.95 11.95 0 008.618-3.04M12 3a11.95 11.95 0 008.618 3.04"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">MIS Executive Assessment</h1>
            <p className="text-slate-500 mt-2">Systems + Automation MCQ Evaluation</p>
          </div>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="john@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Assessment
            </button>
          </form>
          <p className="text-xs text-center text-slate-400 mt-6">24 Questions • ~15 Minutes • Immediate Results</p>
        </div>
      </div>
    );
  }

  if (state.isSubmitted && scoreResults) {
    const scorePercentage = Math.round((scoreResults.totalScore / scoreResults.totalQuestions) * 100);

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Assessment Results</h1>
                  <p className="text-slate-500 mt-1">
                    Candidate: <span className="font-semibold text-slate-900">{state.userInfo.name}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Overall Score</p>
                    <p className="text-4xl font-extrabold text-blue-600">{scorePercentage}%</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Correct</p>
                    <p className="text-4xl font-extrabold text-slate-900">
                      {scoreResults.totalScore}/{scoreResults.totalQuestions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={copySummary}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold shadow hover:bg-black transition"
                >
                  Copy Summary
                </button>
                <button
                  onClick={downloadSummary}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold shadow-sm hover:bg-slate-50 transition"
                >
                  Download Summary
                </button>
                {copyStatus && <span className="text-sm font-semibold text-slate-500 self-center">{copyStatus}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Performance by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreResults.chartData} layout="vertical" margin={{ left: -10, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="score"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                      label={{ position: 'right', formatter: (val: number) => `${val}%` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Evaluation</h3>
              <p className="text-xs text-slate-400 mb-4">Rule-based evaluation (no paid AI API required).</p>
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{autoEvaluation}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900">Detailed Review</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {QUESTIONS.map((q, idx) => {
                const isCorrect = state.answers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                            {shortCategoryName(q.category)}
                          </span>
                          {!isCorrect && <span className="text-xs font-bold text-red-600 uppercase">Incorrect</span>}
                        </div>
                        <p className="text-slate-900 font-medium">{q.text}</p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {q.options.map((opt) => (
                            <div
                              key={opt.label}
                              className={`p-2 rounded-lg border ${
                                opt.label === q.correctAnswer
                                  ? 'bg-green-50 border-green-200 text-green-800 font-medium'
                                  : opt.label === state.answers[q.id]
                                    ? 'bg-red-50 border-red-200 text-red-800'
                                    : 'border-slate-100 text-slate-500'
                              }`}
                            >
                              <span className="font-bold mr-2">{opt.label}.</span> {opt.text}
                              {opt.label === q.correctAnswer && <span className="ml-2 text-xs">✓ Correct</span>}
                              {opt.label === state.answers[q.id] && opt.label !== q.correctAnswer && (
                                <span className="ml-2 text-xs">✗ Your Answer</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">M</div>
            <h2 className="font-bold text-slate-800 hidden md:block">MIS Executive Assessment</h2>
          </div>
          <div className="flex-grow max-w-xs mx-4">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Progress</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                {answeredCount} of {totalQuestions} Answered
              </span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={answeredCount < totalQuestions}
            className={`px-4 py-1.5 rounded-lg font-bold text-sm transition ${
              answeredCount === totalQuestions
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 min-h-[400px] flex flex-col">
            <div className="mb-6">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">
                {currentQuestion.category}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                {state.currentQuestionIndex + 1}. {currentQuestion.text}
              </h3>
            </div>

            <div className="space-y-3 flex-grow">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleOptionSelect(option.label)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                    state.answers[currentQuestion.id] === option.label
                      ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-100'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition ${
                      state.answers[currentQuestion.id] === option.label
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </div>
                  <span
                    className={`text-base md:text-lg ${
                      state.answers[currentQuestion.id] === option.label ? 'text-blue-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    {option.text}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={handlePrev}
                disabled={state.currentQuestionIndex === 0}
                className={`flex items-center gap-2 font-bold transition px-4 py-2 rounded-lg ${
                  state.currentQuestionIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="hidden sm:block text-slate-400 font-medium">
                Question <span className="text-slate-900">{state.currentQuestionIndex + 1}</span> of {totalQuestions}
              </div>

              {state.currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < totalQuestions}
                  className={`flex items-center gap-2 font-bold px-8 py-3 rounded-xl transition shadow-lg ${
                    answeredCount === totalQuestions
                      ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Final Assessment
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg hover:scale-105 active:scale-95"
                >
                  Next Question
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 overflow-x-auto pb-4 px-2">
            {QUESTIONS.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setState((prev) => ({ ...prev, currentQuestionIndex: i }))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition flex-shrink-0 ${
                  i === state.currentQuestionIndex
                    ? 'bg-blue-600 text-white shadow-md scale-110 z-10'
                    : state.answers[q.id]
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Navigation for Mobile */}
      <footer className="md:hidden sticky bottom-0 bg-white border-t border-slate-200 p-3 flex justify-around">
        <button onClick={handlePrev} disabled={state.currentQuestionIndex === 0} className="text-slate-400 disabled:opacity-30">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        </button>
        <div className="text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
          <div className="text-sm font-black text-slate-800">
            {answeredCount}/{totalQuestions}
          </div>
        </div>
        <button
          onClick={handleNext}
          disabled={state.currentQuestionIndex === totalQuestions - 1}
          className="text-blue-600 disabled:opacity-30"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </footer>
    </div>
  );
}

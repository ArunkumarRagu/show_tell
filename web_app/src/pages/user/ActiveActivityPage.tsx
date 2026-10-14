import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useActivityQuery, useSubmitActivityMutation } from '@/hooks/queries/useActivities';
import { useAuth } from '@/context/AuthContext';
import { Timer, useCountdown } from '@/components/ui/Timer';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DifficultyBadge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

export function ActiveActivityPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params?.id;
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const { data: activity, isLoading } = useActivityQuery(id);
  const submitMutation = useSubmitActivityMutation();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (activity?.questions) {
      setAnswers(new Array(activity.questions.length).fill(null));
    }
  }, [activity]);

  const { remaining } = useCountdown(activity?.timeLimit ?? 300);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-ink-500">Activity not found.</p>
        <button onClick={() => navigate({ to: '/activities' })} className="btn-secondary mt-4">
          Back to Activities
        </button>
      </div>
    );
  }

  const question = activity.questions[currentQ];
  const answered = answers.filter((a) => a !== null && a !== undefined).length;

  const selectAnswer = (qIndex: number, optIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (submitMutation.isPending) return;
    const cleanAnswers = answers.map((a) => (a === null ? -1 : a));
    const timeTaken = activity.timeLimit - remaining;

    try {
      const result = await submitMutation.mutateAsync({
        id: activity.id,
        answers: cleanAnswers,
        timeTaken,
      });
      await refreshUser();
      toast.success(`Activity submitted! You scored ${result.score} pts.`);
      navigate({
        to: `/activities/${activity.id}/result`,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed');
    }
  };

  const isLow = remaining <= 30;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: `/activities/${activity.id}` })}
          className="flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Activity
        </button>
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={activity.difficulty} />
          <span className="badge bg-ink-100 text-ink-600">{activity.maxScore} pts</span>
        </div>
      </div>

      {/* Timer + title */}
      <div className="card flex flex-col items-center p-8">
        <h1 className="mb-6 text-xl font-bold text-ink-900">{activity.name}</h1>
        <Tooltip content={tooltips.quiz.timer} position="top">
          <Timer totalSeconds={activity.timeLimit} remainingSeconds={remaining} onTimeUp={handleSubmit} />
        </Tooltip>
        {isLow && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-danger-50 px-4 py-2 text-sm font-semibold text-danger-700">
            <AlertTriangle className="h-4 w-4" />
            Time is running out! Submit soon.
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-600">
            Question {currentQ + 1} of {activity.questions.length}
          </span>
          <span className="font-semibold text-ink-700">
            {answered}/{activity.questions.length} answered
          </span>
        </div>
        <ProgressBar value={answered} max={activity.questions.length} color="bg-brand-500" />
      </div>

      {/* Question */}
      {question && (
        <div className="card p-6 animate-fade-in" key={currentQ}>
          <h2 className="text-lg font-semibold text-ink-900">{question.prompt}</h2>
          <div className="mt-4 space-y-3">
            {question.options.map((opt, i) => {
              const selected = answers[currentQ] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(currentQ, i)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                    selected
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                      : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      selected ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`text-sm ${selected ? 'font-semibold text-brand-900' : 'text-ink-700'}`}>
                    {opt}
                  </span>
                  {selected && <CheckCircle2 className="ml-auto h-5 w-5 text-brand-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
          disabled={currentQ === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Question dots */}
        <Tooltip content={tooltips.quiz.questionNav} position="top">
          <div className="flex gap-2 cursor-pointer">
            {activity.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === currentQ
                    ? 'bg-brand-600 w-6'
                    : answers[i] !== null && answers[i] !== undefined
                    ? 'bg-brand-300'
                    : 'bg-ink-200'
                }`}
              />
            ))}
          </div>
        </Tooltip>

        {currentQ < activity.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ((q) => Math.min(activity.questions.length - 1, q + 1))}
            className="btn-primary"
          >
            Next
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </button>
        ) : (
          <Tooltip content={tooltips.quiz.submitQuiz} position="top">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={submitMutation.isPending}
              className="btn-primary bg-success-600 hover:bg-success-700"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Submit
            </button>
          </Tooltip>
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="card relative w-full max-w-md animate-scale-in p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-900">Submit Activity?</h3>
                <p className="text-sm text-ink-500">You answered {answered}/{activity.questions.length} questions.</p>
              </div>
            </div>
            {answered < activity.questions.length && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-warning-50 p-3 text-sm text-warning-700">
                <AlertTriangle className="h-4 w-4" />
                {activity.questions.length - answered} question(s) unanswered.
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="btn-primary bg-success-600 hover:bg-success-700"
              >
                {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useNavigate, useParams } from '@tanstack/react-router';
import { CheckCircle2, XCircle, Clock, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar, RingProgress } from '@/components/ui/ProgressBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

export function ActivityResultPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params?.id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const state = (window.history.state?.usr || {}) as {
    score?: number;
    maxScore?: number;
    correct?: number;
    total?: number;
    difficulty?: any;
    passed?: boolean;
    timeTaken?: number;
  };

  const score = state.score ?? 80;
  const maxScore = state.maxScore ?? 100;
  const correct = state.correct ?? 3;
  const total = state.total ?? 3;
  const difficulty = state.difficulty ?? 'Medium';
  const passed = state.passed ?? (score >= maxScore * 0.6);
  const timeTaken = state.timeTaken ?? 135;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeStr = `${minutes}m ${seconds}s`;
  const currentScore = user?.score ?? 0;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Result hero */}
        <Card className="overflow-hidden p-8 text-center animate-scale-in">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${passed ? 'bg-success-50' : 'bg-danger-50'}`}>
            {passed ? (
              <CheckCircle2 className="h-10 w-10 text-success-600" />
            ) : (
              <XCircle className="h-10 w-10 text-danger-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-ink-900">{passed ? 'Activity Passed!' : 'Activity Failed'}</h1>
          <div className="mt-6 flex justify-center">
            <RingProgress
              value={score}
              max={maxScore}
              size={140}
              color={passed ? '#10b981' : '#ef4444'}
              label="of max score"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <DifficultyBadge difficulty={difficulty} />
            <span className="badge bg-ink-100 text-ink-600">
              {correct}/{total} correct
            </span>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Tooltip content={tooltips.dashboard.userTotalScore} position="top" className="w-full">
            <Card className="p-4 text-center w-full cursor-pointer">
              <Trophy className="mx-auto h-6 w-6 text-brand-600" />
              <p className="mt-2 text-xs text-ink-400">Score Earned</p>
              <p className="text-xl font-bold text-ink-900">+{score}</p>
            </Card>
          </Tooltip>
          <Tooltip content="Total duration spent on this challenge" position="top" className="w-full">
            <Card className="p-4 text-center w-full cursor-pointer">
              <Clock className="mx-auto h-6 w-6 text-accent-500" />
              <p className="mt-2 text-xs text-ink-400">Time Taken</p>
              <p className="text-xl font-bold text-ink-900">{timeStr}</p>
            </Card>
          </Tooltip>
          <Tooltip content={tooltips.dashboard.userTotalScore} position="top" className="w-full">
            <Card className="p-4 text-center w-full cursor-pointer">
              <Trophy className="mx-auto h-6 w-6 text-success-600" />
              <p className="mt-2 text-xs text-ink-400">Your Current Score</p>
              <p className="text-xl font-bold text-ink-900">{currentScore.toLocaleString()}</p>
            </Card>
          </Tooltip>
        </div>

        {/* Answer breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-ink-900">Answer Breakdown</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-ink-600">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                Correct answers
              </span>
              <span className="text-sm font-bold text-success-600">{correct}/{total}</span>
            </div>
            <ProgressBar value={correct} max={total} color="bg-success-500" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-ink-600">
                <XCircle className="h-4 w-4 text-danger-500" />
                Incorrect answers
              </span>
              <span className="text-sm font-bold text-danger-600">{total - correct}/{total}</span>
            </div>
            <ProgressBar value={total - correct} max={total} color="bg-danger-500" />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => navigate({ to: '/activities' })} className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
            Try Another Activity
          </button>
          <button onClick={() => navigate({ to: '/dashboard' })} className="btn-primary">
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

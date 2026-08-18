import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Trophy, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar, RingProgress } from '@/components/ui/ProgressBar';
import { activities, teams } from '@/data/mockData';

interface ResultState {
  score: number;
  timeTaken: number;
  correct: number;
  total: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function ActivityResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as ResultState | null;

  if (!state) {
    navigate('/activities');
    return null;
  }

  const activity = activities.find((a) => a.id === id);
  const team = teams.find((t) => t.id === user?.teamId);
  const passed = state.score >= (activity?.passingScore ?? 60);
  const minutes = Math.floor(state.timeTaken / 60);
  const seconds = state.timeTaken % 60;
  const timeStr = `${minutes}m ${seconds}s`;
  const newScore = (user?.score ?? 0) + state.score;
  const newTeamScore = (team?.score ?? 0) + state.score;

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
          <p className="mt-1 text-sm text-ink-500">{activity?.name}</p>
          <div className="mt-6 flex justify-center">
            <RingProgress
              value={state.score}
              max={activity?.maxScore ?? 100}
              size={140}
              color={passed ? '#10b981' : '#ef4444'}
              label="of max score"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <DifficultyBadge difficulty={state.difficulty} />
            <span className="badge bg-ink-100 text-ink-600">
              {state.correct}/{state.total} correct
            </span>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="p-4 text-center">
            <Trophy className="mx-auto h-6 w-6 text-brand-600" />
            <p className="mt-2 text-xs text-ink-400">Score Earned</p>
            <p className="text-xl font-bold text-ink-900">+{state.score}</p>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-accent-500" />
            <p className="mt-2 text-xs text-ink-400">Time Taken</p>
            <p className="text-xl font-bold text-ink-900">{timeStr}</p>
          </Card>
          <Card className="p-4 text-center">
            <Trophy className="mx-auto h-6 w-6 text-success-600" />
            <p className="mt-2 text-xs text-ink-400">Your Score</p>
            <p className="text-xl font-bold text-ink-900">{newScore.toLocaleString()}</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="mx-auto h-6 w-6 text-brand-600" />
            <p className="mt-2 text-xs text-ink-400">Team Score</p>
            <p className="text-xl font-bold text-ink-900">{newTeamScore.toLocaleString()}</p>
          </Card>
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
              <span className="text-sm font-bold text-success-600">{state.correct}/{state.total}</span>
            </div>
            <ProgressBar value={state.correct} max={state.total} color="bg-success-500" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-ink-600">
                <XCircle className="h-4 w-4 text-danger-500" />
                Incorrect answers
              </span>
              <span className="text-sm font-bold text-danger-600">{state.total - state.correct}/{state.total}</span>
            </div>
            <ProgressBar value={state.total - state.correct} max={state.total} color="bg-danger-500" />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => navigate('/activities')} className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
            Try Another Activity
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

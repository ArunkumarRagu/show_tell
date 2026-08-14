import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Target, ListChecks, Play, CheckCircle2 } from 'lucide-react';
import { activities } from '@/data/mockData';
import { Card } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function ActivityDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-ink-500">Activity not found.</p>
        <button onClick={() => navigate('/activities')} className="btn-secondary mt-4">Back to Activities</button>
      </div>
    );
  }

  const minutes = Math.floor(activity.timeLimit / 60);
  const seconds = activity.timeLimit % 60;
  const timeStr = seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button onClick={() => navigate('/activities')} className="flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700">
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </button>

      <Card className="overflow-hidden">
        <div className="border-b border-ink-100 bg-gradient-to-br from-ink-50 to-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <DifficultyBadge difficulty={activity.difficulty} />
                <span className="badge bg-ink-100 text-ink-600">{activity.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-ink-900">{activity.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">{activity.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <Clock className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-xs text-ink-400">Time Limit</p>
              <p className="text-sm font-bold text-ink-900">{timeStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <Star className="h-5 w-5 text-accent-500" />
            <div>
              <p className="text-xs text-ink-400">Max Score</p>
              <p className="text-sm font-bold text-ink-900">{activity.maxScore} pts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <Target className="h-5 w-5 text-success-600" />
            <div>
              <p className="text-xs text-ink-400">Passing Score</p>
              <p className="text-sm font-bold text-ink-900">{activity.passingScore} pts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <ListChecks className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-xs text-ink-400">Questions</p>
              <p className="text-sm font-bold text-ink-900">{activity.questions.length}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-ink-900">Instructions</h2>
        <div className="mt-4 space-y-3">
          <p className="text-sm leading-relaxed text-ink-600">{activity.instructions}</p>
          <ul className="space-y-2">
            {[
              'Read each question carefully before answering.',
              'You can navigate between questions before submitting.',
              'The timer starts as soon as you begin the activity.',
              'Partial credit is awarded for near-correct answers.',
              'Your score updates instantly upon submission.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Community Stats</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-ink-500">Average Score</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">{activity.avgScore}<span className="text-base font-normal text-ink-400">/{activity.maxScore}</span></p>
            <ProgressBar value={activity.avgScore} max={activity.maxScore} color="bg-brand-500" className="mt-2" />
          </div>
          <div>
            <p className="text-sm text-ink-500">Total Completions</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">{activity.completions}</p>
            <p className="mt-1 text-xs text-ink-400">Across all teams</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center pb-4">
        <button onClick={() => navigate(`/activities/${activity.id}/run`)} className="btn-primary px-8 py-3 text-base">
          <Play className="h-5 w-5" />
          Start Activity
        </button>
      </div>
    </div>
  );
}

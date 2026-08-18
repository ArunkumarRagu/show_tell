import { Clock, Star, Play } from 'lucide-react';
import type { Activity } from '@/types';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ActivityCardProps {
  activity: Activity;
  onStart: () => void;
}

export function ActivityCard({ activity, onStart }: ActivityCardProps) {
  const minutes = Math.floor(activity.timeLimit / 60);
  const seconds = activity.timeLimit % 60;
  const timeStr = seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;

  return (
    <div className="card card-hover flex flex-col p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={activity.difficulty} />
          <span className="badge bg-ink-100 text-ink-600">{activity.category}</span>
        </div>
      </div>
      <h3 className="text-base font-bold text-ink-900">{activity.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{activity.description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {timeStr}
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-accent-500" />
          {activity.maxScore} pts
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
          {activity.completions} done
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar value={activity.avgScore} max={activity.maxScore} size="sm" color="bg-success-400" />
        <p className="mt-1 text-xs text-ink-400">Avg score: {activity.avgScore}/{activity.maxScore}</p>
      </div>
      <button onClick={onStart} className="btn-primary mt-4 w-full">
        <Play className="h-4 w-4" />
        Start Activity
      </button>
    </div>
  );
}

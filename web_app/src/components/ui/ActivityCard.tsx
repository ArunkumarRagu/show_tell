import { Clock, Star, Play } from 'lucide-react';
import type { Activity } from '@/types';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

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
          <Tooltip content={tooltips.activities.difficulty} position="top">
            <DifficultyBadge difficulty={activity.difficulty} />
          </Tooltip>
          <span className="badge bg-ink-100 text-ink-600">{activity.category}</span>
        </div>
      </div>
      <h3 className="text-base font-bold text-ink-900">{activity.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{activity.description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
        <Tooltip content={tooltips.activities.timeLimit} position="top">
          <span className="flex items-center gap-1.5 cursor-pointer">
            <Clock className="h-4 w-4" />
            {timeStr}
          </span>
        </Tooltip>
        <Tooltip content={tooltips.activities.maxScore} position="top">
          <span className="flex items-center gap-1.5 cursor-pointer">
            <Star className="h-4 w-4 text-accent-500" />
            {activity.maxScore} pts
          </span>
        </Tooltip>
        <Tooltip content={tooltips.activities.completions} position="top">
          <span className="flex items-center gap-1.5 cursor-pointer">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
            {activity.completions} done
          </span>
        </Tooltip>
      </div>
      <div className="mt-3">
        <ProgressBar value={activity.avgScore} max={activity.maxScore} size="sm" color="bg-success-400" />
        <p className="mt-1 text-xs text-ink-400">Avg score: {activity.avgScore}/{activity.maxScore}</p>
      </div>
      <Tooltip content={tooltips.activities.startActivity} position="bottom" className="w-full mt-4">
        <button onClick={onStart} className="btn-primary w-full">
          <Play className="h-4 w-4" />
          Start Activity
        </button>
      </Tooltip>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { activities } from '@/data/mockData';
import type { Difficulty } from '@/types';

type FilterType = 'All' | Difficulty;

export function ActivitiesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = filter === 'All' ? activities.filter((a) => a.status === 'active') : activities.filter((a) => a.difficulty === filter && a.status === 'active');

  const filters: FilterType[] = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Activities</h1>
        <p className="mt-1 text-sm text-ink-500">Choose a challenge and test your skills against the clock.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-400" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === f
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-sm text-ink-400">{filtered.length} activities</span>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onStart={() => navigate(`/activities/${activity.id}`)} />
        ))}
      </div>
    </div>
  );
}

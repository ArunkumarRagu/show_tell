import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Filter, Layers, Loader2 } from 'lucide-react';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { extractList } from '@/api/client';
import { useActivitiesQuery } from '@/hooks/queries/useActivities';

export function ActivitiesPage() {
  const navigate = useNavigate();
  const { data: rawActivities, isLoading } = useActivitiesQuery(true);
  const activitiesList = extractList(rawActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(activitiesList.map((a) => a.category)))];

  const filteredActivities = activitiesList.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || activity.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Challenge Activities</h1>
        <p className="mt-1 text-sm text-ink-500">
          Select a timed challenge, test your knowledge, and earn points for your team.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="input pl-10"
          />
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select py-2 text-xs"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-ink-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="select py-2 text-xs"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-ink-800 bg-ink-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-700 bg-ink-900/40 py-16 text-center">
          <p className="text-base font-semibold text-ink-300">No activities found</p>
          <p className="mt-1 text-sm text-ink-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onStart={() => navigate({ to: `/activities/${activity.id}` })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

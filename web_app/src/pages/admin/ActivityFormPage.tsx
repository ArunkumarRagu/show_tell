import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useActivityQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from '@/hooks/queries/useActivities';
import type { Difficulty, ActivityStatus, ActivityType } from '@/types';
import { InfoTooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

export function ActivityFormPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params?.id;
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: activity, isLoading: isFetching } = useActivityQuery(id);
  const createMutation = useCreateActivityMutation();
  const updateMutation = useUpdateActivityMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [timeLimit, setTimeLimit] = useState(300);
  const [maxScore, setMaxScore] = useState(100);
  const [passingScore, setPassingScore] = useState(60);
  const [status, setStatus] = useState<ActivityStatus>('active');
  const [category, setCategory] = useState('Engineering');
  const [activityType, setActivityType] = useState<ActivityType>('individual');
  const [questions, setQuestions] = useState([
    { id: 'q1', prompt: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setDescription(activity.description);
      setInstructions(activity.instructions);
      setDifficulty(activity.difficulty);
      setTimeLimit(activity.timeLimit);
      setMaxScore(activity.maxScore);
      setPassingScore(activity.passingScore);
      setStatus(activity.status);
      setCategory(activity.category);
      setActivityType(activity.activityType);
      if (activity.questions && activity.questions.length > 0) {
        setQuestions(
          activity.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            options: q.options.length >= 4 ? q.options : [...q.options, '', '', '', ''].slice(0, 4),
            correctIndex: q.correctIndex,
          }))
        );
      }
    }
  }, [activity]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: `q_${Date.now()}`, prompt: '', options: ['', '', '', ''], correctIndex: 0 },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, options: q.options.map((o, j) => (j === optIdx ? value : o)) } : q))
    );
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please provide an activity name');
      return;
    }
    try {
      const payload = {
        name,
        description,
        instructions,
        difficulty,
        timeLimit,
        maxScore,
        passingScore,
        status,
        category,
        activityType,
        questions: questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          options: q.options,
          correctIndex: q.correctIndex,
        })),
      };

      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, payload });
        toast.success(`Activity "${name}" updated successfully!`);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`Activity "${name}" created successfully!`);
      }
      navigate({ to: '/admin/activities' });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save activity');
    }
  };

  if (isEdit && isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate({ to: '/admin/activities' })}
            className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Activities
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Activity' : 'Create Activity'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate({ to: '/admin/activities' })}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Basic info */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-white">Basic Information</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-300">Activity Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Code Review Sprint"
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short description shown on card"
              className="input py-2 resize-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-300">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Detailed instructions for participants"
              className="input py-2 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-ink-300">Activity Type</label>
                <InfoTooltip content={tooltips.activities.activityType} />
              </div>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as ActivityType)}
                className="select"
              >
                <option value="group">Group Activity</option>
                <option value="individual">Individual Activity</option>
              </select>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-ink-300">Difficulty</label>
                <InfoTooltip content={tooltips.activities.difficulty} />
              </div>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="select"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-ink-300">Category</label>
                <InfoTooltip content={tooltips.activities.category} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="Engineering">Engineering</option>
                <option value="Architecture">Architecture</option>
                <option value="Debugging">Debugging</option>
                <option value="Security">Security</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="Database">Database</option>
                <option value="Performance">Performance</option>
                <option value="Tools">Tools</option>
                <option value="Quality">Quality</option>
                <option value="Process">Process</option>
                <option value="API Design">API Design</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Scoring & timing */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-white">Scoring & Timing</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-ink-300">Timer (seconds)</label>
              <InfoTooltip content={tooltips.activities.timeLimit} />
            </div>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-ink-300">Maximum Score</label>
              <InfoTooltip content={tooltips.activities.maxScore} />
            </div>
            <input
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-ink-300">Passing Score</label>
              <InfoTooltip content={tooltips.activities.passingScore} />
            </div>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-ink-300">Status</label>
              <InfoTooltip content={tooltips.activities.status} />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ActivityStatus)}
              className="select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Questions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Questions</h2>
          <Button variant="secondary" size="sm" onClick={addQuestion}>
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="rounded-xl border border-ink-800 bg-ink-900/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="badge bg-brand-950 text-brand-300 border border-brand-800">
                  Question {qIdx + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIdx)}
                    className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-950 hover:text-danger-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={q.prompt}
                onChange={(e) => updateQuestion(qIdx, 'prompt', e.target.value)}
                placeholder="Enter the question prompt"
                className="input mt-3"
              />
              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuestion(qIdx, 'correctIndex', optIdx)}
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                        q.correctIndex === optIdx ? 'bg-emerald-600 text-white' : 'bg-ink-800 text-ink-400'
                      }`}
                      title="Mark as correct"
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className="input"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-400">Click a letter button to set as correct answer.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

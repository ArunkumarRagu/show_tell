import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { activities } from '@/data/mockData';
import type { Difficulty, ActivityStatus, ActivityType } from '@/types';

export function ActivityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existing = id ? activities.find((a) => a.id === id) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [instructions, setInstructions] = useState(existing?.instructions ?? '');
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? 'Easy');
  const [timeLimit, setTimeLimit] = useState(existing?.timeLimit ?? 300);
  const [maxScore, setMaxScore] = useState(existing?.maxScore ?? 100);
  const [passingScore, setPassingScore] = useState(existing?.passingScore ?? 60);
  const [status, setStatus] = useState<ActivityStatus>(existing?.status ?? 'active');
  const [category, setCategory] = useState(existing?.category ?? 'Engineering');
  const [activityType, setActivityType] = useState<ActivityType>(existing?.activityType ?? 'group');
  const [questions, setQuestions] = useState(existing?.questions ?? [
    { id: 'q1', prompt: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { id: `q${prev.length + 1}`, prompt: '', options: ['', '', '', ''], correctIndex: 0 }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: string | number) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, options: q.options.map((o, j) => (j === optIdx ? value : o)) } : q)));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please provide an activity name');
      return;
    }
    toast.success(isEdit ? `Activity "${name}" updated successfully!` : `Activity "${name}" created successfully!`);
    navigate('/admin/activities');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/admin/activities')} className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Activities
          </button>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Activity' : 'Create Activity'}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/activities')}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Basic info */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-ink-900">Basic Information</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Activity Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Code Review Sprint" className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Short description shown on the activity card" className="input-field resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Instructions</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Detailed instructions for participants" className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Activity Type</label>
              <select value={activityType} onChange={(e) => setActivityType(e.target.value as ActivityType)} className="input-field">
                <option value="group">Group Activity</option>
                <option value="individual">Individual Activity</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="input-field">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
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
        <h2 className="text-lg font-bold text-ink-900">Scoring & Timing</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Timer (seconds)</label>
            <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Maximum Score</label>
            <input type="number" value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Passing Score</label>
            <input type="number" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ActivityStatus)} className="input-field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>


      {/* Questions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Questions</h2>
          <Button variant="secondary" size="sm" onClick={addQuestion}>
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="rounded-xl border border-ink-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="badge bg-brand-50 text-brand-700">Question {qIdx + 1}</span>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qIdx)} className="rounded-lg p-1.5 text-ink-400 hover:bg-danger-50 hover:text-danger-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={q.prompt}
                onChange={(e) => updateQuestion(qIdx, 'prompt', e.target.value)}
                placeholder="Enter the question prompt"
                className="input-field mt-3"
              />
              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuestion(qIdx, 'correctIndex', optIdx)}
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                        q.correctIndex === optIdx ? 'bg-success-500 text-white' : 'bg-ink-100 text-ink-400'
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
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-400">Click a letter to mark the correct answer.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

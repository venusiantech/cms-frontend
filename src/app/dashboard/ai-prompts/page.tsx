'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { aiPromptsAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';

export default function AiPromptsPage() {
  const queryClient = useQueryClient();
  const { isSuperAdmin } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any>(null);

  // Fetch prompts
  const { data: prompts, isLoading } = useQuery({
    queryKey: ['ai-prompts'],
    queryFn: async () => {
      const response = await aiPromptsAPI.getAll();
      return response.data;
    },
    enabled: isSuperAdmin(),
  });

  if (!isSuperAdmin()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Access denied. Super Admin only.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Prompts</h1>
          <p className="text-gray-600 mt-1">
            Manage AI prompts for content generation
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPrompt(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Prompt
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : prompts && prompts.length > 0 ? (
        <div className="space-y-4">
          {prompts.map((prompt: any) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={() => {
                setEditingPrompt(prompt);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No AI prompts yet</h3>
          <p className="text-gray-600 mb-4">
            Create prompts to control AI-generated content
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Add First Prompt
          </button>
        </div>
      )}

      {showModal && (
        <PromptModal
          prompt={editingPrompt}
          onClose={() => {
            setShowModal(false);
            setEditingPrompt(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
            setShowModal(false);
            setEditingPrompt(null);
          }}
        />
      )}
    </div>
  );
}

function PromptCard({ prompt, onEdit }: any) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => aiPromptsAPI.delete(prompt.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
    },
  });

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{prompt.promptKey}</h3>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
              {prompt.promptType}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {prompt.templateKey}
            </span>
          </div>
          <p className="text-gray-700">{prompt.promptText}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-primary-600 hover:bg-primary-50 p-2 rounded"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            className="text-red-600 hover:bg-red-50 p-2 rounded"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptModal({ prompt, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    promptKey: prompt?.promptKey || '',
    promptText: prompt?.promptText || '',
    promptType: prompt?.promptType || 'TEXT',
    templateKey: prompt?.templateKey || 'templateA',
  });

  const mutation = useMutation({
    mutationFn: () =>
      prompt
        ? aiPromptsAPI.update(prompt.id, {
            promptText: formData.promptText,
            promptType: formData.promptType,
          })
        : aiPromptsAPI.create(formData),
    onSuccess,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {prompt ? 'Edit Prompt' : 'Create Prompt'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prompt Key</label>
            <input
              type="text"
              value={formData.promptKey}
              onChange={(e) =>
                setFormData({ ...formData, promptKey: e.target.value })
              }
              className="input-field"
              disabled={!!prompt}
              placeholder="hero_heading_templateA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prompt Text</label>
            <textarea
              value={formData.promptText}
              onChange={(e) =>
                setFormData({ ...formData, promptText: e.target.value })
              }
              className="input-field min-h-[150px]"
              placeholder="Enter the AI prompt..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.promptType}
                onChange={(e) =>
                  setFormData({ ...formData, promptType: e.target.value })
                }
                className="input-field"
              >
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="SEO">SEO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Template</label>
              <select
                value={formData.templateKey}
                onChange={(e) =>
                  setFormData({ ...formData, templateKey: e.target.value })
                }
                className="input-field"
                disabled={!!prompt}
              >
                <option value="templateA">Template A</option>
                <option value="templateB">Template B</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn-primary flex-1"
          >
            {mutation.isPending ? 'Saving...' : 'Save Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}


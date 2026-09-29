import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const ENTITY_FIELDS = {
  Lead: ['name', 'email', 'company', 'phone', 'title', 'status', 'service_interest', 'budget_range', 'timeline', 'score'],
  EmailFollowUp: ['recipient_email', 'recipient_name', 'subject', 'status', 'send_date', 'template'],
  ExecutiveBriefing: ['name', 'email', 'company', 'title', 'preferred_date', 'meeting_type', 'status']
};

const CRMS = ['hubspot', 'salesforce'];
const ENTITIES = ['Lead', 'EmailFollowUp', 'ExecutiveBriefing'];
const DIRECTIONS = ['push', 'pull', 'bidirectional'];
const FIELD_TYPES = ['text', 'number', 'date', 'boolean', 'select'];

export default function FieldMappingForm({ crmSystem, onClose }) {
  const [formData, setFormData] = useState({
    crm_system: crmSystem || 'hubspot',
    app_entity: 'Lead',
    app_field: '',
    crm_field: '',
    field_type: 'text',
    direction: 'bidirectional',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.app_field || !formData.crm_field) {
      alert('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      await base44.entities.CRMFieldMapping.create(formData);
      alert('Field mapping created successfully');
      onClose();
    } catch (error) {
      alert('Failed to create mapping: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Add Field Mapping</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">CRM System</label>
            <select
              value={formData.crm_system}
              onChange={(e) => setFormData({ ...formData, crm_system: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm"
            >
              {CRMS.map(crm => (
                <option key={crm} value={crm}>{crm}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">App Entity</label>
            <select
              value={formData.app_entity}
              onChange={(e) => setFormData({ ...formData, app_entity: e.target.value, app_field: '' })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm"
            >
              {ENTITIES.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">App Field</label>
            <select
              value={formData.app_field}
              onChange={(e) => setFormData({ ...formData, app_field: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm"
            >
              <option value="">Select field</option>
              {(ENTITY_FIELDS[formData.app_entity] || []).map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">CRM Field</label>
            <input
              type="text"
              value={formData.crm_field}
              onChange={(e) => setFormData({ ...formData, crm_field: e.target.value })}
              placeholder="e.g., email, firstName, customField__c"
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Field Type</label>
            <select
              value={formData.field_type}
              onChange={(e) => setFormData({ ...formData, field_type: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm"
            >
              {FIELD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Sync Direction</label>
            <select
              value={formData.direction}
              onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white text-sm"
            >
              {DIRECTIONS.map(dir => (
                <option key={dir} value={dir}>{dir}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4"
          />
          <label className="text-sm text-slate-300">Active</label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
            {saving ? 'Creating...' : 'Create Mapping'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
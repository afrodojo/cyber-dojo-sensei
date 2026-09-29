import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';

export default function WebinarRegistrationForm({ webinar, onClose }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service_interest: '',
    message: ''
  });

  const serviceOptions = [
    'red-team',
    'penetration-testing',
    'security-consulting',
    'training',
    'speaking',
    'other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleServiceChange = (value) => {
    setFormData(prev => ({ ...prev, service_interest: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sync registrant to HubSpot
      await base44.functions.invoke('syncWebinarRegistrantsToHubSpot', {
        registrant_email: formData.email,
        registrant_name: formData.name,
        webinar_title: webinar.title,
        webinar_date: webinar.date
      });

      // If they expressed service interest, create a deal
      if (formData.service_interest) {
        await base44.functions.invoke('createHubSpotDealFromWebinar', {
          contact_email: formData.email,
          contact_name: formData.name,
          deal_name: `${webinar.title} - ${formData.service_interest}`,
          service_interest: formData.service_interest,
          webinar_title: webinar.title,
          deal_amount: null,
          deal_stage: 'qualification'
        });
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Registration Confirmed!</h3>
          <p className="text-slate-400">
            Thank you for registering. You'll receive a confirmation email shortly with webinar details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Register for Webinar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-slate-800 border-slate-700 text-white"
            required
          />

          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="bg-slate-800 border-slate-700 text-white"
            required
          />

          <Input
            name="company"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={handleChange}
            className="bg-slate-800 border-slate-700 text-white"
          />

          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              Interested in Services (optional)
            </label>
            <Select value={formData.service_interest} onValueChange={handleServiceChange}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select a service..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Not interested</SelectItem>
                {serviceOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            name="message"
            placeholder="Any questions or additional info? (optional)"
            value={formData.message}
            onChange={handleChange}
            className="bg-slate-800 border-slate-700 text-white"
            rows={3}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
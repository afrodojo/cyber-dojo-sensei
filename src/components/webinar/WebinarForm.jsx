import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function WebinarForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null,
    time: "",
    duration: "",
    topics: "",
    max_attendees: 0,
    meeting_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      topics: formData.topics.split(',').map(t => t.trim()).filter(t => t),
      max_attendees: Number(formData.max_attendees),
      date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
    };
    onSubmit(submissionData);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Create New Webinar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="title" placeholder="Webinar Title" value={formData.title} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" required />
          <Textarea name="description" placeholder="Webinar Description" value={formData.description} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" required />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
            <Input name="time" placeholder="Time (e.g., 2:00 PM EST)" value={formData.time} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" required />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input name="duration" placeholder="Duration (e.g., 45 minutes)" value={formData.duration} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" required />
            <Input name="max_attendees" type="number" placeholder="Max Attendees" value={formData.max_attendees} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" />
          </div>

          <Input name="topics" placeholder="Topics (comma-separated)" value={formData.topics} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" />
          <Input name="meeting_link" placeholder="Registration/Meeting Link" value={formData.meeting_link} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white" />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">Create Webinar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
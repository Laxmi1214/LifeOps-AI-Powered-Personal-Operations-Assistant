import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { MeetingDetailModal } from '../components/meetings/MeetingDetailModal';

export const Meetings = () => {
  const { meetings } = useLifeOps();
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const upcomingMeetings = meetings.filter((m) => m.status === 'Upcoming');
  const pastMeetings = meetings.filter((m) => m.status === 'Past');

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
          Meetings
          <span className="text-[10px] font-medium bg-[#F5F5F5] text-gray-600 px-2 py-0.5 rounded border border-[#E5E5E5]">
            Demo dataset · MCP connector pending
          </span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Synthesized meeting records, decisions, and action items.
        </p>
      </div>

      {/* Upcoming Meetings List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Upcoming Meetings ({upcomingMeetings.length})
        </h2>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
          {upcomingMeetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
              className="p-4 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer group"
            >
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-900">{meeting.time}</span>
                  <span className="text-xs font-medium text-gray-800">{meeting.title}</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {meeting.date} · {meeting.duration} · {meeting.participants.length} participants
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-black font-medium group-hover:translate-x-0.5 transition-transform">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {upcomingMeetings.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-400">
              No upcoming meetings scheduled.
            </div>
          )}
        </div>
      </div>

      {/* Past Meetings List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Past Meetings & Synthesized Notes ({pastMeetings.length})
        </h2>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
          {pastMeetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
              className="p-4 flex items-start justify-between hover:bg-gray-50/70 transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-900">{meeting.time}</span>
                  <span className="text-xs font-medium text-gray-800">{meeting.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-normal line-clamp-1">
                  {meeting.summary}
                </p>
                <div className="text-[11px] text-gray-400">
                  {meeting.date} · {meeting.participants.length} participants · {meeting.actionItems.length} action items
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-black font-medium group-hover:translate-x-0.5 transition-transform pt-1">
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  );
};

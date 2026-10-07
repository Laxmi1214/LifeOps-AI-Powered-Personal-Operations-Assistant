import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LifeOpsProvider } from './context/LifeOpsContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/layout/ToastContainer';
import { QuickAssistantDrawer } from './components/layout/QuickAssistantDrawer';
import { DemoNotesModal } from './components/layout/DemoNotesModal';
import { SettingsModal } from './components/layout/SettingsModal';
import { AddTaskModal } from './components/tasks/AddTaskModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Email } from './pages/Email';
import { Documents } from './pages/Documents';
import { Meetings } from './pages/Meetings';
import { Reminders } from './pages/Reminders';
import { Subscriptions } from './pages/Subscriptions';
import { Analytics } from './pages/Analytics';

export default function App() {
  const [isDemoNotesOpen, setIsDemoNotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <BrowserRouter>
      <LifeOpsProvider>
        <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden antialiased">
          {/* Persistent Sidebar */}
          <Sidebar
            onOpenDemoNotes={() => setIsDemoNotesOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Main App Container */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white">
            {/* Top Bar */}
            <Topbar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-8 py-8 bg-white">
              <div className="max-w-6xl mx-auto">
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard onOpenAddTask={() => setIsAddTaskOpen(true)} />}
                  />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/email" element={<Email />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/reminders" element={<Reminders />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>

          {/* Global Modals & Overlays */}
          <CommandPalette />
          <QuickAssistantDrawer />
          <ToastContainer />
          <AddTaskModal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} />
          <DemoNotesModal isOpen={isDemoNotesOpen} onClose={() => setIsDemoNotesOpen(false)} />
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </LifeOpsProvider>
    </BrowserRouter>
  );
}

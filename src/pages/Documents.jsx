import React, { useState } from 'react';
import {
  FileText,
  Search,
  Upload,
  ArrowRight
} from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { DocumentModal } from '../components/documents/DocumentModal';
import { useNavigate } from 'react-router-dom';

export const Documents = () => {
  const { documents, setDocuments, sendChatMessage, showToast } = useLifeOps();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

  const categories = ['ALL', 'Architecture', 'Specs', 'Finance'];

  const filteredDocs = documents.filter((doc) => {
    if (activeCategory !== 'ALL' && doc.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.aiSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'PDF',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      lastUpdated: 'Just now',
      category: 'Architecture',
      aiSummary: `Parsed and indexed ${file.name}. Ready for operations querying.`,
      keyPoints: ['Document parsed into knowledge base']
    };

    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Uploaded "${file.name}"`, 'success');
  };

  const handleAskLifeOps = (doc) => {
    sendChatMessage(`Can you review "${doc.title}" and identify key action items?`);
    navigate('/assistant');
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-xs text-gray-500 mt-1">
            Searchable personal knowledge repository with AI executive summaries.
          </p>
        </div>

        <label className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors shadow-subtle cursor-pointer">
          <Upload className="w-3.5 h-3.5 text-gray-500" />
          <span>Upload document</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5 bg-white">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table / List Rows */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-5 sm:col-span-5">Document Name</div>
          <div className="col-span-2 hidden sm:block">Category</div>
          <div className="col-span-2 hidden sm:block">Type</div>
          <div className="col-span-2 hidden sm:block">Updated</div>
          <div className="col-span-7 sm:col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50/70 transition-colors"
            >
              <div className="col-span-5 sm:col-span-5 flex items-center gap-2.5 min-w-0 pr-2">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium text-gray-900 truncate block">
                    {doc.title}
                  </span>
                  <span className="text-[11px] text-gray-400 block truncate sm:hidden">
                    {doc.category} · {doc.type}
                  </span>
                </div>
              </div>

              <div className="col-span-2 hidden sm:block text-gray-600 text-[11px]">
                {doc.category}
              </div>

              <div className="col-span-2 hidden sm:block text-gray-500 text-[11px]">
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-mono">
                  {doc.type}
                </span>
                <span className="ml-1.5 text-gray-400">{doc.size}</span>
              </div>

              <div className="col-span-2 hidden sm:block text-gray-500 text-[11px]">
                {doc.lastUpdated}
              </div>

              <div className="col-span-7 sm:col-span-1 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-2 py-1 rounded text-[11px] text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  Summary
                </button>
                <button
                  onClick={() => handleAskLifeOps(doc)}
                  className="px-2 py-1 rounded text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Ask
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-400">
              No documents found.
            </div>
          )}
        </div>
      </div>

      <DocumentModal
        doc={selectedDoc}
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
};

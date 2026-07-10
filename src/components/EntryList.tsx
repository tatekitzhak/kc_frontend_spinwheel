import React, { useState } from 'react';
import { Trash2, Shuffle, Plus, ListRestart, X, Check } from 'lucide-react';

interface EntryListProps {
  entries: string[];
  setEntries: (entries: string[]) => void;
  isSpinning: boolean;
}

export default function EntryList({ entries, setEntries, isSpinning }: EntryListProps) {
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const handleAddRow = () => {
    setEntries([...entries, '']);
  };

  const handleUpdateRow = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleDeleteRow = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleBulkAdd = () => {
    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    setEntries([...entries, ...lines]);
    setBulkText('');
    setShowBulk(false);
  };

  const shuffle = () => {
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    setEntries(shuffled);
  };

  const clear = () => {
    setEntries([]);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          Inputs ({entries.length})
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setShowBulk(!showBulk)}
            disabled={isSpinning}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 text-gray-600"
            title="Bulk Add"
          >
            <ListRestart size={18} />
          </button>
          <button
            onClick={shuffle}
            disabled={isSpinning || entries.length === 0}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 text-gray-600"
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={clear}
            disabled={isSpinning || entries.length === 0}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 text-red-500"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Bulk Add Section */}
      {showBulk && (
        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Paste names here (one per line)..."
            className="w-full h-32 p-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-all resize-none text-sm mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleBulkAdd}
              className="flex-1 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} /> Add All
            </button>
            <button
              onClick={() => setShowBulk(false)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table-like Input List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div 
              key={index} 
              className="group flex items-center gap-3 bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 p-1.5 pl-4 rounded-xl transition-all"
            >
              <span className="text-xs font-mono text-gray-300 w-4">{index + 1}</span>
              <input
                type="text"
                value={entry}
                onChange={(e) => handleUpdateRow(index, e.target.value)}
                disabled={isSpinning}
                placeholder={`Entry ${index + 1}`}
                className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-medium placeholder:text-gray-300"
              />
              <button
                onClick={() => handleDeleteRow(index)}
                disabled={isSpinning}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          <button
            onClick={handleAddRow}
            disabled={isSpinning}
            className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Plus size={18} />
            Add New Entry
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center">
          Total Entries: {entries.length}
        </p>
      </div>
    </div>
  );
}

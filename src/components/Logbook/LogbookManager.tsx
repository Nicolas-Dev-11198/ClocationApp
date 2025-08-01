import React, { useState, useEffect } from 'react';
import { Logbook } from '../../types';
import LogbookList from './LogbookList';
import LogbookForm from './LogbookForm';

const LogbookManager: React.FC = () => {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [editingLogbook, setEditingLogbook] = useState<Logbook | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load logbooks from localStorage
    const savedLogbooks = localStorage.getItem('clocation_logbooks');
    if (savedLogbooks) {
      const parsed = JSON.parse(savedLogbooks);
      setLogbooks(parsed.map((lb: any) => ({
        ...lb,
        date: new Date(lb.date),
        createdAt: new Date(lb.createdAt)
      })));
    }
  }, []);

  const saveLogbooks = (newLogbooks: Logbook[]) => {
    setLogbooks(newLogbooks);
    localStorage.setItem('clocation_logbooks', JSON.stringify(newLogbooks));
  };

  const handleSave = (logbookData: Omit<Logbook, 'id' | 'createdAt'>) => {
    if (editingLogbook) {
      // Update existing logbook
      const updatedLogbooks = logbooks.map(lb =>
        lb.id === editingLogbook.id
          ? { ...logbookData, id: editingLogbook.id, createdAt: editingLogbook.createdAt }
          : lb
      );
      saveLogbooks(updatedLogbooks);
    } else {
      // Create new logbook
      const newLogbook: Logbook = {
        ...logbookData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      saveLogbooks([...logbooks, newLogbook]);
    }

    setEditingLogbook(null);
    setShowForm(false);
  };

  const handleEdit = (logbook: Logbook) => {
    setEditingLogbook(logbook);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingLogbook(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingLogbook(null);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <LogbookForm
        logbook={editingLogbook}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <LogbookList
      logbooks={logbooks}
      onEdit={handleEdit}
      onNew={handleNew}
    />
  );
};

export default LogbookManager;
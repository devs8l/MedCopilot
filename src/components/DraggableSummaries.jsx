import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDragDrop } from '../context/DragDropContext';

const SortableSummaryCard = ({ id, title, content, isExpanded, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-2"
    >
      <div
        {...listeners}
        className={`bg-white p-4 rounded-sm  cursor-grab active:cursor-grabbing border border-gray-300 ${isDragging ? 'shadow-md' : ''
          }`}
        onClick={onClick}
      >
        <h3 className="font-medium  mb-2">{title}</h3>
        {isExpanded && (
          <p className="text-sm text-gray-600 mt-2">{content}</p>
        )}
      </div>
    </div>
  );
};

const DraggableSummaries = ({ patientData, patientHistory, onRefresh, onSummaryDropped }) => {
  const { handleDrop, setIsDragging } = useDragDrop();
  const [summaries, setSummaries] = useState([
    {
      id: '1',
      title: 'Summary from latest visit, 15th March (Tuesday)',
      content: patientData?.medicalHistory || 'No medical history available',
      isExpanded: false,
    },
    {
      id: '2',
      title: 'Summary from 5th March (Wednesday)',
      content: patientData?.currentCondition || 'No current condition noted',
      isExpanded: false,
    },
    {
      id: '3',
      title: 'Summary from 24th February (Monday)',
      content: patientData?.treatmentPlan || 'No treatment plan established',
      isExpanded: false,
    },
    {
      id: '4',
      title: 'Summary from 13th February (Thursday)',
      content: 'Follow-up on medication adjustments. Patient reported improved symptoms with the new dosage.',
      isExpanded: false,
    },
    {
      id: '5',
      title: 'Summary from 31st January (Friday)',
      content: 'Initial consultation. Patient presented with chronic back pain. Ordered MRI and prescribed pain management.',
      isExpanded: false,
    },
    {
      id: '6',
      title: 'Summary from 4th January (Saturday)',
      content: 'Emergency visit due to acute pain episode. Administered injection and recommended bed rest.',
      isExpanded: false,
    },
  ]);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over) {
      setActiveId(null);
      setIsDragging(false);
      return;
    }
  
    if (active.id !== over.id && over.id !== 'summary-drop-area') {
      // Handle reordering
      setSummaries((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    } else if (over.id === 'summary-drop-area') {
      // Handle drop into summary area
      const activeSummary = summaries.find(s => s.id === active.id);
      if (activeSummary) {
        handleDrop(activeSummary.content);
      }
    }
  
    setActiveId(null);
    setIsDragging(false);
  };
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (over?.id === 'chat-input') {
      const activeSummary = summaries.find(s => s.id === active.id);
      if (activeSummary) {
        handleDrop(activeSummary.content);
      }
    }
  };

  const toggleExpand = (id) => {
    setSummaries(summaries.map(summary => ({
      ...summary,
      isExpanded: summary.id === id ? !summary.isExpanded : false
    })));
  };

  const activeSummary = activeId ? summaries.find(s => s.id === activeId) : null;

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={summaries}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {summaries.map((summary) => (
              <SortableSummaryCard
                key={summary.id}
                id={summary.id}
                title={summary.title}
                content={summary.content}
                isExpanded={summary.isExpanded}
                onClick={() => toggleExpand(summary.id)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSummary ? (
            <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-300 w-full">
              <h3 className="font-medium mb-2">{activeSummary.title}</h3>
              {activeSummary.isExpanded && (
                <p className="text-sm text-gray-600">{activeSummary.content}</p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {patientHistory && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Detailed Analysis</h4>
            <button
              onClick={onRefresh}
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
            {patientHistory.analysis?.summary || 'No detailed analysis available'}
          </div>
          {patientHistory.timestamp && (
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {new Date(patientHistory.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DraggableSummaries;
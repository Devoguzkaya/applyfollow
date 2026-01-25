"use client";

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDroppable
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { applicationService, ApplicationResponse, JobStatus } from '@/services/applicationService';
import Link from 'next/link';

// --- Types ---
type ColumnType = JobStatus;

const COLUMNS: { id: ColumnType; title: string; color: string }[] = [
    { id: 'APPLIED', title: 'Başvuruldu', color: 'bg-blue-500' },
    { id: 'INTERVIEW', title: 'Mülakat', color: 'bg-amber-500' },
    { id: 'OFFER', title: 'Teklif', color: 'bg-emerald-500' },
    { id: 'REJECTED', title: 'Reddedildi', color: 'bg-red-500' },
    { id: 'GHOSTED', title: 'Cevap Yok', color: 'bg-slate-500' },
];

export default function KanbanBoard({ applications }: { applications: ApplicationResponse[] }) {
    const queryClient = useQueryClient();

    // 2. Mutation for Drag-and-Drop update
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            applicationService.updateApplicationStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        },
    });

    // 3. Group by Columns
    const boardData = useMemo(() => {
        const groups: Record<ColumnType, ApplicationResponse[]> = {
            APPLIED: [],
            INTERVIEW: [],
            OFFER: [],
            REJECTED: [],
            GHOSTED: []
        };

        applications.forEach(app => {
            if (groups[app.status]) {
                groups[app.status].push(app);
            }
        });

        return groups;
    }, [applications]);

    // 4. DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Prevent accidental drags
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // ... (Existing logic) ...
        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the application being dragged
        const activeApp = applications.find(app => app.id === activeId);
        if (!activeApp) return;

        let newStatus: string | null = null;

        // 1. If dropped directly onto a Column (Droppable)
        if (COLUMNS.some(col => col.id === overId)) {
            newStatus = overId;
        }
        // 2. If dropped onto another Item, find which column that item is in
        else {
            // Try to get containerId from Dnd-Kit data first (Most reliable)
            const containerId = over.data.current?.sortable?.containerId;
            if (containerId && COLUMNS.some(col => col.id === containerId)) {
                newStatus = containerId;
            }
            // Fallback: Find the item in our list and get its status
            else {
                const overApp = applications.find(app => app.id === overId);
                if (overApp) {
                    newStatus = overApp.status;
                }
            }
        }

        if (newStatus && activeApp.status !== newStatus) {
            updateStatusMutation.mutate({ id: activeId, status: newStatus });
        }
    };

    // Find the active application for the overlay
    const activeApplication = applications.find(app => app.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto md:overflow-hidden pb-2 h-[calc(100vh-200px)] w-full">
                {COLUMNS.map(col => (
                    <Column
                        key={col.id}
                        column={col}
                        items={boardData[col.id]}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeApplication ? (
                    <div className="bg-surface-card border border-primary/50 rounded-lg p-4 shadow-2xl rotate-3 cursor-grabbing w-[280px]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded bg-background-main flex items-center justify-center border border-border-main text-xs font-bold text-text-main">
                                    {activeApplication.company.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold text-text-main leading-tight truncate">{activeApplication.company.name}</h4>
                                    <p className="text-[10px] text-text-muted mt-0.5 truncate">{activeApplication.position}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// --- Column Component ---
function Column({ column, items }: { column: { id: string; title: string, color: string }; items: ApplicationResponse[] }) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: { type: 'Column', status: column.id },
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-w-[200px] flex flex-col rounded-xl border max-h-full transition-colors duration-200 ${isOver
                ? 'bg-surface-hover border-primary/50 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                : 'bg-surface-card/50 border-border-main/50'
                }`}
        >
            {/* Header */}
            <div className={`p-4 border-b border-border-main/50 flex items-center justify-between sticky top-0 bg-opacity-90 backdrop-blur-sm rounded-t-xl z-10`}>
                <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${column.color}`}></span>
                    <h3 className="font-bold text-text-main text-sm uppercase tracking-wide">{column.title}</h3>
                </div>
                <span className="bg-surface-hover px-2 py-0.5 rounded text-xs text-text-muted font-bold">{items.length}</span>
            </div>

            {/* Items */}
            <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
                <SortableContext
                    id={column.id}
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(app => (
                        <SortableItem key={app.id} app={app} />
                    ))}
                </SortableContext>

                {items.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-border-main/30 rounded-lg flex items-center justify-center text-text-muted/50 text-sm">
                        Boş
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Card Component (Sortable) ---
function SortableItem({ app }: { app: ApplicationResponse }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: app.id, data: { status: app.status } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative bg-surface-card border border-border-main rounded-lg p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-background-main flex items-center justify-center border border-border-main text-xs font-bold text-text-main">
                        {app.company.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-text-main leading-tight">{app.company.name}</h4>
                        <p className="text-[10px] text-text-muted mt-0.5 truncate max-w-[120px]">{app.position}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-main/50">
                <span className="text-[10px] text-text-muted">{new Date(app.appliedAt).toLocaleDateString()}</span>
                <Link
                    href={`/applications/${app.id}`}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-hover rounded transition-all text-text-muted hover:text-primary"
                    // Prevent drag when clicking link
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                </Link>
            </div>
        </div>
    );
}

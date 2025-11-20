import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
function generateId() {
    return Math.random().toString(36).slice(2, 10);
}
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}
function Notes() {
    const [notes, setNotes] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [filter, setFilter] = useState("all");
    const activeNote = useMemo(() => notes.find((note) => note.id === activeId), [activeId, notes]);
    const filteredNotes = useMemo(() => {
        const now = Date.now();
        switch (filter) {
            case "recent":
                return notes.filter((note) => now - note.updatedAt < 1000 * 60 * 60 * 24);
            case "long":
                return notes.filter((note) => note.body.length > 200);
            case "all":
            default:
                return notes;
        }
    }, [filter, notes]);
    const createNote = () => {
        const id = generateId();
        const timestamp = Date.now();
        const newNote = {
            id,
            title: "Untitled note",
            body: "",
            createdAt: timestamp,
            updatedAt: timestamp
        };
        setNotes((prev) => [newNote, ...prev]);
        setActiveId(id);
    };
    const deleteNote = (id) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        if (activeId === id) {
            setActiveId(null);
        }
    };
    const updateActiveNote = (changes) => {
        if (!activeId) {
            return;
        }
        setNotes((prev) => prev.map((note) => note.id === activeId
            ? {
                ...note,
                ...changes,
                updatedAt: Date.now()
            }
            : note));
    };
    return (_jsxs("div", { className: "notes-app", children: [_jsxs("aside", { className: "notes-app__sidebar", children: [_jsxs("header", { children: [_jsx("h3", { children: "Notes" }), _jsxs("p", { children: [notes.length, " saved"] })] }), _jsxs("div", { className: "notes-app__controls", children: [_jsx("button", { type: "button", onClick: createNote, children: "+ New note" }), _jsxs("select", { value: filter, onChange: (event) => setFilter(event.target.value), children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "recent", children: "Updated today" }), _jsx("option", { value: "long", children: "Long form" })] })] }), _jsx("div", { className: "notes-app__list", role: "list", children: filteredNotes.map((note) => (_jsxs("button", { type: "button", role: "listitem", className: `notes-app__list-item${note.id === activeId ? " is-active" : ""}`, onClick: () => setActiveId(note.id), children: [_jsx("strong", { children: note.title || "Untitled" }), _jsxs("time", { dateTime: new Date(note.updatedAt).toISOString(), children: ["Updated ", formatTimestamp(note.updatedAt)] })] }, note.id))) })] }), _jsx("section", { className: "notes-app__editor", children: activeNote ? (_jsxs("div", { children: [_jsxs("div", { className: "notes-app__editor-toolbar", children: [_jsx("input", { type: "text", value: activeNote.title, onChange: (event) => updateActiveNote({ title: event.target.value }), placeholder: "Title", "aria-label": "Note title" }), _jsx("button", { type: "button", onClick: () => deleteNote(activeNote.id), children: "Delete" })] }), _jsx("textarea", { value: activeNote.body, onChange: (event) => updateActiveNote({ body: event.target.value }), placeholder: "Write your note here...", rows: 16 }), _jsxs("footer", { className: "notes-app__meta", children: [_jsxs("small", { children: ["Created ", formatTimestamp(activeNote.createdAt)] }), _jsxs("small", { children: ["Updated ", formatTimestamp(activeNote.updatedAt)] })] })] })) : (_jsxs("div", { className: "notes-app__empty", children: [_jsx("h3", { children: "Select or create a note" }), _jsx("p", { children: "Choose a note from the list or start a new one." })] })) })] }));
}
export const NotesApp = {
    id: "notes",
    name: "Notes",
    description: "Capture quick notes and ideas.",
    icon: "📝",
    component: Notes
};

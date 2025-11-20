import { useMemo, useState } from "react";
import type { MiniAppDefinition } from "../types";

type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

type FilterType = "all" | "recent" | "long";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId),
    [activeId, notes]
  );

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
    const newNote: Note = {
      id,
      title: "Untitled note",
      body: "",
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveId(id);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  };

  const updateActiveNote = (changes: Partial<Note>) => {
    if (!activeId) {
      return;
    }

    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeId
          ? {
              ...note,
              ...changes,
              updatedAt: Date.now()
            }
          : note
      )
    );
  };

  return (
    <div className="notes-app">
      <aside className="notes-app__sidebar">
        <header>
          <h3>Notes</h3>
          <p>{notes.length} saved</p>
        </header>

        <div className="notes-app__controls">
          <button type="button" onClick={createNote}>
            + New note
          </button>
          <select value={filter} onChange={(event) => setFilter(event.target.value as FilterType)}>
            <option value="all">All</option>
            <option value="recent">Updated today</option>
            <option value="long">Long form</option>
          </select>
        </div>

        <div className="notes-app__list" role="list">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              role="listitem"
              className={`notes-app__list-item${note.id === activeId ? " is-active" : ""}`}
              onClick={() => setActiveId(note.id)}
            >
              <strong>{note.title || "Untitled"}</strong>
              <time dateTime={new Date(note.updatedAt).toISOString()}>
                Updated {formatTimestamp(note.updatedAt)}
              </time>
            </button>
          ))}
        </div>
      </aside>

      <section className="notes-app__editor">
        {activeNote ? (
          <div>
            <div className="notes-app__editor-toolbar">
              <input
                type="text"
                value={activeNote.title}
                onChange={(event) => updateActiveNote({ title: event.target.value })}
                placeholder="Title"
                aria-label="Note title"
              />
              <button type="button" onClick={() => deleteNote(activeNote.id)}>
                Delete
              </button>
            </div>

            <textarea
              value={activeNote.body}
              onChange={(event) => updateActiveNote({ body: event.target.value })}
              placeholder="Write your note here..."
              rows={16}
            />

            <footer className="notes-app__meta">
              <small>Created {formatTimestamp(activeNote.createdAt)}</small>
              <small>Updated {formatTimestamp(activeNote.updatedAt)}</small>
            </footer>
          </div>
        ) : (
          <div className="notes-app__empty">
            <h3>Select or create a note</h3>
            <p>Choose a note from the list or start a new one.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export const NotesApp: MiniAppDefinition = {
  id: "notes",
  name: "Notes",
  description: "Capture quick notes and ideas.",
  icon: "📝",
  component: Notes
};

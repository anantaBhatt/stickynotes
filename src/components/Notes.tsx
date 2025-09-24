import { useEffect, useState } from "react";
import Note from "./Note";

// Type definition for each sticky note
export type NoteType = {
  id: string;      
  x: number;  
  y: number;
  width: number;
  height: number;
  text?: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [scale, setScale] = useState(1);

    //Logic for double click to create a note
  const handleBoardDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Prevent creating a note if double click inside a node
    if (target.closest("[data-testid='note']")) return;

    // Get click position relative to the board
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Create a new note object
    const newNote: NoteType = {
      id: Date.now().toString(), // simple unique id based on timestamp
      x,
      y,
      width: 200,
      height: 150,
    };

    // Add the new note to the state
    setNotes([...notes, newNote]);
  };


  const updateNote = (id: string, updated: Partial<NoteType>) => {
    //delete the note if width is -1 (flagged by child for deletion)
    if (updated.width === -1) {
      setNotes(notes.filter((note) => note.id !== id)); // delete
    } else {
      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, ...updated } : note
        )
      );
    }
  };

  return (
    <div>
      <p>Double click anywhere on empty space to create a note</p> 
      <div
        id="trash-bin"
        style={{
          position: "absolute",
          right: 20,
          width: 80,
          height: 80,
          backgroundColor: "#e53935",
          borderRadius: "8px",
          textAlign: "center",
          lineHeight: "80px",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Bin
      </div>

      <div
        id="board-area"
        onDoubleClick={handleBoardDoubleClick}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",         // take full viewport height
          overflow: "hidden",      // prevent scrollbars

        }}
      >
        {notes.map((note) => (
          <Note key={note.id} note={note} onUpdate={updateNote} />
        ))}
      </div>
    </div>
  );
}

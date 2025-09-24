import { useState } from "react";
import type { NoteType } from "./Notes";

type Props = {
  note: NoteType;
  onUpdate: (id: string, updated: Partial<NoteType>) => void;
};

export default function Note({ note, onUpdate }: Props) {
  const [dragging, setDragging] = useState(false);
 const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text || "");

//Save text when clicking outside the textarea
  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(note.id, { text }); // save text to parent (Board)
  };
  // drag note logic
  const onMouseDown = (e: React.MouseEvent) => {
  //Dont start drag if clicking on a resize handle
    if ((e.target as HTMLElement).dataset.handle) return;
    setDragging(true);
    const startX = e.clientX - note.x;
    const startY = e.clientY - note.y;

const onMouseMove = (moveEvent: MouseEvent) => {
  const board = document.getElementById("board-area");
  if (!board) return;

  const boardRect = board.getBoundingClientRect();
  const noteWidth = note.width;
  const noteHeight = note.height;

  //Adding a margin so note doesn't get lost at edges
  const margin = 40;

  // Calculate new position
  let newX = moveEvent.clientX - startX;
  let newY = moveEvent.clientY - startY;

  // Clamp within visible area (with margin)
  newX = Math.max(-noteWidth + margin, Math.min(newX, boardRect.width - margin));
  newY = Math.max(-noteHeight + margin, Math.min(newY, boardRect.height - margin));

  onUpdate(note.id, { x: newX, y: newY });
};

    const onMouseUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      // check for bin overlap to delete the note
      const bin = document.getElementById("trash-bin");
      if (bin) {
        const binRect = bin.getBoundingClientRect();
        const noteRect = (
          document.querySelector(`[data-id="${note.id}"]`) as HTMLElement
        )?.getBoundingClientRect();

        if (
          noteRect &&
          noteRect.right > binRect.left &&
          noteRect.left < binRect.right &&
          noteRect.bottom > binRect.top &&
          noteRect.top < binRect.bottom
        ) {
          onUpdate(note.id, { width: -1 }); // signal delete to parent
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // resize logic for all corners
  const onResizeMouseDown = (
    e: React.MouseEvent,
    corner: "tl" | "tr" | "bl" | "br"
  ) => {
    e.stopPropagation();//  prevent triggering drag
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;
    const startLeft = note.x;
    const startTop = note.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (corner === "br") {
        newWidth = startWidth + dx;
        newHeight = startHeight + dy;
      } else if (corner === "bl") {
        newWidth = startWidth - dx;
        newX = startLeft + dx;
        newHeight = startHeight + dy;
      } else if (corner === "tr") {
        newWidth = startWidth + dx;
        newHeight = startHeight - dy;
        newY = startTop + dy;
      } else if (corner === "tl") {
        newWidth = startWidth - dx;
        newX = startLeft + dx;
        newHeight = startHeight - dy;
        newY = startTop + dy;
      }
//Minimum size limits so user can still see and interact with the note
      onUpdate(note.id, {
        x: newX,
        y: newY,
        width: Math.max(100, newWidth),
        height: Math.max(80, newHeight),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
  <div
      data-testid="note"
      data-id={note.id}
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        backgroundColor: "#ffeb3b",
        border: "1px solid #999",
        boxSizing: "border-box",
        padding: "8px",
        cursor: isEditing ? "text" : "grab",
        overflow: "hidden"
      }}
      onMouseDown={onMouseDown}
    >
      {isEditing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur} // save when clicking outside
          style={{
            width: "100%",
            height: "100%",
            resize: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "14px",
          }}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          style={{
            width: "100%",
            height: "100%",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        >
          {text || "Click to add text..."}
        </div>
      )}
    

      {/* four resize handles for all 4 corners */}
      <div
        data-handle="resize"
        onMouseDown={(e) => onResizeMouseDown(e, "tl")}
        style={handleStyle("top", "left", "nwse-resize")}
      />
      <div
        data-handle="resize"
        onMouseDown={(e) => onResizeMouseDown(e, "tr")}
        style={handleStyle("top", "right", "nesw-resize")}
      />
      <div
        data-handle="resize"
        onMouseDown={(e) => onResizeMouseDown(e, "bl")}
        style={handleStyle("bottom", "left", "nesw-resize")}
      />
      <div
        data-handle="resize"
        onMouseDown={(e) => onResizeMouseDown(e, "br")}
        style={handleStyle("bottom", "right", "nwse-resize")}
      />
    </div>
  );
}


function handleStyle(
  vertical: "top" | "bottom",
  horizontal: "left" | "right",
  cursor: string
): React.CSSProperties {
  return {
    position: "absolute",
    [vertical]: "-6px",
    [horizontal]: "-6px",
    width: "12px",
    height: "12px",
    background: "#333",
    cursor,
  };
}

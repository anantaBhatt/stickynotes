

############FEATURE################
Create notes by double clicking on empty space
Edit notes by clicking inside and typing
Drag notes around the board
Resize notes from any corner
Delete notes by dragging them into the bin
Notes stay visible (never disappear completely offscreen)


################RUN PROJECT################

cd stickynotes
npm install 
npm run dev


################DESCRIPTION##################
Data flow is simple:
Notes owns the data passes it down as props.
Note send changes back up using callbacks.

The app is built in React with TypeScript, and the design is kept pretty simple. There are basically two main components: the Notes and the Note. The Notes component holds the state for all notes, takes care of creating new ones when you double click, and updates or deletes them when needed. Each Note is responsible for its own behavior, like dragging, resizing from the corners, and editing text. Whenever something changes, the Note just tells the Notes, and the Notes updates the overall state.

I went with this setup because it keeps the data flow clean and easy to explain: state lives in one place (the Notes), data goes down into each Note via props, and updates back up through callbacks. This way I dont have to worry about multiple sources of truth or syncing problems. On top of that, I added some safeguards so notes dont disappear off screen completely, and you can always grab them back.

Overall, the architecture is simple enough to extend if needed, for example, adding persistence with localStorage or even plugging into an API later.

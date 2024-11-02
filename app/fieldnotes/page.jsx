
import React, { useState } from 'react';
import FieldNoteModalCardsModal from '../_components/FieldNoteModalCardsModal/FieldNoteModalCardsModal';
import ChatApp from '../_components/ChatApp/page';

function FieldNotesPage() {
  const [showChat, setShowChat] = useState(false);
  const [chatRoomName, setChatRoomName] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);

  // ... other state and logic

  return (
    <div>
      {/* ... other components */}

      {isModalOpen && (
        <FieldNoteModalCardsModal
          onClose={handleCloseModal}
          note={selectedNote}
          token={token}
          setShowChat={setShowChat}
          setChatRoomName={setChatRoomName}
          setAssignedUsers={setAssignedUsers}
        />
      )}

      {showChat && (
        <ChatApp
          chatRoomName={chatRoomName}
          assignedUsers={assignedUsers}
        />
      )}
    </div>
  );
}

export default FieldNotesPage;
function FieldNoteModalCardsModal({ onClose, note, token, setShowChat, setChatRoomName, setAssignedUsers }) {
  // ... existing code

  const handleSave = () => {
    const updateData = {
      // ... existing updateData
    };

    dispatch(updateTask({ taskId: localNote._id, updateData }))
      .unwrap()
      .then(() => {
        setIsEditing(false);

        // Update chat visibility and data in the parent component
        if (localNote.assignee) {
          setShowChat(true);
          setChatRoomName(localNote.username);
          setAssignedUsers([localNote.userId, localNote.assignee]);
        } else {
          setShowChat(false);
        }
      })
      .catch((error) => {
        console.error('Failed to update task:', error);
      });
  };

  // ... rest of the component code

  // Remove the ChatApp component from here

  return (
    // ... existing JSX
  );
}function FieldNoteModalCardsModal({ onClose, note, token, setShowChat, setChatRoomName, setAssignedUsers }) {
  // ... existing code

  const handleSave = () => {
    const updateData = {
      // ... existing updateData
    };

    dispatch(updateTask({ taskId: localNote._id, updateData }))
      .unwrap()
      .then(() => {
        setIsEditing(false);

        // Update chat visibility and data in the parent component
        if (localNote.assignee) {
          setShowChat(true);
          setChatRoomName(localNote.username);
          setAssignedUsers([localNote.userId, localNote.assignee]);
        } else {
          setShowChat(false);
        }
      })
      .catch((error) => {
        console.error('Failed to update task:', error);
      });
  };

  // ... rest of the component code

  // Remove the ChatApp component from here

  return (
    // ... existing JSX
  );
}function FieldNoteModalCardsModal({ onClose, note, token, setShowChat, setChatRoomName, setAssignedUsers }) {
  // ... existing code

  const handleSave = () => {
    const updateData = {
      // ... existing updateData
    };

    dispatch(updateTask({ taskId: localNote._id, updateData }))
      .unwrap()
      .then(() => {
        setIsEditing(false);

        // Update chat visibility and data in the parent component
        if (localNote.assignee) {
          setShowChat(true);
          setChatRoomName(localNote.username);
          setAssignedUsers([localNote.userId, localNote.assignee]);
        } else {
          setShowChat(false);
        }
      })
      .catch((error) => {
        console.error('Failed to update task:', error);
      });
  };

  // ... rest of the component code

  // Remove the ChatApp component from here

  return (
    // ... existing JSX
  );
}
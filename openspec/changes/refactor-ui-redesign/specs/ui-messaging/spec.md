## ADDED Requirements

### Requirement: Conversation List
The messaging interface SHALL display a list of conversations using the Item/ItemGroup pattern.

#### Scenario: Conversation list display
- **GIVEN** a user with existing conversations
- **WHEN** they visit the messages page
- **THEN** conversations are displayed as a list with avatar, name, last message preview, and timestamp

#### Scenario: Conversation item structure
- **GIVEN** a conversation in the list
- **WHEN** it renders
- **THEN** it uses ItemMedia (avatar), ItemContent (name, preview), and optional ItemActions (unread badge)

#### Scenario: Unread indicator
- **GIVEN** a conversation with unread messages
- **WHEN** the conversation list renders
- **THEN** an unread badge or indicator is visible on that conversation item

#### Scenario: Empty conversations state
- **GIVEN** a user with no conversations
- **WHEN** they visit the messages page
- **THEN** an Empty component displays with icon, title, and description

#### Scenario: Conversation selection
- **GIVEN** a conversation in the list
- **WHEN** the user clicks on it
- **THEN** they navigate to the conversation thread view

### Requirement: Message Thread View
The messaging interface SHALL display a conversation thread with proper message bubbles.

#### Scenario: Thread layout
- **GIVEN** a conversation thread
- **WHEN** it renders
- **THEN** messages are displayed in a scrollable container, newest at bottom

#### Scenario: Sent vs received styling
- **GIVEN** messages in a thread
- **WHEN** they render
- **THEN** sent messages appear on the right with accent background, received on left with muted background

#### Scenario: Message metadata
- **GIVEN** a message in the thread
- **WHEN** it renders
- **THEN** it shows timestamp, and optionally read status for sent messages

#### Scenario: Property context
- **GIVEN** a conversation about a specific property
- **WHEN** the thread renders
- **THEN** a property card or summary is shown at the top of the thread

#### Scenario: Auto-scroll on new message
- **GIVEN** an open conversation thread
- **WHEN** a new message arrives
- **THEN** the view scrolls to show the new message

### Requirement: Message Composer
The messaging interface SHALL provide a message input using the InputGroup pattern.

#### Scenario: Composer structure
- **GIVEN** the message composer
- **WHEN** it renders
- **THEN** it uses InputGroupTextarea with InputGroupButton for send action

#### Scenario: Send button
- **GIVEN** text entered in the composer
- **WHEN** user clicks send or presses Enter
- **THEN** the message is sent and the input clears

#### Scenario: Empty input prevention
- **GIVEN** an empty composer input
- **WHEN** user tries to send
- **THEN** nothing is sent (button disabled or no action)

#### Scenario: Mobile keyboard handling
- **GIVEN** a mobile viewport
- **WHEN** the composer input is focused
- **THEN** the keyboard opens and the view adjusts to keep composer visible

### Requirement: Real-time Updates
The messaging interface SHALL update in real-time when new messages arrive.

#### Scenario: New message notification
- **GIVEN** an open conversation
- **WHEN** the other party sends a message
- **THEN** the message appears immediately without page refresh

#### Scenario: Conversation list update
- **GIVEN** the conversation list view
- **WHEN** a new message arrives in any conversation
- **THEN** the conversation moves to top and shows updated preview

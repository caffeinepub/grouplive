# GroupLive

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Landing page with two buttons: "Group" and "Fan"
- Group flow: select your group from a list, enter passcode (8945), then access a dashboard with a Live toggle and a group chat
- Fan flow: browse all groups, see which are live, watch the live stream indicator, and chat with a group
- Groups can go live (toggle their live status on/off)
- Real-time-style chat per group (stored messages in backend)
- Passcode protection for group login (hardcoded: 8945)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: groups store (name, isLive, passcode), chat messages per group, APIs: getGroups, goLive, endLive, sendMessage, getMessages, verifyPasscode
2. Frontend landing page: two big buttons (Group / Fan)
3. Group selection page (shared): list of groups to choose from
4. Group dashboard (after passcode): toggle live on/off, view chat, send messages
5. Fan view: list of groups, highlight live ones, enter group to watch and chat
6. Chat component shared between group and fan views

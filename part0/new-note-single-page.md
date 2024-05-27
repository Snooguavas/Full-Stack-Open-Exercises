```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Type a note into the text field
    user->>browser: Click the "Save" button
    Note right of browser: JavaScript captures the form data and sends an AJAX POST request

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa with note data
    activate server
    server-->>browser: HTTP 201 Created
    deactivate server

    Note right of browser: The browser updates the note list dynamically

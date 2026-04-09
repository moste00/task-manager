# Task Manager

A beautifully designed, deeply robust, and completely offline-first personal task manager built with **React**, **Vite**, and **Framer Motion**.

## Features

- **Rich Timeline Organization**: Automatically organizes tasks into precise chronological buckets (e.g., *Today*, *Yesterday*, *Earlier This Week*, *A Long Time Ago*) with clean visual separators.
- **Deep Media Integration**:
  - Attach images, videos, spreadsheets, and PDFs infinitely.
  - Automatically generates intelligent visual layouts, like a 2x2 collage grid for images.
  - Natively extracts visual thumbnail previews out of raw `.mp4` and video files. 
- **True Offline Safety**:
  - Leverages efficient, passive `localStorage` binding hooked into background browser tabs to perfectly sequence and preserve text data safely without unnecessary write operations.
  - Media payloads are safely bypassed into **IndexedDB** securely to handle extreme file sizes without exploding local quotas, loading asynchronously on demand.
- **Exporting Options (2x2 Matrix)**: Export any view (Recycle Bin OR Active) as cleanly parsed Markdown (`.md`) or Spreadsheet (`.csv`), with the dynamic option to download all embedded media perfectly natively.
- **Fluid UI**: Completely architected to take advantage of `framer-motion` for spring-loaded "card-throw" mechanics when sending tasks to the trash, layout sorting arrays, and cleanly fading component lifecycles.

---

## Task Array Lifecycle & Architecture

The application acts as a linear append-only timeline representing your history, tracking the exact lifecycle of individual entities:
┌─────────────────┐ <br>
│  Task [Newest]  │ <br>
├─────────────────┤ <br>
│  Task [Recent]  │ <br>
├─────────────────┤ <br>
│  Task [Older]   │ <br>
├─────────────────┤ <br>
│  Task [Oldest]  │ <br>
└─────────────────┘ <br>

      Array of tasks, the single source of truth for the entire app.
      
```mermaid
graph TD
    subgraph "Single Task Lifecycle"
        TL((Task Payload)) --> |"Created"| A[Active]
        
        A -- ".toggleCompleteTask()" <--> C[Completed]
        
        A -- ".softDeleteTask()" --> SD["Soft Deleted - Moved to Recycle Bin (Still stored in the array above with a status flag)"]
        
        SD -- ".restoreSoftDeletedTask()" --> A
        
        SD -- ".hardDeleteTask() / .wipeBin()" --> HD["Destroyed - Blob Media Garbage Collected from IndexedDB"]
    end
```

The array is the sole source of truth for the entire app. Both the recycle bin and the various persistence options (localstorage and IndexedDB) are copies or views of the underlying single source of truth.
---

## Quick Start
To run this repository locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

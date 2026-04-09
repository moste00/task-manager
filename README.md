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

```mermaid
graph TD
    subgraph "Task Array (Chronologically Sorted)"
        T1["Task [Newest]"] --> T2["Task [Recent]"]
        T2 --> T3["Task [Older]"]
        T3 --> TN["Task [Oldest]"]
        
        T2 -. "Inspect State" .-> TL
    end

    subgraph "Single Task Lifecycle"
        TL((Task Payload)) --> |"Created"| A[Active]
        
        A -- ".toggleCompleteTask()" <--> C[Completed]
        
        A -- ".softDeleteTask()" --> SD[Soft Deleted<br/>(Moved to Recycle Bin)]
        C -- ".softDeleteTask()" --> SD
        
        SD -- ".restoreSoftDeletedTask()" --> A
        
        SD -- ".hardDeleteTask() / .wipeBin()" --> HD[Destroyed <br/><br/> *Blob Media Garbage<br/> Collected from IndexedDB*]
    end
```

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

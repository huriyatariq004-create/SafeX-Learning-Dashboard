## SafeX Learning Dashboard

A complete **Learning Dashboard** module for the SafeX Educational Platform. This dashboard allows users to browse, watch, and track educational videos with progress tracking, bookmarks, and personalized recommendations.

## Features

- **Video Browsing** – Explore educational videos by category
- **Continue Watching** – Resume videos from where you left off
- **Progress Tracking** – Watch progress is automatically saved
- **Bookmarks** – Save favorite videos for later
- **Personalized Recommendations** – Get video suggestions based on your watch history
- **Search** – Find videos by title, channel, or category
- **Category Filtering** – Filter videos by topic (Programming, Cybersecurity, Data Science, etc.)
- **Responsive Design** – Works on desktop, tablet, and mobile, including a mobile slide-in navigation drawer
- **Light/Dark Theme** – Toggle between light and dark mode

## Technologies Used

| Layer | Technology |
|---|---|
| **Frontend** | React, Tailwind CSS, Lucide Icons |
| **Backend API** | ASP.NET Core 8.0, Entity Framework Core |
| **Database** | SQL Server |
| **State Management** | React Context API |
| **Styling** | Tailwind CSS |



## Getting Started

Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

## Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/huriyatariq004-create/SafeX-Learning-Dashboard.git
   cd Learning System/Backend/SafeXApi
   ```

2. **Update the connection string** in `appsettings.json`
   ```json
   "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SafeX_Education_DB_FINAL;Trusted_Connection=True;TrustServerCertificate=True;"
   ```

3. **Create the database** by running `SafeX_Module304_Database.sql` against your SQL Server instance (via SSMS or Azure Data Studio).

4. **Restore packages and run**
   ```bash
   dotnet restore
   dotnet run
   ```
   API runs at: `http://localhost:5000`


## Frontend Setup

1. **Navigate to the frontend folder**
   ```bash
   cd ../../Frontend/dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React app**
   ```bash
   npm start
   ```
   Dashboard runs at: `http://localhost:3000`



##Database Schema

| Table | Purpose |
|---|---|
| `Users` | User accounts and authentication |
| `Categories` | Video categories (shared with Category Management module) |
| `Videos` | YouTube video data |
| `WatchHistory` | User watch progress |
| `Bookmarks` | Saved videos |
| `Recommendations` | Personalized suggestions |
| `ActivityLog` | Runtime activity tracking (plays, searches, bookmarks) |

License

This project is for educational purposes as part of the SafeX Educational Learning Platform internship.



## Author

**Huriyat Tariq**
GitHub: [@huriyatariq004-create](https://github.com/huriyatariq004-create)

 Acknowledgments

- **SafeX Team** – For providing the platform and requirements
- **freeCodeCamp** – For the educational YouTube videos

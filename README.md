# SQLite-Viewer

[![GitHub license](https://img.shields.io/github/license/bjmdevelopers/SQLite-Viewer)](https://github.com/bjmdevelopers/SQLite-Viewer/blob/main/LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-SQLite--Viewer-green)](https://bjmdevelopers.github.io/SQLite-Viewer/)
[![GitHub issues](https://img.shields.io/github/issues/bjmdevelopers/SQLite-Viewer)](https://github.com/bjmdevelopers/SQLite-Viewer/issues)
[![GitHub stars](https://img.shields.io/github/stars/bjmdevelopers/SQLite-Viewer)](https://github.com/bjmdevelopers/SQLite-Viewer/stargazers)

A powerful, 100% client-side SQLite database viewer that runs entirely in your browser. No server, no installation, and no data ever leaves your computer.

![SQLite-Viewer Demo GIF](https://i.imgur.com/your-demo.gif) *A brief demonstration of opening a database and running a query.*

## ✨ Features

-   **🖥️ Purely Browser-Based:** Operates entirely on the client-side. Your data stays private.
-   **📂 Open Local `.db` Files:** Directly open and view SQLite database files from your computer.
-   **🔍 Browse Data & Schema:** Intuitively navigate through tables and view their structure.
-   **✏️ Powerful Query Editor:** Execute custom SQL queries with syntax highlighting.
-   **💾 Works Offline:** Fully functional without an internet connection after the initial page load.
-   **🚀 Powered by WebAssembly:** Leverages the power of SQLite compiled to WebAssembly for native-like performance.
-   **📱 Responsive Design:** Use it on your desktop, tablet, or mobile device.

## 🚀 How to Use

1.  **Navigate** to the [live demo](https://bjmdevelopers.github.io/SQLite-Viewer/).
2.  **Click "Open Database"** and select a SQLite (`.db`, `.sqlite`, `.sqlite3`) file from your local machine.
3.  **Explore your data:**
    * Click on a table name in the sidebar to view its contents.
    * Switch to the "Schema" tab to inspect the table's structure.
4.  **Run Custom Queries:**
    * Go to the "Query" tab.
    * Write your SQL query in the editor.
    * Click "Run Query" to see the results.

## 🛠️ Development

Interested in contributing or running the project locally?

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bjmdevelopers/SQLite-Viewer.git](https://github.com/bjmdevelopers/SQLite-Viewer.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd SQLite-Viewer
    ```
3.  **Open `index.html`** in your favorite web browser. That's it!

## 💻 Technologies Used

* **SQLite compiled to WebAssembly (WASM):** This is the core of the application, allowing us to run the SQLite engine directly in the browser with near-native speed.
* **Vanilla JavaScript:** No frameworks were used, keeping the application lightweight and fast. All interactions and logic are handled with plain JavaScript.
* **HTML5 & CSS3:** For the application's structure and styling, including the use of Flexbox and Grid for a responsive layout.

## 🔮 Future Improvements

We have a lot of exciting features planned:

-   **[ ] ✍️ Table Data Editing:** Allow users to directly edit, add, and delete rows.
-   **[ ] 📤 Data Export/Import:** Support for exporting tables or query results to formats like CSV and JSON.
-   **[ ] 🎨 Dark Mode:** A toggle for a more eye-friendly dark theme.
-   **[ ] 📊 Data Visualization:** Basic charting capabilities for query results.

Have an idea? Feel free to [open an issue](https://github.com/bjmdevelopers/SQLite-Viewer/issues)!

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve SQLite-Viewer, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT © [bjmdevelopers](https://github.com/bjmdevelopers)

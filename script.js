// --- Global Variables ---
let db = null; // To hold the database instance
let editor; // To hold the CodeMirror editor instance

// --- DOM Element References ---
const dbFileInput = document.getElementById('dbFile');
const messageElem = document.getElementById('message');
const tableListElem = document.getElementById('table-list');
const executeQueryBtn = document.getElementById('execute-query');
const resultsElem = document.getElementById('results');
const dbViewerContainer = document.getElementById('db-viewer-container');
const queryStatusElem = document.getElementById('query-status');
const themeToggle = document.getElementById('theme-toggle');

// --- Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the CodeMirror SQL editor
    editor = CodeMirror(document.getElementById('sqlQueryContainer'), {
        mode: 'text/x-sql',
        lineNumbers: true,
        theme: 'default',
        value: '-- Load a database and click a table to start exploring',
        readOnly: 'nocursor' // Initially disable the editor
    });

    // Set up the theme toggler
    themeToggle.addEventListener('click', toggleTheme);
    
    // Set initial theme based on user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        updateTheme();
    }
});


// --- Event Listeners ---
dbFileInput.addEventListener('change', handleFileSelect);
executeQueryBtn.addEventListener('click', executeQuery);


// --- Core Functions ---

/**
 * Toggles the color theme between light and dark mode.
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    updateTheme();
}

/**
 * Updates UI elements based on the current theme (e.g., editor, icon).
 */
function updateTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    editor.setOption('theme', isDarkMode ? 'material-darker' : 'default');
    themeToggle.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

/**
 * Handles the database file selection, loading, and initialization.
 */
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    resetUI();
    messageElem.textContent = `Loading ${file.name}...`;

    try {
        // Initialize sql.js library, pointing to the wasm file
        const SQL = await initSqlJs({ locateFile: () => `sql-wasm.wasm` });
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const Uints = new Uint8Array(e.target.result);
                db = new SQL.Database(Uints);
                
                // Enable UI elements now that the database is loaded
                editor.setOption('readOnly', false);
                executeQueryBtn.disabled = false;
                
                messageElem.textContent = `${file.name} loaded successfully!`;
                messageElem.style.color = 'var(--color-success)';
                
                loadTables();

            } catch (err) {
                showError(`Error loading database: ${err.message}`);
            }
        };
        reader.readAsArrayBuffer(file);

    } catch (err) {
        showError(`Failed to initialize SQL.js: ${err.message}. Ensure sql-wasm.wasm is in the same folder.`);
    }
}

/**
 * Fetches and displays the list of tables from the loaded database.
 */
function loadTables() {
    if (!db) return;
    try {
        const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
        const tables = [];
        while (stmt.step()) {
            tables.push(stmt.get()[0]);
        }
        stmt.free();

        tableListElem.innerHTML = '';
        if (tables.length === 0) {
            tableListElem.innerHTML = '<li class="no-data">No tables found.</li>';
            return;
        }

        tables.forEach(tableName => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-table"></i>${tableName}`;
            li.addEventListener('click', (e) => {
                document.querySelectorAll('#table-list li').forEach(item => item.classList.remove('active'));
                e.currentTarget.classList.add('active');
                editor.setValue(`SELECT * FROM "${tableName}" LIMIT 100;`);
                executeQuery();
            });
            tableListElem.appendChild(li);
        });

        // Automatically click the first table to show its contents
        if (tables.length > 0) {
            tableListElem.firstElementChild.click();
        }

    } catch (error) {
        showError(`Error loading tables: ${error.message}`);
    }
}

/**
 * Executes the SQL query from the editor and displays the results.
 */
function executeQuery() {
    if (!db) {
        showError("No database loaded.");
        return;
    }

    const query = editor.getValue().trim();
    if (!query) {
        showError("Please enter a SQL query.");
        return;
    }

    resultsElem.innerHTML = '';
    queryStatusElem.textContent = 'Executing...';

    // Use a small timeout to allow the UI to update before a long query blocks the main thread
    setTimeout(() => {
        try {
            const startTime = performance.now();
            const res = db.exec(query);
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);

            if (!res.length) {
                resultsElem.innerHTML = '<p class="no-data">Query executed successfully, but returned no data.</p>';
                queryStatusElem.textContent = `Query took ${duration} ms`;
                return;
            }

            const { columns, values } = res[0];
            resultsElem.innerHTML = createTableHTML(columns, values);
            queryStatusElem.textContent = `${values.length} rows returned in ${duration} ms.`;

        } catch (error) {
            resultsElem.innerHTML = `<p class="no-data" style="color: var(--color-danger);">${error.message}</p>`;
            queryStatusElem.textContent = `Error executing query.`;
        }
    }, 10);
}


// --- UI Helper Functions ---

/**
 * Resets the UI to its initial state when a new file is loaded.
 */
function resetUI() {
    db = null;
    tableListElem.innerHTML = '<li class="no-data">Load a database to see tables</li>';
    resultsElem.innerHTML = '<p class="no-data">Results will appear here</p>';
    queryStatusElem.textContent = '';
    editor.setValue('-- Load a database and click a table to start exploring');
    editor.setOption('readOnly', 'nocursor');
    executeQueryBtn.disabled = true;
}

/**
 * Displays an error message to the user.
 * @param {string} message The error message to display.
 */
function showError(message) {
    messageElem.textContent = message;
    messageElem.style.color = 'var(--color-danger)';
    console.error(message);
}

/**
 * Generates an HTML table from SQL query results.
 * @param {string[]} columns Array of column names.
 * @param {Array<any[]>} values 2D array of row values.
 * @returns {string} The HTML string for the results table.
 */
function createTableHTML(columns, values) {
    let tableHtml = '<table><thead><tr>';
    columns.forEach(col => tableHtml += `<th>${col}</th>`);
    tableHtml += '</tr></thead><tbody>';
    values.forEach(row => {
        tableHtml += '<tr>';
        row.forEach(cell => tableHtml += `<td>${cell !== null ? cell : 'NULL'}</td>`);
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
}

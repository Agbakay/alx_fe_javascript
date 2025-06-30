document.addEventListener("DOMContentLoaded", () => {
  // --- DATA ---
  let quotes = [
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" },
    {
      text: "You only live once, but if you do it right, once is enough.",
      category: "Life",
    },
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      category: "Inspiration",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      category: "Inspiration",
    },
    {
      text: "Your time is limited, so don't waste it living someone else's life.",
      category: "Wisdom",
    },
    {
      text: "If you look at what you have in life, you'll always have more.",
      category: "Wisdom",
    },
  ];

  // --- DOM ELEMENTS ---
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const categoryFilter = document.getElementById("categoryFilter");
  const exportBtn = document.getElementById("exportQuotes");
  const importFile = document.getElementById("importFile");
  const serverNotification = document.getElementById("serverNotification");

  // --- FUNCTIONS ---

  /**
   * Saves quotes array and last filter to local storage.
   */
  function saveState() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    localStorage.setItem("lastFilter", categoryFilter.value);
  }

  /**
   * Loads quotes and last filter from local storage on startup.
   */
  function loadState() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
    const lastFilter = localStorage.getItem("lastFilter");
    if (lastFilter) {
      categoryFilter.value = lastFilter;
    }
  }

  /**
   * Displays a random quote based on the current filter.
   */
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(
        (quote) => quote.category === selectedCategory
      );
    }

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = `<p>No quotes available for this category. Add one!</p>`;
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    // Add fade-in class for animation
    quoteDisplay.innerHTML = `
            <p class="fade-in">"${quote.text}"</p>
            <p class="fade-in">- ${quote.category}</p>
        `;

    // Optional: Store last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  }

  /**
   * Populates the category filter dropdown with unique categories.
   */
  function populateCategories() {
    const categories = [
      "all",
      ...new Set(quotes.map((quote) => quote.category)),
    ];
    const currentFilter = categoryFilter.value;

    categoryFilter.innerHTML = ""; // Clear existing options

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category === "all" ? "All Categories" : category;
      categoryFilter.appendChild(option);
    });

    // Restore previous selection if it still exists
    if (categories.includes(currentFilter)) {
      categoryFilter.value = currentFilter;
    } else {
      categoryFilter.value = "all";
    }
  }

  /**
   * Adds a new quote from the form inputs.
   */
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      newQuoteText.value = "";
      newQuoteCategory.value = "";

      saveState();
      populateCategories();
      showRandomQuote();
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }

  /**
   * Filters quotes based on the selected category and updates the display.
   */
  function filterQuotes() {
    saveState(); // Save the new filter selection
    showRandomQuote();
  }

  /**
   * Exports the current quotes array to a JSON file.
   */
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Imports quotes from a user-selected JSON file.
   * @param {Event} event - The file input change event.
   */
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (
          Array.isArray(importedQuotes) &&
          importedQuotes.every((q) => q.text && q.category)
        ) {
          quotes.push(...importedQuotes);
          saveState();
          populateCategories();
          showRandomQuote();
          alert("Quotes imported successfully!");
        } else {
          alert(
            "Invalid JSON format. Please ensure it is an array of quote objects."
          );
        }
      } catch (error) {
        alert(
          "Error reading or parsing the file. Please check the file format."
        );
        console.error("Import error:", error);
      }
    };
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0]);
    }
  }

  // --- SERVER SYNC SIMULATION ---

  /**
   * Simulates fetching data from a server without a real network request.
   */
  async function fetchFromServer() {
    console.log("Checking for server updates...");
    // This is a mock fetch. It simulates a network call.
    return new Promise((resolve) => {
      setTimeout(() => {
        // This data simulates what would come from a server.
        const serverQuotes = [
          {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            category: "From Server",
          },
          {
            text: "Strive not to be a success, but rather to be of value.",
            category: "From Server",
          },
        ];
        resolve(serverQuotes);
      }, 1000); // Simulate 1 second network delay
    });
  }

  /**
   * Main function to sync with the simulated server.
   */
  async function syncWithServer() {
    try {
      const serverQuotes = await fetchFromServer();
      resolveConflicts(serverQuotes);
    } catch (error) {
      console.error("Failed to sync with server:", error);
    }
  }

  /**
   * Simple conflict resolution: server data overwrites local data.
   * @param {Array} serverQuotes - Quotes fetched from the server.
   */
  function resolveConflicts(serverQuotes) {
    console.log("Applying server data and resolving conflicts...");

    const localQuotes = quotes.filter((q) => q.category !== "From Server");
    quotes = [...localQuotes, ...serverQuotes];

    saveState();
    populateCategories();
    showRandomQuote();

    serverNotification.classList.remove("hidden");
    setTimeout(() => serverNotification.classList.add("hidden"), 5000);
  }

  // --- INITIALIZATION ---

  function initializeApp() {
    loadState();
    populateCategories();
    showRandomQuote();

    // Event Listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    exportBtn.addEventListener("click", exportToJsonFile);
    importFile.addEventListener("change", importFromJsonFile);

    // Periodically check for server updates
    setInterval(syncWithServer, 30000);
    syncWithServer(); // Initial sync
  }

  initializeApp();
});

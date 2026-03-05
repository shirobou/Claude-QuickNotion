export default {
  // Common
  common: {
    back: "← Back",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    done: "Done",
    error: "Error",
    success: "Success",
    copy: "Copy",
  },

  // Main Screen
  main: {
    selectDestination: "Select Destination",
    inputPlaceholder: "Enter text...",
    sendToNotion: "Send to Notion",
    settingsError: "Settings Error",
    settingsErrorMessage:
      "Notion token or destination is not configured. Please set them in Settings.",
    sendFailed: "Send Failed",
    unexpectedError: "An unexpected error occurred.",
  },

  // Settings Screen
  settings: {
    title: "Settings",
    notionToken: "Notion Integration Token",
    overwriteToken: "Overwrite with new token",
    enterToken: "Enter token",
    openIntegrations: "Open Notion Integrations page →",
    deleteToken: "Delete Token",
    deleteTokenConfirm:
      "Delete Notion token? You will need to enter it again.",
    saved: "Saved",
    savedMessage: "Settings have been saved.",

    // Destinations
    destinations: "Destinations",
    addDestination: "+ Add Destination",
    editDestination: "Edit Destination",
    addDestinationTitle: "Add Destination",
    displayName: "Display Name",
    displayNamePlaceholder: "e.g. Task Management",
    databaseId: "Database ID",
    databaseIdPlaceholder: "Database ID or URL",
    titleProperty: "Title Property Name",
    destinationUpdated: "Destination updated.",
    destinationAdded: "Destination added.",
    deleteDestination: "Delete Destination",
    deleteDestinationConfirm: 'Delete "{{name}}"?',
    cannotDelete: "Cannot Delete",
    cannotDeleteMessage: "At least one destination is required.",

    // Templates
    templates: "Templates",
    templateHint: "Show shortcut buttons on the main screen",
    addTemplate: "+ Add Template",
    editTemplate: "Edit Template",
    addTemplateTitle: "Add Template",
    buttonName: "Button Name",
    buttonNamePlaceholder: "e.g. Shopping Memo",
    insertText: "Insert Text",
    insertTextPlaceholder: "e.g. Shopping: ",
    deleteTemplate: "Delete Template",
    deleteTemplateConfirm: 'Delete "{{name}}"?',

    // Input errors
    inputError: "Input Error",
    enterDisplayName: "Please enter a display name.",
    enterDatabaseId: "Please enter a database ID.",
    enterButtonName: "Please enter a button name.",
    enterInsertText: "Please enter insert text.",

    // Theme
    theme: "Theme",
    dark: "Dark",
    light: "Light",

    // Language
    language: "Language",
    japanese: "日本語",
    english: "English",

    // Data management
    dataManagement: "Data Management",
    clearHistory: "Clear Send History",
    clearHistoryConfirm: "Delete all send history?",
    historyCleared: "Send history has been cleared.",
    resetAll: "Reset All Settings",
    resetAllConfirm:
      "All tokens, destinations, and history will be deleted. You will return to the initial setup screen.",

    // Help
    viewGuide: "View Setup Guide",
  },

  // Welcome Screen
  welcome: {
    tagline: "Send text to Notion, instantly.",
    step1Title: "1. Notion Integration Token",
    step1Desc:
      "Create an integration in Notion and copy the token.",
    openIntegrations: "Open Internal Integration page →",
    tokenPlaceholder: "ntn_... or secret_...",
    step2Title: "2. Destination Display Name",
    step2Desc:
      "A name to distinguish multiple destinations. (e.g. Task Management, Reading Notes)",
    destNamePlaceholder: "e.g. Task Management",
    step3Title: "3. Database ID",
    step3Desc:
      "Open the Notion database you want to send to, and copy the ID from the URL or paste the URL directly.",
    step3Hint: "* Don't forget to share the database with the Integration",
    dbIdPlaceholder: "Database ID or URL",
    step4Title: "4. Title Property Name",
    step4Desc:
      'Enter the name of the title column in your database. Usually "Name" or "Title".',
    startButton: "Get Started",
    inputError: "Input Error",
    enterToken: "Please enter a Notion Integration token.",
    enterDbId: "Please enter a database ID.",
    defaultDestName: "Destination 1",
  },

  // History Screen
  history: {
    title: "Send History",
    deleteAll: "Clear All",
    deleteConfirm: "Delete all send history?",
    empty: "No send history",
    settingsError: "Settings Error",
    settingsErrorMessage: "Please check your Notion settings.",
    resent: "Successfully resent.",
    sendFailed: "Send Failed",
    retry: "Retry",
    sending: "Sending...",
  },

  // Help Screen
  help: {
    title: "Setup Guide",

    aboutTitle: "What is Memo Bridge?",
    aboutBody:
      "Memo Bridge is an app that quickly sends text to your Notion databases. Jot down tasks and notes without opening Notion.",

    setupTitle: "Initial Setup",
    setupIntegrationTitle: "1. Create a Notion Integration",
    setupStep1:
      "Open notion.so/profile/integrations/internal in your browser (you can also use the link in the app)",
    setupStep2: 'Click "New integration"',
    setupStep3:
      'Enter a name (e.g. QuickSend) — the word "Notion" cannot be used',
    setupStep4: 'Select "Internal integration" and create',
    setupStep5: "Copy the displayed token (ntn_...)",
    setupWarning:
      'Note: Integration names cannot contain "Notion" or "notion". Use names like "QuickSend" or "MyMemo" instead.',
    setupConnectTitle: "2. Connect to Database",
    setupConnect1: "Open the Notion database you want to send to",
    setupConnect2:
      'Open the "..." menu at top right → "Connections" → Select your Integration',
    setupConnect3: '"Copy link" from the database to get the URL',
    setupConnectWarning:
      "Important: Each destination database needs to be connected to the Integration. When adding a new database, don't forget to set up the connection in Notion.",

    dbIdTitle: "How to Get Database ID",
    dbIdBody:
      'You can paste a Notion URL directly into the "Database ID" field in Settings. The ID will be extracted automatically.',
    dbIdStandalone: "For standalone databases",
    dbIdStandalone1: "Open the database page",
    dbIdStandalone2: "Copy the URL from your browser's address bar",
    dbIdEmbedded: "For databases embedded in a page",
    dbIdEmbedded1:
      'Click the "↗" icon next to the database view tab',
    dbIdEmbedded2:
      "The database opens as a full page — copy that URL",
    dbIdWarning:
      'Common mistake: Page URLs and database URLs are different. If a database is embedded in a page, use the URL from "Open as full page", not the page URL. Using the wrong URL results in a "Database not found" error.',

    titlePropTitle: "About Title Property Name",
    titlePropBody:
      "Every Notion database has one Title-type property. Memo Bridge writes text to this property.",
    titlePropBody2:
      'The default is "Name", but it varies by database. Open the database in Notion and check the title column name.',
    titlePropTip:
      'Example: A task DB might use "Task Name", a subscription DB might use "Service Name". Each database has a different title column name. Make sure it matches exactly.',

    multiDestTitle: "Using Multiple Destinations",
    multiDestBody:
      "You can register multiple destinations (databases) from Settings. Tap the destination selector on the main screen to switch between them.",
    multiDest1: 'Settings → Tap "+ Add Destination"',
    multiDest2: "Enter display name, database ID, and title property name",
    multiDest3:
      "After saving, switch using the selector on the main screen",
    multiDestTip:
      "Each destination needs to be connected to the Integration in Notion. When adding a new database, don't forget to set up the connection.",

    sendTitle: "Sending Text",
    send1: "Select a destination on the main screen",
    send2: "Enter your text",
    send3: 'Tap "Send to Notion"',
    sendBody:
      "When sent successfully, you'll get haptic feedback and the input field will be cleared. View send history from the clipboard icon.",

    troubleTitle: "Troubleshooting",
    trouble1Title: '"Database not found"',
    trouble1Body:
      "• Check that the database ID is correct\n• Confirm you're using a database ID, not a page ID\n• Verify the database is connected to the Integration in Notion",
    trouble2Title: '"Request error"',
    trouble2Body:
      "• Check that the title property name matches the actual column name\n• Watch for full-width vs half-width character differences",
    trouble3Title: '"Invalid token"',
    trouble3Body:
      "• Verify the Integration token is entered correctly in Settings\n• Check the Integration hasn't been deleted in Notion",
  },

  // Toast
  toast: {
    sent: "Sent to Notion",
  },

  // Notion API errors
  api: {
    invalidToken:
      "Invalid Notion token. Please check your Integration token in Settings.",
    dbNotFound:
      "Database not found. Please verify the database is shared with the Integration.",
    requestError:
      "Request error: {{message}}\nPlease check that the title property name is correct.",
    apiError: "API Error ({{status}})",
    apiErrorWithBody: "API Error ({{status}}): {{body}}",
    networkError:
      "Network error: Please check your internet connection.",
    unknownError: "An unknown error occurred",
  },

  // Quick Actions
  quickActions: {
    newMemo: "New Memo",
    history: "Send History",
  },
};

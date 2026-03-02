export default {
  // Common
  common: {
    back: "← 戻る",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    done: "完了",
    error: "エラー",
    success: "成功",
    copy: "コピー",
  },

  // Main Screen
  main: {
    selectDestination: "送信先を選択",
    inputPlaceholder: "テキストを入力...",
    sendToNotion: "Notionに送信",
    settingsError: "設定エラー",
    settingsErrorMessage:
      "Notionトークンまたは送信先が設定されていません。設定画面で入力してください。",
    sendFailed: "送信失敗",
    unexpectedError: "予期しないエラーが発生しました。",
  },

  // Settings Screen
  settings: {
    title: "設定",
    notionToken: "Notion Integrationトークン",
    overwriteToken: "新しいトークンで上書き",
    enterToken: "トークンを入力",
    openIntegrations: "Notion Integrations ページを開く →",
    deleteToken: "トークンを削除",
    deleteTokenConfirm:
      "Notionトークンを削除しますか？再度入力が必要になります。",
    saved: "保存完了",
    savedMessage: "設定を保存しました。",

    // Destinations
    destinations: "送信先",
    addDestination: "＋ 送信先を追加",
    editDestination: "送信先を編集",
    addDestinationTitle: "送信先を追加",
    displayName: "表示名",
    displayNamePlaceholder: "例: タスク管理",
    databaseId: "データベースID",
    databaseIdPlaceholder: "データベースIDまたはURL",
    titleProperty: "タイトルプロパティ名",
    destinationUpdated: "送信先を更新しました。",
    destinationAdded: "送信先を追加しました。",
    deleteDestination: "送信先を削除",
    deleteDestinationConfirm: "「{{name}}」を削除しますか？",
    cannotDelete: "削除不可",
    cannotDeleteMessage: "送信先は最低1件必要です。",

    // Templates
    templates: "テンプレート",
    templateHint: "メイン画面にショートカットボタンを表示します",
    addTemplate: "＋ テンプレートを追加",
    editTemplate: "テンプレートを編集",
    addTemplateTitle: "テンプレートを追加",
    buttonName: "ボタン名",
    buttonNamePlaceholder: "例: 買い物メモ",
    insertText: "挿入テキスト",
    insertTextPlaceholder: "例: 買い物メモ：",
    deleteTemplate: "テンプレートを削除",
    deleteTemplateConfirm: "「{{name}}」を削除しますか？",

    // Input errors
    inputError: "入力エラー",
    enterDisplayName: "表示名を入力してください。",
    enterDatabaseId: "データベースIDを入力してください。",
    enterButtonName: "ボタン名を入力してください。",
    enterInsertText: "挿入テキストを入力してください。",

    // Theme
    theme: "テーマ",
    dark: "ダーク",
    light: "ライト",

    // Language
    language: "言語",
    japanese: "日本語",
    english: "English",

    // Data management
    dataManagement: "データ管理",
    clearHistory: "送信履歴を削除",
    clearHistoryConfirm: "すべての送信履歴を削除しますか？",
    historyCleared: "送信履歴を削除しました。",
    resetAll: "すべての設定をリセット",
    resetAllConfirm:
      "トークン、送信先、履歴がすべて削除されます。初回セットアップ画面に戻ります。",

    // Help
    viewGuide: "使い方ガイドを見る",
  },

  // Welcome Screen
  welcome: {
    tagline: "テキストをNotionに、すばやく送信。",
    step1Title: "1. Notion Integrationトークン",
    step1Desc:
      "Notionでインテグレーションを作成し、トークンをコピーしてください。",
    openIntegrations: "内部インテグレーション作成ページを開く →",
    tokenPlaceholder: "ntn_... または secret_...",
    step2Title: "2. 送信先の表示名",
    step2Desc:
      "複数の送信先を区別するための名前です。（例: タスク管理、読書メモ）",
    destNamePlaceholder: "例: タスク管理",
    step3Title: "3. データベースID",
    step3Desc:
      "送信先のNotionデータベースを開き、URLからIDをコピーするか、URLをそのまま貼り付けてください。",
    step3Hint: "※ データベースをIntegrationと共有するのを忘れずに",
    dbIdPlaceholder: "データベースIDまたはURL",
    step4Title: "4. タイトルプロパティ名",
    step4Desc:
      "データベースのタイトル列の名前を入力してください。通常は「Name」または「名前」です。",
    startButton: "はじめる",
    inputError: "入力エラー",
    enterToken: "Notion Integrationトークンを入力してください。",
    enterDbId: "データベースIDを入力してください。",
    defaultDestName: "送信先1",
  },

  // History Screen
  history: {
    title: "送信履歴",
    deleteAll: "全削除",
    deleteConfirm: "すべての送信履歴を削除しますか？",
    empty: "送信履歴がありません",
    settingsError: "設定エラー",
    settingsErrorMessage: "Notionの設定を確認してください。",
    resent: "再送信しました。",
    sendFailed: "送信失敗",
    retry: "再送信",
    sending: "送信中...",
  },

  // Help Screen
  help: {
    title: "使い方ガイド",

    aboutTitle: "Notion Memoとは？",
    aboutBody:
      "Notion Memoは、テキストをすばやくNotionデータベースに送信するアプリです。思いついたタスクやメモを、Notionを開かずにサッと記録できます。",

    setupTitle: "初期設定",
    setupIntegrationTitle: "1. Notion Integrationの作成",
    setupStep1:
      "ブラウザで notion.so/profile/integrations/internal を開く（アプリ内のリンクからも飛べます）",
    setupStep2: "「新しいインテグレーション」をクリック",
    setupStep3:
      "名前を入力（例: QuickSend）※「Notion」という単語は使えません",
    setupStep4: "「内部インテグレーション」を選択して作成",
    setupStep5: "表示されるトークン（ntn_...）をコピー",
    setupWarning:
      '注意: インテグレーション名に「Notion」「notion」は使用できません。「QuickSend」「MyMemo」などの名前にしてください。',
    setupConnectTitle: "2. データベースとの接続",
    setupConnect1: "送信先にしたいNotionデータベースを開く",
    setupConnect2:
      "右上の「...」メニュー →「接続」→ 作成したIntegration名を選択",
    setupConnect3: "データベースの「リンクをコピー」でURLを取得",
    setupConnectWarning:
      "重要: 送信先のデータベースごとに、Integrationとの接続が必要です。新しいデータベースを追加した場合は、Notion側でも接続設定を忘れずに行ってください。",

    dbIdTitle: "データベースIDの取得方法",
    dbIdBody:
      "設定画面の「データベースID」欄には、NotionのURLをそのまま貼り付けることができます。IDは自動的に抽出されます。",
    dbIdStandalone: "独立したデータベースの場合",
    dbIdStandalone1: "データベースページを開く",
    dbIdStandalone2: "ブラウザのURLバーからURLをコピー",
    dbIdEmbedded: "ページ内に埋め込まれたデータベースの場合",
    dbIdEmbedded1:
      "データベースのビュータブ横にある「↗」アイコンをクリック",
    dbIdEmbedded2:
      "データベースがフルページで開くので、そのURLをコピー",
    dbIdWarning:
      "よくあるミス: ページのURLとデータベースのURLは別物です。ページの中にデータベースが埋め込まれている場合、ページのURLではなく、データベースを「フルページで開く」で表示したURLを使ってください。間違えると「データベースが見つかりません」エラーになります。",

    titlePropTitle: "タイトルプロパティ名について",
    titlePropBody:
      "Notionデータベースには必ず1つ「タイトル」型のプロパティがあります。Notion Memoはこのプロパティにテキストを書き込みます。",
    titlePropBody2:
      "デフォルトでは「Name」ですが、データベースによって異なります。Notionでデータベースを開いて、タイトル列の名前を確認してください。",
    titlePropTip:
      "例: タスク管理DBなら「タスク名」、サブスクDBなら「サービス名」など、データベースごとにタイトル列の名前は異なります。正確に一致させてください。",

    multiDestTitle: "複数の送信先を使う",
    multiDestBody:
      "設定画面から複数の送信先（データベース）を登録できます。メイン画面の送信先セレクターをタップすると、送信先を切り替えられます。",
    multiDest1: "設定画面 →「＋ 送信先を追加」をタップ",
    multiDest2: "表示名、データベースID、タイトルプロパティ名を入力",
    multiDest3: "保存後、メイン画面のセレクターで切り替え可能",
    multiDestTip:
      "送信先ごとにNotion側でIntegrationとの接続が必要です。新しいデータベースを追加したら、Notionでも忘れずに接続してください。",

    sendTitle: "テキストの送信",
    send1: "メイン画面で送信先を選択",
    send2: "テキストを入力",
    send3: "「Notionに送信」ボタンをタップ",
    sendBody:
      "送信が成功すると触覚フィードバックが返り、入力欄がクリアされます。送信履歴はクリップボードアイコンから確認できます。",

    troubleTitle: "トラブルシューティング",
    trouble1Title: "「データベースが見つかりません」",
    trouble1Body:
      "・データベースIDが正しいか確認\n・ページIDではなくデータベースIDを使っているか確認\n・Notion側でデータベースとIntegrationが接続されているか確認",
    trouble2Title: "「リクエストエラー」",
    trouble2Body:
      "・タイトルプロパティ名がデータベースの実際の列名と一致しているか確認\n・全角/半角スペースの違いに注意",
    trouble3Title: "「トークンが無効です」",
    trouble3Body:
      "・設定画面でIntegrationトークンが正しく入力されているか確認\n・Notion側でIntegrationが削除されていないか確認",
  },

  // Toast
  toast: {
    sent: "Notionに送信しました",
  },

  // Notion API errors
  api: {
    invalidToken:
      "Notionトークンが無効です。設定画面でIntegrationトークンを確認してください。",
    dbNotFound:
      "データベースが見つかりません。データベースがIntegrationと共有されているか確認してください。",
    requestError: "リクエストエラー: {{message}}\nタイトルプロパティ名が正しいか確認してください。",
    apiError: "APIエラー ({{status}})",
    apiErrorWithBody: "APIエラー ({{status}}): {{body}}",
    networkError:
      "ネットワークエラー: インターネット接続を確認してください。",
    unknownError: "不明なエラーが発生しました",
  },

  // Quick Actions
  quickActions: {
    newMemo: "新規メモ",
    history: "送信履歴",
  },
};

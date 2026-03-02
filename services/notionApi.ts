import { TFunction } from "i18next";

export type NotionSendResult = {
  success: boolean;
  pageId?: string;
  pageUrl?: string;
  error?: string;
};

export async function sendToNotion(
  token: string,
  databaseId: string,
  text: string,
  titlePropertyName: string = "Name",
  t?: TFunction
): Promise<NotionSendResult> {
  const body = {
    parent: {
      database_id: databaseId,
    },
    properties: {
      [titlePropertyName]: {
        title: [
          {
            text: {
              content: text,
            },
          },
        ],
      },
    },
  };

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage: string;

      try {
        const parsed = JSON.parse(errorBody);
        errorMessage = parsed.message || (t ? t("api.apiError", { status: response.status }) : `API Error (${response.status})`);
      } catch {
        errorMessage = t ? t("api.apiErrorWithBody", { status: response.status, body: errorBody }) : `API Error (${response.status}): ${errorBody}`;
      }

      if (response.status === 401) {
        errorMessage = t ? t("api.invalidToken") : "Invalid Notion token.";
      } else if (response.status === 404) {
        errorMessage = t ? t("api.dbNotFound") : "Database not found.";
      } else if (response.status === 400) {
        errorMessage = t ? t("api.requestError", { message: errorMessage }) : `Request error: ${errorMessage}`;
      }

      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return {
      success: true,
      pageId: data.id,
      pageUrl: data.url,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : (t ? t("api.unknownError") : "Unknown error");

    if (message.includes("Network") || message.includes("fetch")) {
      return {
        success: false,
        error: t ? t("api.networkError") : "Network error.",
      };
    }

    return { success: false, error: message };
  }
}

export function extractDatabaseId(input: string): string {
  const cleaned = input.trim();

  const urlMatch = cleaned.match(
    /notion\.so\/(?:[^/]+\/)?([a-f0-9]{32})/i
  );
  if (urlMatch) return urlMatch[1];

  const urlWithTitleMatch = cleaned.match(
    /notion\.so\/(?:[^/]+\/)?[^?]*?([a-f0-9]{32})/i
  );
  if (urlWithTitleMatch) return urlWithTitleMatch[1];

  const withoutHyphens = cleaned.replace(/-/g, "");
  if (/^[a-f0-9]{32}$/i.test(withoutHyphens)) return withoutHyphens;

  return cleaned;
}

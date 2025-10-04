// utils/apiHelpers.js

export async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function buildErrorMessage(data, fallback = "An error occurred") {
  let message = fallback;

  if (data?.detail) {
    if (Array.isArray(data.detail)) {
      message = data.detail.map(err => err.msg || JSON.stringify(err)).join("; ");
    } else if (data.detail.detail) {
      message = data.detail.detail;
    } else if (typeof data.detail === "string") {
      message = data.detail;
    } else if (data.detail.message) {
      message = data.detail.message;
    }
  } else if (data?.message) {
    message = data.message;
  }

  return message;
}

export async function fetchWithHandling(url, options = {}, fallbackError = "Request failed") {
  const response = await fetch(url, options);
  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(data, fallbackError));
  }

  return data;
}

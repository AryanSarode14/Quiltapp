// Small wrapper around fetch. The browser sends the session cookie
// automatically because the API is on the same origin.
export async function apiFetch(path, { method = "GET", body } = {}) {
  const options = { method, credentials: "same-origin" };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.error || `The server answered with an error (${response.status}).`,
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

export function toQueryString(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      search.set(key, value);
    }
  });
  return search.toString();
}

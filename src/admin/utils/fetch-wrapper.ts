interface Request extends RequestInit {
  body?: any;
}

type ResponseType = "json" | "text" | "blob";

type RequestArgs = {
  url: string;
  baseURL?: string;
  responseType?: ResponseType;
  options?: Request;
};

export class ResponseError extends Error {
  response: Response;
  status: number;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
    this.status = response.status;
  }

  async getResponseBody() {
    try {
      return await this.response.json();
    } catch (error) {
      console.error("Error parsing response body:", error);
      return null;
    }
  }
}

async function fetchWrapper<T>({
  url,
  baseURL = process.env.MEDUSA_ADMIN_API_BASE_URL,
  responseType = "json",
  options = {},
}: RequestArgs): Promise<T> {
  try {
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options.headers,
    };

    const response = await fetch(baseURL + url, {
      ...options,
      headers,
      body: isFormData ? options.body : JSON.stringify(options.body),
    } as Request);

    if (!response.ok) {
      throw new ResponseError(
        "Request failed with status: " + response.status,
        response
      );
    }

    switch (responseType) {
      case "json":
        return response.json() as Promise<T>;
      case "text":
        return response.text() as unknown as T;
      case "blob":
        return response.blob() as unknown as T;
      default:
        throw new Error("Unsupported response type");
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.status === 500) {
        throw new Error("Something went wrong. Please try again later.");
      }
    } else {
      console.error("An unexpected error occurred:", error);
      if (
        typeof error === "object" &&
        (error as any)?.code === "UND_ERR_CONNECT_TIMEOUT"
      ) {
        throw new Error("Network Error: Please check your network connection");
      }
    }

    throw error;
  }
}

export default fetchWrapper;

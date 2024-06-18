import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Vendor from "../types/vendor-types";
import fetchWrapper, { ResponseError } from "../utils/fetch-wrapper";

export function useVendors(
  cursor?: string,
  options: UseQueryOptions<{
    vendors: Vendor[];
    cursor: string | null;
  }> = {}
) {
  const url = cursor ? `/vendor?limit=10&cursor=${cursor}` : `/vendor?limit=10`;

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetchWrapper<{
        vendors: Vendor[];
        cursor: string | null;
      }>({
        url,
      });

      return response;
    },
    ...options,
  });
}

export function useVendorDetails(id: string) {
  const url = `/vendor/${id}`;

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetchWrapper<Vendor>({
        url,
      });

      return response;
    },
  });
}

export function useVendorSearch(
  search: string,
  options: UseQueryOptions<Vendor[]> = {}
) {
  const url = `/vendor/search?q=${search}`;

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetchWrapper<Vendor[]>({
        url,
      });

      return response;
    },
    ...options,
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const response = await fetchWrapper({
        url: `/vendor/${id}`,
        options: {
          method: "DELETE",
        },
      });

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([`/vendor?limit=10`]);
      },
      async onError(error) {
        if (error instanceof ResponseError) {
          // const data = await error.getResponseBody();

          if (error.status === 404) {
            throw new Error("Vendor not found");
          }
        }
      },
    }
  );
}

export function useApproveVendor() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const response = await fetchWrapper({
        url: `/vendor/${id}/approve`,
        options: {
          method: "PATCH",
        },
      });

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([`/vendor?limit=10`]);
      },
      async onError(error) {
        if (error instanceof ResponseError) {
          // const data = await error.getResponseBody();

          if (error.status === 404) {
            throw new Error("Vendor not found");
          }
        }
      },
    }
  );
}

export function useRejectVendor() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const response = await fetchWrapper({
        url: `/vendor/${id}/deny`,
        options: {
          method: "PATCH",
        },
      });

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([`/vendor?limit=10`]);
      },
      async onError(error) {
        if (error instanceof ResponseError) {
          // const data = await error.getResponseBody();

          if (error.status === 404) {
            throw new Error("Vendor not found");
          }
        }
      },
    }
  );
}

export function useSuspendVendor() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const response = await fetchWrapper({
        url: `/vendor/${id}/suspend`,
        options: {
          method: "PATCH",
        },
      });

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([`/vendor?limit=10`]);
      },
      async onError(error) {
        if (error instanceof ResponseError) {
          // const data = await error.getResponseBody();

          if (error.status === 404) {
            throw new Error("Vendor not found");
          }
        }
      },
    }
  );
}

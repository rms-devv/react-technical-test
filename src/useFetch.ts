import { UndefinedInitialDataInfiniteOptions, useInfiniteQuery } from "@tanstack/react-query";
import { parse } from "http-link-header";
import axios, { AxiosRequestConfig } from "axios";

function useFetch<T>(
  config: AxiosRequestConfig,
  options?: Partial<UndefinedInitialDataInfiniteOptions<any, any, any, any, any>>,
) {
  return useInfiniteQuery({
    ...options,
    queryKey: [config],
    queryFn: ({ pageParam: url }) => axios.request<T>({ ...config, url }),
    select(data): T {
      const initialData = data.pages[0].data;
      if (data.pages.length < 2) {
        return initialData;
      }

      return data.pages.reduce((acc, curr, idx) => {
        if (idx === 0) return acc;

        const currData = curr.data;
        if (!(acc instanceof Array && currData instanceof Array)) throw new Error("Invalid paginated data");

        return [...acc, ...currData] as T;
      }, initialData);
    },
    initialPageParam: config.url,
    getNextPageParam: (lastPage) => {
      if (!(lastPage.data instanceof Array && lastPage.headers.link)) return;
      return parse(lastPage.headers.link).get("rel", "next")[0]?.uri;
    },
  });
}

export default useFetch;

import { useEffect, useState } from "react";

export const useCachedData = <T,>(url: string): T | null => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cache = await caches.open("lottie-cache");
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
          setData(await cachedResponse.json());
        } else {
          const response = await fetch(url);
          if (!response.ok) return;
          const json = await response.json();
          await cache.put(url, new Response(JSON.stringify(json)));
          setData(json);
        }
      } catch (error) {
        console.error("useCachedData error:", error);
      }
    };
    fetchData();
  }, [url]);

  return data;
};

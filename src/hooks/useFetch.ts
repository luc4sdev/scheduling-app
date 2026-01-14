import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
type UseFetchProps = {
    url: string;
    options?: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        body?: string;
        headers?: { [key: string]: string };
    };
    cacheKeys?: (string | number)[];
    baseUrl?: string;
};

const useFetch = ({
    url,
    options,
    cacheKeys = [],
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
}: UseFetchProps) => {
    const { data: session } = useSession();
    const queryKey = [...cacheKeys, url];
    const queryFn = async () => {
        if (!session?.user.token) {
            throw new Error('No session token available');
        }
        const fullUrl = `${baseUrl}${url}`;
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    const query = useQuery({ queryKey, queryFn, placeholderData: keepPreviousData });

    return query
};

export default useFetch;

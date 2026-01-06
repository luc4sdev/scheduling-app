import {
    useMutation,
    useQueryClient,
    UseMutationOptions,
    UseMutationResult,
} from '@tanstack/react-query';

type UseMutationHookOptions<TData, TError, TVariables> = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    baseUrl?: string;
    invalidateQueries?: (string | number)[][];
    headers?: Record<string, string>;
} & Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;

export const useMutationHook = <
    TData = void,
    TError = Error,
    TVariables = unknown
>({
    url,
    method = 'POST',
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '',
    invalidateQueries,
    headers = {},
    ...options
}: UseMutationHookOptions<TData, TError, TVariables>): UseMutationResult<TData, TError, TVariables> => {
    const queryClient = useQueryClient();

    return useMutation<TData, TError, TVariables>({
        mutationFn: async (variables: TVariables) => {
            const response = await fetch(`${baseUrl}${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                credentials: 'include',
                body: method !== 'GET' ? JSON.stringify(variables) : undefined,
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody?.message || 'Request failed');
            }

            const hasBody =
                response.headers.get('content-length') !== '0' &&
                response.headers.get('content-type')?.includes('application/json');

            return hasBody ? response.json() : undefined;
        },

    onSuccess: (data, variables, onMutateResult, context) => {
    invalidateQueries?.forEach(queryKey =>
        queryClient.invalidateQueries({ queryKey })
    );

    options.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
    );
},
        ...options,
    });
};

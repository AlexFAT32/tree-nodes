import {

	QueryKey,
	useMutation,
	UseMutationOptions,
	useQuery,
	UseQueryOptions,
} from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;



type ApiRequest = {
	method?: "get" | "post" | "patch" | "delete";
	path: string;
	data?: any;
	signal?: AbortSignal
	params?: Record<string, string>
};

const callApi = async <TData>( req: ApiRequest) => {
	let url = `${apiUrl}${req.path}`;
	if(req.params) {
		url += `?${new URLSearchParams(req.params).toString()}`
	}

	const res = await fetch(url, {
		method: req.method || "get",
		// headers: {
		// 	"Content-Type": "application/json",
		// },
		body: req.data ? JSON.stringify(req.data) : undefined,
		credentials: "omit",
		signal: req.signal


	});
	if(res.ok){
		const data = await res.text()

		// return (await res.json() || {}) as TData;
		return ( data ? JSON.parse(data) : {} ) as TData;
	} else {



		let errorJSON = {}
		try {
			errorJSON = await res.json()
		} catch (e){

		}

		const errorMessage = errorJSON?.data?.message || ""

		console.log("BodyUsed", errorMessage)
		if(errorMessage){

			throw new Error(errorMessage)
		}
		throw new Error("Something bad happened.")
	}

};

export type UseApiOptions<TData> = {
	queryKey: QueryKey;
	path: string;
	method?: ApiRequest["method"];
	params?: Record<string, string>
	options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">;
};

export const useApi = <TData>({ queryKey, path, method = "get", params = undefined, options = {} }: UseApiOptions<TData>) => {
	const queryOptions: UseQueryOptions<TData> = {
		...options,
		queryKey,
		queryFn: async () => {
			return await callApi<TData>( {  path, method, params} );
		},
	};
	return useQuery<TData>(queryOptions);
};

export type UseApiMutationOptions<TData, TVariables> = {
	path: string;
	method?: ApiRequest["method"];
	data?: TVariables;
	params?: Record<string, string>;
	options?: Omit<UseMutationOptions<TData, unknown,  TVariables>, "mutationFn"  >;
};

export const useApiMutation = <TData, TVariables>({
	path,
	method = "get",
	// params = undefined,
	options = {},
}: UseApiMutationOptions<TData, TVariables>) => {
	const mutationOptions: UseMutationOptions<TData, unknown,  TVariables> = {
		...options,
		mutationFn: async (params: TVariables) => {
			return await callApi( { path,  method, params });
		},
	};
	return useMutation<TData, unknown, TVariables>(mutationOptions);
};

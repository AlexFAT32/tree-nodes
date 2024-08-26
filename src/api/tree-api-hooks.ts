import {useApi, useApiMutation, UseApiMutationOptions, UseApiOptions} from "./use-api";

export type NodeType = {
	id: number;
	name: string;
	message?: string;
	children: NodeType[];
};

export type GetTreeRequest = {
	treeName: string;
};


export type GetTreeResponse = NodeType;

export type UpdateNodeRequest = {
	treeName: string
	nodeId: number;
	newNodeName: string;
};

export type CreateNodeRequest = {
	treeName: string
	parentNodeId: number;
	nodeName: string;
};

export type DeleteNodeRequest = {
	treeName: string
	nodeId: number;
};

export const useApiCreateNode = (
	options: UseApiMutationOptions<object, CreateNodeRequest>["options"] = {},
) => {
	return useApiMutation<object, CreateNodeRequest>({
		path: "/api.user.tree.node.create",
		options,
	});
};

export const useApiUpdateNode = (
	options: UseApiMutationOptions<object, UpdateNodeRequest>["options"] = {},
) => {
	return useApiMutation<object, UpdateNodeRequest>({
		path: "/api.user.tree.node.rename",
		options,
	});
};

export const useApiDeleteNode = (
	options: UseApiMutationOptions<object, DeleteNodeRequest>["options"] = {},
) => {
	return useApiMutation<object, DeleteNodeRequest>({
		path: "/api.user.tree.node.delete",
		options,
	});
};

export const useApiGetTree = (
	treeName: string,
	options: UseApiOptions<GetTreeRequest>["options"] = {},
) => {

	return useApi<GetTreeResponse>({
		queryKey: ["tree", treeName],
		path: "/api.user.tree.get",
		params: {treeName},
		options,
	});
};

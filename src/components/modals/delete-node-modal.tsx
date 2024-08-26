import { ContextModalProps } from "@mantine/modals";
import { Button, Box, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import {DeleteNodeRequest,  useApiDeleteNode} from "../../api/tree-api-hooks.ts";

type FormValues = DeleteNodeRequest;

export type DeleteNodeModalProps = ContextModalProps<Record<string, unknown>>;

export const DeleteNodeModal = ({ context, id, innerProps }: DeleteNodeModalProps) => {
  const queryClient = useQueryClient();
  const mutation = useApiDeleteNode({
    // mutationKey: ["spaces"],
    onSuccess: () => {

      notifications.show({
        title: "Success",
        message: "Node has been deleted.",
        color: "green",
      });
      context.closeModal(id);
    },
    onError: () => {

      // const error = e as unknown as string
      // console.log("error ---- :", error);
      notifications.show({
        title: "Error",
        message:  "Something bad happened.",
        color: "red",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree", "FAT32"] });
    },
  });

  const form = useForm<FormValues>({
    initialValues: {
      nodeId: innerProps.nodeId as number,
      treeName: innerProps.treeName as string,

    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutateAsync(values as unknown as void);
  };


  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Text>{`Are you sure you want to delete "${innerProps.nodeName}"`}</Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => context.closeModal(id)}>Cancel</Button>
          <Button type="submit">Delete</Button>
        </Group>
      </form>
    </Box>
  );
};

import { ContextModalProps } from "@mantine/modals";
import {Button, Box, Group, Text, Stack} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import {DeleteNodeRequest,  useApiDeleteNode} from "../../api/tree-api-hooks.ts";
import {useState} from "react";

type FormValues = DeleteNodeRequest;

export type DeleteNodeModalProps = ContextModalProps<Record<string, unknown>>;

export const DeleteNodeModal = ({ context, id, innerProps }: DeleteNodeModalProps) => {

  const [error, setError] = useState(undefined)

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
    onError: (e) => {

      setError(e.message)
      notifications.show({
        title: "Error",
        message:  e.message,
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
    mutation.mutateAsync(values);
  };

  return (
    <Box maw={340} mx="auto">
      {
        !error ? (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Text>{`Are you sure you want to delete "${innerProps.nodeName}"`}</Text>

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => context.closeModal(id)}>Cancel</Button>
              <Button type="submit">Delete</Button>
            </Group>
          </form>
        ) : (
          <Stack gap="md">
            <Text>{error}</Text>
            <Button fullWidth variant="default" onClick={() => context.closeModal(id)}>Cancel</Button>
          </Stack>
        )
      }
    </Box>
  );
};

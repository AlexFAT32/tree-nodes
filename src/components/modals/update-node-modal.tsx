import { ContextModalProps } from "@mantine/modals";
import { Button, Box, TextInput, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import {UpdateNodeRequest, useApiUpdateNode} from "../../api/tree-api-hooks.ts";

type FormValues = UpdateNodeRequest;

export type UpdateNodeModalProps = ContextModalProps<Record<string, unknown>>;

export const UpdateNodeModal = ({ context, id, innerProps }: UpdateNodeModalProps) => {
  const queryClient = useQueryClient();
  const mutation = useApiUpdateNode({
    // mutationKey: ["spaces"],
    onSuccess: () => {

      notifications.show({
        title: "Success",
        message: "Node has been updated.",
        color: "green",
      });
      context.closeModal(id);
    },
    onError: () => {

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
      newNodeName: innerProps.nodeName as string,
      treeName: innerProps.treeName as string,
      nodeId: innerProps.nodeId as number,
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    mutation.mutateAsync(values as unknown as void);
  };


  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput withAsterisk label="Name" placeholder="space name" {...form.getInputProps("newNodeName")} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => context.closeModal(id)}>Cancel</Button>
          <Button type="submit">Update</Button>
        </Group>
      </form>
    </Box>
  );
};

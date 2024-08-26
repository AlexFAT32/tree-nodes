import { ContextModalProps } from "@mantine/modals";
import { Button, Box, TextInput, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import {CreateNodeRequest, useApiCreateNode} from "../../api/tree-api-hooks.ts";

type FormValues = CreateNodeRequest;

export type CreateNodeModalProps = ContextModalProps<Record<string, unknown>>;

export const CreateNodeModal = ({ context, id, innerProps }: CreateNodeModalProps) => {
  const queryClient = useQueryClient();
  const mutation = useApiCreateNode({
    // mutationKey: ["spaces"],
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "New Node created.",
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
      nodeName: "",
      treeName: innerProps.treeName as string,
      parentNodeId: innerProps.parentNodeId as number,
    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutateAsync(values as unknown as void);
  };


  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput withAsterisk label="Name" placeholder="space name" {...form.getInputProps("nodeName")} />


        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => context.closeModal(id)}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};

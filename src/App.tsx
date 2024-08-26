import './App.css'
import {useApiGetTree} from "./api/tree-api-hooks.ts";
import {Card, Container, Loader, Text} from "@mantine/core";
import {Tree} from "./components/tree.tsx";
import {notifications} from "@mantine/notifications";
import {useState} from "react";

function App() {
  const [activeNode, setActiveNode] = useState(0)
  const {data, isLoading } = useApiGetTree("FAT32", {
    onSuccess: () => {
      // notifications.show({
      //   title: "Success",
      //   message: `Tree ${data?.treeName} loaded.`,
      //   color: "green",
      // })
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Something bad happened.",
        color: "red",
      })
    },

  })

  if (isLoading || !data) {
    return <Loader color={"blue"} />
  }

  return (
    <Container >
      <Card withBorder >
        <Text size={"xl"} fw={500}>
          {data?.name}
        </Text>
        <Tree nodes={data?.children} activeNode={activeNode} setActiveNode={setActiveNode} />
      </Card>
    </Container>
  )
}

export default App


import {NodeType} from "../api/tree-api-hooks.ts";
import {List} from "@mantine/core";
import {MdDeleteOutline, MdOutlineAddCircleOutline, MdOutlineEditCalendar} from "react-icons/md";
import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import {useState} from "react";
import {modals} from "@mantine/modals";
export type TreeProps = {
  nodes: NodeType[]
  setActiveNode: (id: number) => void
  activeNode?: number
}

// write react component tree render with nodes type NodeType = { id: string, name: string, children: NodeType[] }

export const Tree = ({nodes, setActiveNode, activeNode}: TreeProps) => {

  const [visibleChildren, setVisibleChildren] = useState(nodes.reduce((acc, node) => {
    const key = node.id as unknown as string
    acc[key] = false
    return acc
  }, {} as Record<string, boolean>));

  const handleClick = (id: number) => {
    setActiveNode(id)
    const key = id as unknown as string
    setVisibleChildren({...visibleChildren, [key]: !visibleChildren[key]})
  }

  const innerContent = nodes.map((node) => {

    const chevron = visibleChildren[node.id] ? <FaChevronDown/> : <FaChevronRight/>

    const children = visibleChildren[node.id] &&
      <Tree nodes={node.children} setActiveNode={setActiveNode} activeNode={activeNode}/>


    return (
    <List.Item
      className={"tree-li"}
      key={node.id}
    >
      <div className={"tree-li-flex-container"} onClick={() => handleClick(node.id)}>
        {
          node.children.length > 0 && chevron
        }
        <div className={"tree-li-flex-item"}>{`${node.name}`}</div>
        {
          node.id === activeNode &&
          <div className={"tree-li-action-container"}>
            <MdOutlineAddCircleOutline
              color={"green"}
              onClick={() =>
                modals.openContextModal({
                  modal: 'createNode',
                  title: 'Create New Node',
                  innerProps: {
                    parentNodeId: node.id,
                    treeName: "FAT32",
                  }
                })
              }
            />
            {
              node.id !== 19415 &&
              <>
                <MdOutlineEditCalendar
                  color={"blue"}
                  onClick={() =>
                    modals.openContextModal({
                      modal: 'updateNode',
                      title: 'Rename Node',
                      innerProps: {
                        nodeId: node.id,
                        treeName: "FAT32",
                        nodeName: node.name
                      }
                    })
                  }
                />
                <MdDeleteOutline
                  color={"red"}
                  onClick={() =>
                    modals.openContextModal({
                      modal: 'deleteNode',
                      title: 'Delete Node',
                      innerProps: {
                        nodeId: node.id,
                        treeName: "FAT32",
                        nodeName: node.name
                      }
                    })
                  }
                />
              </>
            }


          </div>
        }
      </div>
      {
        node.children.length > 0  && children
      }
    </List.Item>
  )}
  )



  return (
    <List
      spacing="xs"
      size="lg"
      listStyleType="none"
      withPadding={true}

    >
      {innerContent}
    </List>
  );
}


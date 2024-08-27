import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {MantineProvider} from "@mantine/core";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";
import {CreateNodeModal} from "./components/modals/create-node-modal.tsx";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import {UpdateNodeModal} from "./components/modals/update-node-modal.tsx";
import {DeleteNodeModal} from "./components/modals/delete-node-modal.tsx";

const queryClient = new QueryClient();

const modals = {
  createNode: CreateNodeModal,
  updateNode: UpdateNodeModal,
  deleteNode: DeleteNodeModal
};

createRoot(document.getElementById('root')!).render(

    <MantineProvider>
      <QueryClientProvider client={queryClient} >
        <Notifications />
        <ModalsProvider modals={modals}>
          <App />
        </ModalsProvider>
      </QueryClientProvider>
    </MantineProvider>

)

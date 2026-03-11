import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";
import AppRoutes from "./AppRoutes";
import { loadPass } from './client/lib/state';

loadPass();

export function App() {
  return (
    <MantineProvider
      defaultColorScheme="dark"
    >
      <AppRoutes />
    </MantineProvider>
  );
}

export default App;

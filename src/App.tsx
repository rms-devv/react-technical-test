import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import MessagesPane from "./Components/MessagePane/MessagesPane";
import Sidebar from "./Components/Sidebar/Sidebar";

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box component="aside" sx={{ width: 300 }}>
          <Sidebar />
        </Box>
        <Box component="main" sx={{ flex: 1 }}>
          <MessagesPane />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default App;

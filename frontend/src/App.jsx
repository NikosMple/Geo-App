import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AppRoutes from "@/components/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      cacheTime: 1000 * 60 * 10, // 10 min
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div
            className="App min-h-screen"
            style={{
              background:
                "linear-gradient(135deg, #0c0c1e 0%, #1a1a2e 50%, #16213e 100%)",
            }}
          >
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;

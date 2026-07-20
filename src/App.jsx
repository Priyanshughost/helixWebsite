import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  lazy,
  Suspense,
  useState,
} from "react";

import { CursorProvider } from "./context/CursorContext";
import MainLayout from "./layouts/MainLayout";
import CursorDot from "./components/CursorDot";
import Loader from "./components/Loader";
import ScrollToHash from "./components/ScrollToHash";

const Home = lazy(() => import("./pages/Home"));

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <CursorProvider>
        <CursorDot />
        {loading && (
          <Loader
            onComplete={() => {
              setLoading(false);
            }}
          />
        )}
        <BrowserRouter>
        <ScrollToHash/>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<MainLayout loading={loading} />}>
                <Route
                  path="/"
                  element={<Home />}
                />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CursorProvider>
    </>
  );
}

export default App;
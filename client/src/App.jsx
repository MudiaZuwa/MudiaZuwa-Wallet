import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <Layout>
        <Home />
      </Layout>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;

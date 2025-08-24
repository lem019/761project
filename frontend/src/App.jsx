
import { ConfigProvider } from "antd";
import {seedToken} from '@/assets/seedToken';
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <>
      <ConfigProvider theme={{token:{...seedToken}}}>
        <div className="container">
          <AppRoutes/>
        </div>
      </ConfigProvider>
    </>
  );
}

export default App;

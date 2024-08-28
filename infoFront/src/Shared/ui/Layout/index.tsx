import { Layout } from "antd";
import HeaderComponent from "App/components/Header";

import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content>
        
          <HeaderComponent />
     
        
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

import { Button, Layout, Menu, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SettingForm from "../Settings";
import { Setting } from "Shared/Settigns";
import "./index.css";
import { About } from "../AboutRider";
import { useSettings } from "App/Context/SettingContext";
const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  //  const [settings, setSettings] = useState<ISettings | null>(null);
  const [about, setVisibleAbout] = useState(false);
  const { settings, setSettings, refreshFeeds } = useSettings();
 

  const showAbout = () => {
    setVisibleAbout(true);
  };
  const handleOk = () => {
    setVisibleAbout(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (about) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [about]);

  useEffect(() => {
    if (visible) {
      const GetSet = async () => {
        const response = await Setting.getSettings();

        setSettings(response);
        document.body.style.overflow = "hidden";
      };
      GetSet();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible,setSettings]);

  const menuItems = [
    {
      key: "1",
      label: (
        <Link style={{ fontSize: "large" }} to="/">
          Главная
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="link" onClick={showModal}>
          Настройки
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button type="link" onClick={showAbout}>
          {" "}
          О ленте
        </Button>
      ),
    },
  ];
  return (
    <Header className="header">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Menu theme="light" mode="horizontal" items={menuItems} />
      </div>
      <Modal
        title="Настройки RSS-ленты"
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        {settings ? (
          <SettingForm
            settings={settings}
            onUpdate={async (updatedSettings) => {
              setSettings(updatedSettings);
              await refreshFeeds();
            }}
          />
        ) : (
          <p>Загрузка настроек...</p>
        )}
      </Modal>
      <Modal title="О лентах" open={about} onCancel={handleOk} footer={null}>
        <About />
      </Modal>
    </Header>
  );
};

export default HeaderComponent;
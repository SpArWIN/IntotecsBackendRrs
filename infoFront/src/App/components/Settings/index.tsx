import { useEffect, useState } from "react";
import { IFeed, ISettings } from "Shared/Settigns";
import FeedForm from "./FeedForm";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography } from "antd";
import { v4 } from "uuid";
const { Panel } = Collapse;
const { Title } = Typography;
interface SettingFormProps {
  settings: ISettings;
  onUpdate: (updatedSettings: ISettings) => Promise<void>;
}
const SettingForm: React.FC<SettingFormProps> = ({ settings, onUpdate }) => {
  const [feeds, setFeeds] = useState<IFeed[]>([]);

  useEffect(() => {
    // Заполнение форм данными с сервера
    if (settings.feeds) {
      
      setFeeds(settings.feeds.map((x) => ({ ...x, id: v4() })));
    }
  }, [settings]);

  const handleAddFeed = () => {
    const newFeed: IFeed = {
      id: v4(),
      url: "",
      updateFrequency: 0,
      enabled: false,
      proxy: { address: "", username: "", password: "" },
    };
    setFeeds([...feeds, newFeed]);
  };

   const handleUpdateFeed = (updatedFeed: IFeed) => {
     setFeeds((prevFeeds) => {
       const updatedFeeds = prevFeeds.map((feed) =>
         feed.id === updatedFeed.id ? updatedFeed : feed
       );
       // Обновляем ленты и вызываем onUpdate для обновления настроек в родительском компоненте
       onUpdate({ ...settings, feeds: updatedFeeds });
       return updatedFeeds;
     });
   };

  const handleDeleteFeed = (url: string) => {
    setFeeds(feeds.filter((feed) => feed.url !== url)); // Удаляем ленту из списка
   

  };

  return (
    <div>
      <Title level={2}>Настройки</Title>
      <Button
        type="primary"
        onClick={handleAddFeed}
        style={{ marginBottom: "16px" }}
      >
        Добавить новую ленту
      </Button>
      <Collapse>
        {feeds.map((feed, index) => (
          <Panel
            header={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: feed.enabled ? "green" : "black",
                }}
              >
                {feed.url || "Новая лента"}
              </div>
            }
            key={index}
            extra={<InfoCircleOutlined />}
          >
            <FeedForm
              onDeleteFeed={handleDeleteFeed}
              feed={feed}
              onUpdate={handleUpdateFeed}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default SettingForm;

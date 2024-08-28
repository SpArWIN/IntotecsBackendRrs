import { useEffect, useState } from "react";
import { IFeed, ISettings, ProxySettings, Setting } from "Shared/Settigns";
import { Input, Checkbox, Button, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface FeedFormProps {
  feed: IFeed;
  onUpdate: (updatedFeed: IFeed) => void;
  onDeleteFeed: (url: string) => void;

}

const FeedForm: React.FC<FeedFormProps> = ({
  feed,
  onUpdate,
  onDeleteFeed,
}) => {
  const [url, setUrl] = useState(feed.url);
  const [updateFrequency, setUpdateFrequency] = useState(feed.updateFrequency);
  const [enabled, setEnabled] = useState(feed.enabled);
  const [proxy, setProxy] = useState<ProxySettings>(feed.proxy);
  const [isDirty, setIsDirty] = useState(false);
  const [validation, setValidation] = useState({
    url: true,
    updateFrequency: true,
   
  });

  const validateFields = () => {
    const urlValid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
    const updateFrequencyValid = updateFrequency >= 1;
   

    setValidation({
      url: urlValid,
      updateFrequency: updateFrequencyValid,
     
    });
  };
  //Метод добавления ленты
  const handleUpdate = async () => {
    if (!Object.values(validation).every(Boolean)) {
      message.error("Пожалуйста, исправьте ошибки перед обновлением.");
      return;
    }
    try {
      // Создание нового объекта ленты
      const newFeed: IFeed = {
        id: feed.id,
        url,
        updateFrequency,
        enabled,
        proxy,
      };
      const settings: ISettings = { feeds: [newFeed] };
      const response = await Setting.updateSettings(settings);
      if (response) {
        message.success("Лента успешно добавлена!");
       
        onUpdate(newFeed);

      }
    } catch (error: any) {
      message.error("Ошибка при добавлении ленты: " + error.message);
    }
  };

  useEffect(() => {
    setUrl(feed.url);
    setUpdateFrequency(feed.updateFrequency);
    setEnabled(feed.enabled);
    setProxy(feed.proxy);
  }, [feed]);

  useEffect(() => {
    validateFields();
  }, [url, updateFrequency, proxy]);

  useEffect(() => {
    setIsDirty(
      url !== feed.url ||
        updateFrequency !== feed.updateFrequency ||
        enabled !== feed.enabled ||
        proxy.address !== feed.proxy.address ||
        proxy.username !== feed.proxy.username ||
        proxy.password !== feed.proxy.password
    );
  }, [url, updateFrequency, enabled, proxy, feed]);

  const isFormValid = Object.values(validation).every(Boolean);
  const isButtonDisabled = !isFormValid || !isDirty;
  const buttonText = feed.id ? "Обновить ленту" : "Добавить ленту";

  //Метод удаления ленты
  const handleDelete = async (url: string) => {
    try {
       await Setting.deleteFeed(url);
      onDeleteFeed(url);
    } catch (error: any) {
      // Обработка ошибок

      message.error("Произошла ошибка при удалении ленты.");
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
        style={{ marginBottom: "8px" }}
        suffix={
          validation.url ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red" }} />
          )
        }
      />
      <Input
        type="number"
        value={updateFrequency}
        onChange={(e) => setUpdateFrequency(Number(e.target.value))}
        placeholder="Update Frequency (минуты)"
        style={{ marginBottom: "8px" }}
        min={1}
        suffix={
          validation.updateFrequency ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red" }} />
          )
        }
      />
      <Checkbox
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        style={{ marginBottom: "8px" }}
      >
        Включить ленту
      </Checkbox>
      <div style={{ marginBottom: "8px", margin: "10px" }}>
        <h4>Настройки прокси (необязательно)</h4>
        <Input
          value={proxy.address}
          onChange={(e) => setProxy({ ...proxy, address: e.target.value })}
          placeholder="Proxy Address"
          style={{ marginBottom: "8px" }}
          // Убрали валидацию для поля адреса прокси
          suffix={
            proxy.address ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )
          }
        />
        <Input
          value={proxy.username}
          onChange={(e) => setProxy({ ...proxy, username: e.target.value })}
          placeholder="Username"
          style={{ marginBottom: "8px" }}
        
          suffix={
            proxy.username ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )
          }
        />
        <Input.Password
          value={proxy.password}
          onChange={(e) => setProxy({ ...proxy, password: e.target.value })}
          placeholder="Password"
          style={{ marginBottom: "8px" }}
         
          suffix={
            proxy.password ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )
          }
        />
      </div>
      <Button type="primary" onClick={handleUpdate} disabled={isButtonDisabled}>
        {buttonText}
      </Button>
      <Button onClick={() => handleDelete(url)} style={{ marginLeft: "8px" }}>
        Удалить ленту
      </Button>
    </div>
  );
};

export default FeedForm;
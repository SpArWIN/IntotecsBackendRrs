import { useEffect, useState } from "react";
import "./index.css";
import { Col, Row, Spin } from "antd";
import RssFeedList from "App/components/Rrs";

import { useSettings } from "App/Context/SettingContext";


export const Home = () => {
  const { feeds, refreshFeeds } = useSettings(); // Используем данные и функцию из контекста
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeeds = async () => {
      setLoading(true);
      setError(null);

      try {
       await   refreshFeeds(); // Обновляем ленты
      } catch (err) {
        setError("Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    loadFeeds();
  }, [refreshFeeds]); // Обновляем ленты при изменении функции обновления

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Добро пожаловать на RSS Фидер!</h1>
        <p className="subtitle">
          Получите актуальные новости и материалы с интересных сайтов
        </p>
      </header>
      {loading && (
        <div className="loader-container">
          <Spin size="large" />
          <p className="loader-text">Загрузка ленты</p>
        </div>
      )}
      {error && <p>Ошибка: {error}</p>}
      {feeds.length > 0 ? (
        <Row gutter={16}>
          {feeds.map((feed, index) => (
            <Col span={8} key={index}>
              <RssFeedList feed={feed} />{" "}
              {/* Передаем один канал в RssFeedList */}
            </Col>
          ))}
        </Row>
      ) : (
        <p>Нет доступных новостей для отображения.</p>
      )}
    </div>
  );
};

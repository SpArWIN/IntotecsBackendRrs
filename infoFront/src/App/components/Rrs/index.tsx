import { Card, Collapse,  Switch } from "antd";
import "./index.css";
import { RrsChannel } from "Shared/Rrs";
import { useEffect, useState } from "react";

type FeedProps = {
  feed: RrsChannel;
};
const RssFeedList: React.FC<FeedProps> = ({ feed }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState(feed.items);

  // Получить уникальные категории из элементов ленты
  const uniqueCategories = Array.from(
    new Set(feed.items.flatMap((item) => item.categories))
  );
  // Функция для удаления HTML-тегов, кроме <a>
  const stripHtmlExceptLinks = (html: string) => {
    return html
      .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, (match, p1) =>
        p1.toLowerCase() === "a" ? match : ""
      )
      .replace(/<[^>]+>/g, ""); // Удаление всех оставшихся тегов
  };
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setFilteredItems(
        feed.items.filter((item) =>
          item.categories.some((category) =>
            selectedCategories.includes(category)
          )
        )
      );
    } else {
      setFilteredItems(feed.items);
    }
  }, [selectedCategories, feed.items]);

  const handleCategoryToggle = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((cat) => cat !== category)
    );
  };

  return (
    <div className="rss-feed-container">
      <Card title={feed.title} bordered={false} className="rss-feed-card">
        <p>
          <strong>Описание:</strong> {stripHtmlExceptLinks(feed.description)}
        </p>
        <p>
          <strong>Дата публикации:</strong>{" "}
          {feed.pubDateString
            ? new Date(feed.pubDateString).toLocaleString()
            : "Дата публикации не найдена"}{" "}
        </p>
        <div className="rss-filter-section">
          <Collapse defaultActiveKey={["1"]} className="rss-category-collapse">
            <Collapse.Panel header="Фильтры по категориям" key="1">
              <div className="rss-toggle-switches">
                {uniqueCategories.length > 0 &&
                  uniqueCategories.map((category) => (
                    <div key={category} className="toggle-switch">
                      <Switch
                        checked={selectedCategories.includes(category)}
                        onChange={(checked) =>
                          handleCategoryToggle(category, checked)
                        }
                      />
                      <span>{category}</span>
                    </div>
                  ))}
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <ul className="rss-feed-items rss-items-scroll">
          {filteredItems.map((item, itemIndex) => (
            <li key={itemIndex} className="rss-feed-item">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              <p
                dangerouslySetInnerHTML={{
                  __html: stripHtmlExceptLinks(item.description),
                }}
              />
              <p>
                <strong>Дата:</strong> {new Date(item.pubDate).toLocaleString()}
              </p>
              <p>
                <strong>Категории:</strong> {item.categories.join(", ")}
              </p>
              {item.image.url && (
                <img
                  src={item.image.url}
                  alt={item.image.title}
                  className="rss-item-image"
                />
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default RssFeedList;
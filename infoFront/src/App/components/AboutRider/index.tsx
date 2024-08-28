import "./index.css";

export const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">Что такое RSS ленты?</h2>
      <p className="about-description">
        <strong>
          {" "}
          RSS (Really Simple Syndication) – это формат веб-ленты, который
          позволяет пользователям и программам получать обновления от веб-сайтов
          и новостных ресурсов без необходимости посещать их напрямую. RSS-ленты
          содержат заголовки, краткие описания и ссылки на полные статьи или
          новости.
        </strong>
      </p>
      <p className="about-description">
        С помощью RSS-лент вы можете легко отслеживать новые публикации с
        различных источников в одном месте. Это упрощает процесс получения
        свежих новостей и обновлений, помогая вам оставаться в курсе самых
        актуальных событий.
      </p>
      <p className="about-description">
        В этом веб-приложении реализован механизм для получения и отображения
        новостей из различных RSS-лент. Вы можете просматривать обновления,
        фильтровать их по категориям и получать доступ к полным статьям, кликая
        по ссылкам.
      </p>
    </div>
  );
};

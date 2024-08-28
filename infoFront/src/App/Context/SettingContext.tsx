import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { RrsChannel, RrsFeed } from "Shared/Rrs";
import { ISettings } from "Shared/Settigns";

interface SettingsContextType {
  settings: ISettings | null;
  feeds: RrsChannel[];
  setSettings: (settings: ISettings | null) => void;
  refreshFeeds: (url? :string) => void;
}
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [feeds, setFeeds] = useState<RrsChannel[]>([]);

  const refreshFeeds = useCallback(async (url?: string) => {
    try {
      const response = await RrsFeed.getRrsFeed(url); // Запрос данных ленты
      if (response.success && response.data) {
        setFeeds(response.data.channels || []); // Устанавливаем полученные данные
      } else {
        console.error("Ошибка получения данных ленты");
      }
    } catch (error) {
      console.error("Ошибка при обновлении лент", error);
    }
  }, []);
  // Обновляем ленты при изменении настроек
   useEffect(() => {
     if (settings) {
       refreshFeeds(); // Первоначальная загрузка лент

       // Устанавливаем интервалы обновления для каждой ленты
       const intervals: NodeJS.Timeout[] = [];

       settings.feeds.forEach((feed) => {
         if (feed.enabled && feed.updateFrequency > 0) {
           const interval = setInterval(() => {
             refreshFeeds(feed.url); // Обновляем конкретную ленту
           }, feed.updateFrequency * 60 * 1000); // Умножаем на 1000 для миллисекунд
           intervals.push(interval);
         }
       });

       // Очистка интервалов при размонтировании
       return () => {
         intervals.forEach(clearInterval);
       };
     }
   }, [settings, refreshFeeds]);
 return (
    <SettingsContext.Provider value={{ settings, setSettings, feeds, refreshFeeds }}>
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
 
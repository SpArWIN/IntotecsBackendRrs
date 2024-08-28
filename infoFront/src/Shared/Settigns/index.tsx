import { message } from "antd";
import { deleteFeeds, getRrsSettings, updateRrsSettings } from "../API";

export interface ProxySettings {
  address: string; // Адрес прокси-сервера
  username: string; // Имя пользователя для прокси
  password: string; // Пароль для прокси
}

export interface IFeed {
  id: string;
  url: string;
  updateFrequency: number;
  enabled: boolean;
  proxy: ProxySettings;
}

export interface ISettings {
  feeds: Omit<IFeed,"id">[] ;
}
export class Settings {
  async getSettings(): Promise<ISettings | null> {
    try {
      const response = await getRrsSettings();
      if (response?.data) {
        return response.data; // Указываем тип данных
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
    return null;
  }

  updateSettings = async (Setting: ISettings) => {
    try {
      const response = await updateRrsSettings(Setting);
      if (response) {
        return response.data;
      }
    } catch (error: any) {
      throw error;
    }
  };
  deleteFeed = async (url: string) => {
    try {
      var delf = await deleteFeeds(url);
      if (delf) {
        message.success(`Лента ${url} успешно удалена`);
      }
    } catch (error) {
      throw error;
    }
  };
}
export const Setting = new Settings();

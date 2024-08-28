import { RrsFeed } from "Shared/Rrs";
import { ISettings } from "../Settigns";
import { localapi } from "./api";

export interface ApiResponse<T> {
  success: boolean;
  description?: string;
  data?: T;
}

//#region Функции для работы с настройками лент
//Функция получения настроек лент
export const getRrsSettings =
  async (): Promise<ApiResponse<ISettings> | null> => {
    try {
      const response = await localapi.get<ApiResponse<ISettings>>(
        "/api/Service"
      );
      console.log(response.data);
      if(response){
        return response.data;
      }
      else{
        return null;
      }
    } catch (error: any) {
      console.error("Ошибка при выполнении запроса:", error);
      return null;
    }
  };

//Функция обновления настроек лент
export const updateRrsSettings = async (Settins: ISettings) => {
  const response = await localapi.post("/api/Service", Settins);
  if (response) {
    return response;
  }

};
export const deleteFeeds = async (url: string): Promise<boolean> => {
  try {
    const response = await localapi.delete("/api/Service", {
      data: url, // Передаем URL в теле запроса
    });

    return response.status === 200;
  } catch (error: any) {
    console.error(`Ошибка при удалении ленты: ${error.message}`);
    return false;
  }
};
//#endregion
//Функция получения лент
export const getRrs = async (url? :string): Promise<ApiResponse<RrsFeed>> => {
  try {
    //Добавляем поддержку необязательного url
   const endpoint = url
     ? `/api/rss?url=${encodeURIComponent(url)}`
     : "/api/rss";
    const response = await localapi.get(endpoint);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
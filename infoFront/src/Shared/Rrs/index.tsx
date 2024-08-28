import { ApiResponse, getRrs } from "Shared/API";


// Класс для элемента RSS
export class RssItem {
  guid: string;
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  creator: string;
  categories: string[];
  image: RssImage;

  constructor(data: any) {
    this.guid = data.guid || "";
    this.title = data.title || "";
    this.link = data.link || "";
    this.description = data.description || "";
    this.pubDate = new Date(data.pubDate);
    this.creator = data.creator || "";
    this.categories = data.categories || [];
    this.image = new RssImage(data.image || {});
  }
}



export class RssImage {
  link: string;
  url: string;
  title: string;

  constructor(data: any) {
    this.link = data.link || "";
    this.url = data.url || "";
    this.title = data.title || "";
  }
}
export class RrsChannel {
  items: RssItem[];
  title: string;
  link: string;
  description: string;
  language: string;
  pubDateString: string;

  constructor(data: any) {
     console.log("Initializing RrsChannel with data:", data);
    this.items = (data.channel.items || []).map((item: any) => new RssItem(item));
    this.title = data.channel.title || "";
    this.link = data.channel.link || "";
    this.description = data.channel.description || "";
    this.language = data.channel.language || "";
    this.pubDateString = data.channel.pubDateString || "";
  }
}

// Класс для ленты RSS
export class RrsFeed {
  channels: RrsChannel[]; // Массив каналов

  constructor(data: any) {
    this.channels = Array.isArray(data)
      ? data.map((item: any) => new RrsChannel(item)) // Передаем item напрямую, так как item - это объект канала
      : [];
  }

  // Метод получения лент
  static async getRrsFeed(url? :string): Promise<ApiResponse<RrsFeed>> {
    // Изменение метода на static для использования без создания экземпляра
    try {
      const response: ApiResponse<any> = await getRrs(url); // Получаем ответ от API
      if (response.success && response.data) {
        const rrsFeed = new RrsFeed(response.data || []); // Теперь используем channels из response.data
        return {
          success: true,
          data: rrsFeed,
        };
      }
      return {
        success: false,
        description: response.description || "Неизвестная ошибка",
      };
    } catch (error: any) {
      return {
        success: false,
        description: "Ошибка при выполнении запроса",
      };
    }
  }
}

export type EventItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  text: string;
  image: string;
  type: string;
  url: string;
  active: boolean;
};

export const fallbackEvents: EventItem[] = [
  {
    id: "baikal-evening",
    date: "2026-06-07",
    time: "18:00 - 21:00",
    title: "Вечер у Байкала",
    text: "Атмосферный вечер с живой музыкой, байкальскими историями и чаем на травах.",
    image: "/images/gallery/gallery-05.jpg",
    type: "Встреча",
    url: "",
    active: true,
  },
  {
    id: "kitchen",
    date: "2026-06-21",
    time: "15:00 - 17:00",
    title: "Мастер-класс традиционной кухни",
    text: "Готовим блюда старинной сибирской кухни из местных продуктов и говорим о семейных рецептах.",
    image: "/images/gallery/gallery-03.jpg",
    type: "Мастер-класс",
    url: "",
    active: true,
  },
  {
    id: "family-day",
    date: "2026-07-05",
    time: "11:00 - 16:00",
    title: "Семейный день на Байкале",
    text: "Игры, прогулки, горячий чай и небольшие мастер-классы для гостей всех возрастов.",
    image: "/images/hero-baikal.png",
    type: "Семейная программа",
    url: "",
    active: true,
  },
  {
    id: "fishing-history",
    date: "2026-07-19",
    time: "12:00 - 14:00",
    title: "Экскурсия по рыбацкому стану",
    text: "Погружение в историю промысла, рассказ о традициях и быте рыбаков Гремячинска.",
    image: "/images/history/history-boat.png",
    type: "Экскурсия",
    url: "",
    active: true,
  },
  {
    id: "shore-walk",
    date: "2026-08-02",
    time: "10:00 - 12:00",
    title: "Прогулка по берегу Байкала",
    text: "Спокойный маршрут вдоль воды, рассказы о природе и лучших местах для семейных фотографий.",
    image: "/images/gallery/gallery-01.jpg",
    type: "Маршрут",
    url: "",
    active: true,
  },
  {
    id: "welcome-baikal",
    date: "2026-08-16",
    time: "13:00 - 15:00",
    title: "Обряд приветствия Байкала",
    text: "Знакомство с древней традицией, которая помогает встретиться с великим озером внимательно и спокойно.",
    image: "/images/history/gremyachinsk-viewpoint.jpg",
    type: "Традиции",
    url: "",
    active: true,
  },
];

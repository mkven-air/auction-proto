export type Locale = "en" | "ru" | "uz";

export const SHARED_I18N = {
  en: {
    flightTime: {
      monthsAbbr: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      durationHourSuffix: "h",
      durationMinuteSuffix: "m",
    },
    seatMap: {
      taken: "Taken",
      bid: "Bid",
      free: "Free",
    },
  },
  ru: {
    flightTime: {
      monthsAbbr: [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ],
      durationHourSuffix: "ч",
      durationMinuteSuffix: "м",
    },
    seatMap: {
      taken: "Занято",
      bid: "Заявка",
      free: "Свободно",
    },
  },
  uz: {
    flightTime: {
      monthsAbbr: [
        "Yan",
        "Fev",
        "Mar",
        "Apr",
        "May",
        "Iyn",
        "Iyl",
        "Avg",
        "Sen",
        "Okt",
        "Noy",
        "Dek",
      ],
      durationHourSuffix: "s",
      durationMinuteSuffix: "d",
    },
    seatMap: {
      taken: "Band",
      bid: "Taklif",
      free: "Bo'sh",
    },
  },
} as const;

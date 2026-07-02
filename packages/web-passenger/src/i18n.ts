import type { Locale } from "@auction/web-shared";

export type { Locale };

export const PASSENGER_I18N = {
  en: {
    passenger: {
      products: {
        bc: {
          label: "Business Class",
          desc: "Lie-flat seat · Lounge · Dining",
        },
        ex: {
          label: "Exit Row Seat",
          desc: "+30cm legroom · Early boarding",
        },
        sb: {
          label: "Seat Blocker",
          desc: "Block the adjacent seat",
        },
      },
      submitted: {
        title: "Request Submitted!",
        desc1: "Results will be announced 4–8 hours before departure.",
        desc2: "Payment is only charged upon confirmation.",
        rows: {
          flight: "Flight",
          upgrades: "Upgrades",
          paymentStatus: "Payment Status",
          weightedBid: "Weighted Bid",
          notification: "Notification",
        },
        paymentValue: "Not charged ✓",
        notificationValue: "Email · App",
        editHint:
          "You can modify or withdraw your bid in «Manage Booking» until the auction closes.",
        editButton: "← Edit Bid",
      },
      flightHeader: {
        classTransition: "Economy → Business",
      },
      loyaltyProgram: "Loyalty Program",
      chooseUpgrades: "Choose upgrades",
      chanceLabel: "Acceptance chance",
      totalTitle: "Total",
      weightedTotal: "Weighted total",
      platinumBonus: "× Platinum bonus +10%",
      basePrefix: "base $",
      infoTextStart: "Funds are",
      infoTextStrong: "not charged",
      infoTextEnd: "immediately. Payment only upon airline confirmation of the upgrade.",
      submitEmpty: "Select at least one upgrade",
      submitPrefix: "Submit Bid · $",
      auctionClosesIn: "Auction closes in",
    },
    states: {
      loading: "Loading...",
    },
  },
  ru: {
    passenger: {
      products: {
        bc: {
          label: "Бизнес-класс",
          desc: "Раскладное кресло · Лаундж · Питание",
        },
        ex: {
          label: "Ряд у аварийного выхода",
          desc: "+30 см для ног · Ранняя посадка",
        },
        sb: {
          label: "Seat Blocker",
          desc: "Заблокировать соседнее место",
        },
      },
      submitted: {
        title: "Заявка принята!",
        desc1: "Результат будет известен за 4–8 часов до вылета.",
        desc2: "Средства спишутся только при подтверждении.",
        rows: {
          flight: "Рейс",
          upgrades: "Апгрейды",
          paymentStatus: "Статус оплаты",
          weightedBid: "Взвешенная ставка",
          notification: "Уведомление",
        },
        paymentValue: "Не списано ✓",
        notificationValue: "Email · App",
        editHint:
          "Изменить или отозвать заявку можно в разделе «Управление бронированием» до закрытия аукциона.",
        editButton: "← Изменить заявку",
      },
      flightHeader: {
        classTransition: "Эконом → Бизнес",
      },
      loyaltyProgram: "Программа лояльности",
      chooseUpgrades: "Выберите апгрейды",
      chanceLabel: "Шанс принятия",
      totalTitle: "Итого",
      weightedTotal: "Взвешенная сумма",
      platinumBonus: "× бонус Platinum +10%",
      basePrefix: "базовая $",
      infoTextStart: "Средства",
      infoTextStrong: "не списываются",
      infoTextEnd: "сразу. Оплата — только при подтверждении апгрейда авиакомпанией.",
      submitEmpty: "Выберите хотя бы один апгрейд",
      submitPrefix: "Подать заявку · $",
      auctionClosesIn: "Аукцион закрывается через",
    },
    states: {
      loading: "Загрузка...",
    },
  },
  uz: {
    passenger: {
      products: {
        bc: {
          label: "Biznes-klass",
          desc: "Yotadigan o'rindiq · Lounge · Ovqat",
        },
        ex: {
          label: "Favqulodda chiqish qatori",
          desc: "+30sm oyoq joyi · Erta posadka",
        },
        sb: {
          label: "O'rin bloklash",
          desc: "Qo'shni o'rinni bloklash",
        },
      },
      submitted: {
        title: "Taklif qabul qilindi!",
        desc1: "Natija uchishdan 4–8 soat oldin e'lon qilinadi.",
        desc2: "To'lov faqat tasdiqlangandan keyin undiriladi.",
        rows: {
          flight: "Parvoz",
          upgrades: "Yangilashlar",
          paymentStatus: "To'lov holati",
          weightedBid: "Og'irlikli taklif",
          notification: "Bildirishnoma",
        },
        paymentValue: "Undirilmadi ✓",
        notificationValue: "Email · Ilova",
        editHint:
          "Auktsion yopilgunga qadar «Bronni boshqarish» bo'limida taklifni o'zgartirish yoki qaytarib olish mumkin.",
        editButton: "← Taklifni tahrirlash",
      },
      flightHeader: {
        classTransition: "Iqtisodiy → Biznes",
      },
      loyaltyProgram: "Sodiqlik dasturi",
      chooseUpgrades: "Yangilashlarni tanlang",
      chanceLabel: "Qabul qilinish ehtimoli",
      totalTitle: "Jami",
      weightedTotal: "Og'irlikli jami",
      platinumBonus: "× Platinum bonusi +10%",
      basePrefix: "asosiy $",
      infoTextStart: "Mablag'lar",
      infoTextStrong: "undirilmaydi",
      infoTextEnd:
        "darhol. To'lov faqat aviakompaniya yangilashni tasdiqlaganda amalga oshiriladi.",
      submitEmpty: "Kamida bitta yangilashni tanlang",
      submitPrefix: "Taklif yuborish · $",
      auctionClosesIn: "Auktsion yopilishiga",
    },
    states: {
      loading: "Yuklanmoqda...",
    },
  },
} as const;

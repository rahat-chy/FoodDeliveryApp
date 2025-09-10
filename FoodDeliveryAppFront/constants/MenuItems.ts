import MenuImages from "./MenuImages";

export type MenuItem = {
  id: number;
  title: string;
  description: string;
  image: number | string | null;
};

export const Menu_Items: MenuItem[] = [
  {
    id: 1,
    title: "Kacchi",
    description: "Traditional Bangladeshi biryani made with fragrant rice, marinated meat, and rich spices.",
    image: MenuImages[0]
  },
  {
    id: 2,
    title: "Tehari",
    description: "Spiced rice dish with beef or mutton, a popular Bangladeshi delicacy.",
    image: MenuImages[1]
  },
  {
    id: 3,
    title: "Fried Chicken",
    description: "Crispy and golden fried chicken with tender and juicy meat inside.",
    image: MenuImages[2]
  },
  {
    id: 4,
    title: "Black Coffee",
    description: "Simple brewed coffee without milk or sugar, strong and bold in flavor.",
    image: MenuImages[3]
  },
  {
    id: 5,
    title: "Burger",
    description: "Juicy beef or chicken patty served in a bun with fresh vegetables and sauces.",
    image: MenuImages[4]
  },
  {
    id: 6,
    title: "Cappuccino",
    description: "Espresso mixed with steamed milk and topped with a thick layer of foamed milk.",
    image: MenuImages[5]
  },
  {
    id: 7,
    title: "Tea",
    description: "Brewed leaves served hot or cold, available in various types like black, green, or herbal.",
    image: MenuImages[6]
  },
  {
    id: 8,
    title: "Soft Drink",
    description: "Refreshing carbonated beverage, available in various fruity and cola flavors.",
    image: MenuImages[7]
  }
];
export type MenuDiet = 'veg' | 'egg' | 'non-veg';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  dietary: MenuDiet;
  image: string;
  customisable?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  itemIds: string[];
};

const images = {
  maggi: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=500',
  omelette: 'https://images.pexels.com/photos/6294372/pexels-photo-6294372.jpeg?auto=compress&cs=tinysrgb&w=500',
  bread: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=500',
  burger: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500',
  bowl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=500',
  beverage: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
  iceCream: 'https://images.pexels.com/photos/1352296/pexels-photo-1352296.jpeg?auto=compress&cs=tinysrgb&w=500',
  mojito: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=500',
  brownie: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=500',
  poha: 'https://images.pexels.com/photos/4331485/pexels-photo-4331485.jpeg?auto=compress&cs=tinysrgb&w=500',
};

const item = (
  id: string,
  name: string,
  price: number,
  dietary: MenuDiet,
  description: string,
  image: string,
  customisable = false,
): MenuItem => ({ id, name, price, dietary, description, image, customisable });

export const spicyWicyMenuItems: MenuItem[] = [
  item('ginger-tea', 'Ginger Tea (Freshly Made)', 59, 'veg', 'Freshly brewed tea with warming ginger.', images.beverage),
  item('peri-peri-maggi', 'Peri Peri Maggi', 129, 'veg', 'Classic noodles tossed with bold peri peri spice.', images.maggi, true),
  item('indori-poha-ratlami-sev', 'Indori Poha With Ratlami Sev', 119, 'veg', 'Soft poha finished with crunchy Ratlami sev.', images.poha),
  item('double-masala-maggi', 'Double Masala Maggi', 119, 'veg', 'Twice the masala for a deeply savoury bowl.', images.maggi, true),
  item('desi-masala-spice-maggi', 'Desi-masala-Spice Maggi', 139, 'veg', 'A desi spice blend folded through hot noodles.', images.maggi),
  item('bun-maska-amul-butter', 'Bun Maska - Amul Butter', 79, 'veg', 'Soft toasted bun with generous Amul butter.', images.bread),
  item('natural-tender-coconut-ice-cream', 'Natural Tender Coconut Ice Cream', 149, 'veg', 'Cool, creamy tender coconut scoop.', images.iceCream),
  item('cheese-stuffed-garlic-bread', 'Cheese Stuffed Garlic Bread', 189, 'veg', 'Golden garlic bread filled with melting cheese.', images.bread),
  item('signature-veg-maggi', 'Signature Veg Maggi', 159, 'veg', 'Spicy Wicy house Maggi with crunchy vegetables.', images.maggi),
  item('dry-fruits-milkshake', 'Dry Fruits Milkshake (350 ml)', 199, 'veg', 'Thick milkshake blended with a dry fruit mix.', images.beverage),
  item('classic-plain-poha', 'Classic Plain Poha', 99, 'veg', 'Light, fluffy poha with a fresh lemon finish.', images.poha),
  item('corn-cheese-maggi', 'Corn Cheese Maggi', 169, 'veg', 'Sweet corn and cheese over saucy Maggi.', images.maggi),
  item('oreo-thick-shake', 'Oreo Thick Shake (350 ml)', 189, 'veg', 'A creamy Oreo shake with a cookie finish.', images.beverage),
  item('chilli-cheese-garlic-toast', 'Chilli Cheese Garlic Toast', 159, 'veg', 'Toasted garlic bread with chilli and cheese.', images.bread),
  item('double-cheese-chilli-garlic-toast', 'Double Cheese - Chilli Garlic Toast', 199, 'veg', 'Extra cheesy toast with chilli garlic heat.', images.bread),
  item('virgin-mojito', 'Virgin Mojito (350 ml)', 139, 'veg', 'Lime, mint, and fizz served ice cold.', images.mojito),
  item('chocolate-thick-shake', 'Chocolate Thick Shake (350 ml)', 179, 'veg', 'Rich chocolate shake blended until thick.', images.beverage),
  item('jam-bread', 'Jam Bread (2 slices)', 69, 'veg', 'Toasted bread with a bright jam spread.', images.bread),
  item('cream-bun', 'Cream Bun', 89, 'veg', 'Soft bun layered with sweet cream.', images.bread),
  item('chocolate-spread-bun', 'Chocolate Spread Bun', 99, 'veg', 'Soft bun with a smooth chocolate spread.', images.bread),
  item('ginger-lemon-honey-tea', 'Ginger Lemon Honey Tea (Freshly Made)', 79, 'veg', 'Fresh tea balanced with ginger, lemon, and honey.', images.beverage),
  item('green-pistachio-ice-cream', 'Green Pistachio Ice Cream', 149, 'veg', 'Creamy pistachio ice cream with nutty flavour.', images.iceCream),
  item('soupy-maggi', 'Soupy Maggi', 139, 'veg', 'Comforting Maggi served with extra savoury broth.', images.maggi),
  item('classic-plain-maggi', 'Classic Plain Maggi', 99, 'veg', 'The familiar, hot, saucy Maggi bowl.', images.maggi),
  item('rose-milk', 'Rose Milk (350 ml)', 129, 'veg', 'Chilled rose milk with a floral finish.', images.beverage),
  item('butter-chicken-rice-bowl', 'Butter Chicken-rice Bowl', 329, 'non-veg', 'Creamy butter chicken served over fragrant rice.', images.bowl),
  item('chicken-masala-rice-bowl', 'Chicken Masala-rice Bowl', 309, 'non-veg', 'Homestyle chicken masala with steamed rice.', images.bowl),
  item('kadai-chicken-rice-bowl', 'Kadai Chicken-rice Bowl', 319, 'non-veg', 'Kadai-spiced chicken paired with rice.', images.bowl),
  item('mughlai-chicken-rice-bowl', 'Mughlai Chicken-rice Bowl', 329, 'non-veg', 'Rich Mughlai chicken with fragrant rice.', images.bowl),
  item('egg-kadai-rice-bowl', 'Egg Kadai-rice Bowl', 239, 'egg', 'Kadai-style egg gravy with steamed rice.', images.bowl),
  item('egg-mughlai-rice-bowl', 'Egg Mughlai-rice Bowl', 249, 'egg', 'Creamy Mughlai egg gravy with rice.', images.bowl),
  item('paneer-butter-masala-rice-bowl', 'Paneer Butter Masala-rice Bowl', 289, 'veg', 'Paneer butter masala served with rice.', images.bowl),
  item('shahi-paneer-rice-bowl', 'Shahi Paneer-rice Bowl', 289, 'veg', 'Silky shahi paneer with fragrant rice.', images.bowl),
  item('paneer-kadai-rice-bowl', 'Paneer Kadai-rice Bowl', 279, 'veg', 'Smoky kadai paneer with steamed rice.', images.bowl),
  item('mushroom-kadai-rice-bowl', 'Mushroom Kadai Rice Bowl', 269, 'veg', 'Kadai mushrooms with a warm rice bowl.', images.bowl),
  item('dal-tadka-rice-bowl', 'Dal Tadka-rice Bowl', 219, 'veg', 'Tempered dal served with fragrant rice.', images.bowl),
  item('peri-peri-schezwan-chicken-maggi', 'Peri Peri-Schezwan Chicken Maggi', 219, 'non-veg', 'Chicken Maggi with peri peri and Schezwan heat.', images.maggi),
  item('schezwan-chicken-maggi', 'Schezwan Chicken Maggi', 209, 'non-veg', 'Schezwan noodles with tender chicken bites.', images.maggi),
  item('chicken-cheese-oregano-maggi', 'Chicken Cheese Oregano Maggi', 229, 'non-veg', 'Chicken, cheese, and oregano over hot Maggi.', images.maggi),
  item('egg-fried-maggi', 'Egg Fried Maggi', 159, 'egg', 'Wok-tossed Maggi with seasoned egg.', images.maggi),
  item('boiled-egg-maggi', 'Boiled Egg Maggi', 169, 'egg', 'Classic Maggi topped with boiled egg.', images.maggi),
  item('schezwan-maggi', 'Schezwan Maggi', 139, 'veg', 'Noodles tossed in a punchy Schezwan sauce.', images.maggi),
  item('caramelised-onion-maggi', 'Caramelised Onion Maggi', 139, 'veg', 'Sweet caramelised onions with savoury Maggi.', images.maggi),
  item('chilli-tomato-garlic-maggi', 'Chilli Tomato Garlic Maggi', 149, 'veg', 'Bright tomato, chilli, and garlic noodles.', images.maggi),
  item('chicken-bread-omelette', 'Chicken Bread Omelette', 199, 'non-veg', 'Fluffy omelette with chicken between toasted bread.', images.omelette),
  item('bun-omelette', 'Bun Omelette', 129, 'egg', 'Masala omelette tucked into a soft bun.', images.omelette, true),
  item('chef-special-bread-omelette', 'Chef Special Bread Omelette (2 slice)', 169, 'egg', 'Chef-style masala omelette with two bread slices.', images.omelette),
  item('signature-burger', 'Signature Burger', 179, 'veg', 'Spicy Wicy house burger with fresh crunch.', images.burger, true),
  item('signature-double-chicken-burger', 'Signature Double Chicken Burger', 299, 'non-veg', 'Double chicken patties layered in a soft bun.', images.burger, true),
  item('schezwan-chicken-burger', 'Schezwan Chicken Burger', 229, 'non-veg', 'Chicken burger with a Schezwan kick.', images.burger),
  item('chicken-cheese-burger', 'Chicken Cheese Burger', 249, 'non-veg', 'Juicy chicken, melted cheese, and fresh crunch.', images.burger, true),
  item('coleslaw-cheese-craver', 'Coleslaw Cheese Craver', 199, 'veg', 'Creamy coleslaw and cheese in a warm bun.', images.burger),
  item('signature-paneer-cheese-craver', 'Signature Paneer Cheese Craver', 219, 'veg', 'Spiced paneer and cheese in a loaded bun.', images.burger),
  item('egg-chicken-soupy-maggi', 'Egg Chicken Soupy Maggi (1 bowl)', 229, 'non-veg', 'Soupy Maggi with egg and chicken in one bowl.', images.maggi),
  item('stuffed-veg-burger-combo', 'Stuffed Veg Burger Combo', 259, 'veg', 'Stuffed veg burger served as a satisfying combo.', images.burger),
  item('veg-maggi-paneer-bowl-combo', 'Veg Maggi & Paneer Bowl Combo', 349, 'veg', 'Veg Maggi paired with a paneer rice bowl.', images.bowl),
  item('belgium-chocolate-thickshake', 'Belgium Chocolate Thickshake (350 ml)', 219, 'veg', 'Deep chocolate thickshake with a smooth finish.', images.beverage),
  item('butterscotch-thickshake', 'Butterscotch Thickshake (350 ml)', 189, 'veg', 'Creamy butterscotch shake with caramel notes.', images.beverage),
  item('blue-lime-mojito', 'Blue-Lime Mojito (350 ml)', 159, 'veg', 'Citrusy lime cooler with a bright blue finish.', images.mojito),
  item('mint-lime-mojito', 'Mint-Lime Mojito (350 ml)', 149, 'veg', 'Fresh mint and lime with plenty of fizz.', images.mojito),
  item('black-currant-berry-ice-cream', 'Black Currant Berry Ice Cream', 149, 'veg', 'Creamy black currant ice cream with berry notes.', images.iceCream),
  item('choco-brownie-ice-cream', 'Choco Brownie Ice Cream', 159, 'veg', 'Chocolate ice cream with brownie pieces.', images.iceCream),
  item('creamy-butterscotch-ice-cream', 'Creamy Butterscotch Ice Cream', 149, 'veg', 'Smooth butterscotch ice cream with crunch.', images.iceCream),
  item('bourn-vita-hot', 'Bourn Vita (Hot)', 99, 'veg', 'Warm, malty Bourn Vita made fresh.', images.beverage),
  item('horlicks-hot', 'Horlicks (Hot)', 99, 'veg', 'Comforting hot Horlicks made to order.', images.beverage),
  item('boost-hot', 'Boost (Hot)', 99, 'veg', 'Warm, chocolatey Boost for a cosy sip.', images.beverage),
  item('double-choco-chip-brownie', 'Double Choco Chip Brownie', 159, 'veg', 'Fudgy brownie with double chocolate chips.', images.brownie),
  item('roasted-hazelnut-brownie', 'Roasted Hazelnut Brownie', 179, 'veg', 'Rich brownie with roasted hazelnut crunch.', images.brownie),
  item('red-velvet-brownie', 'The Decadent - Red Velvet Brownie', 179, 'veg', 'Dense red velvet brownie with a decadent finish.', images.brownie),
  item('indian-breads-shahi-paneer', 'Indian Breads With Shahi Paneer', 279, 'veg', 'Indian breads served with creamy shahi paneer.', images.bread),
  item('indian-breads-veg-mix-gravy', 'Indian Breads With Veg Mix Gravy', 249, 'veg', 'Indian breads with a hearty mixed vegetable gravy.', images.bread),
  item('indian-breads-butter-chicken', 'Indian Breads With Creamy Butter Chicken', 329, 'non-veg', 'Indian breads paired with creamy butter chicken.', images.bread),
];

export const spicyWicyCategories: MenuCategory[] = [
  {
    id: 'recommended',
    title: 'Recommended for you',
    itemIds: ['signature-veg-maggi', 'chicken-cheese-burger', 'paneer-butter-masala-rice-bowl', 'virgin-mojito', 'choco-brownie-ice-cream'],
  },
  {
    id: 'maggi',
    title: 'Maggi',
    itemIds: ['peri-peri-maggi', 'double-masala-maggi', 'signature-veg-maggi', 'classic-plain-maggi', 'schezwan-maggi', 'caramelised-onion-maggi', 'chilli-tomato-garlic-maggi'],
  },
  {
    id: 'special-flavours-maggi',
    title: 'Special Flavours Maggi',
    itemIds: ['desi-masala-spice-maggi', 'corn-cheese-maggi', 'peri-peri-schezwan-chicken-maggi', 'schezwan-chicken-maggi', 'chicken-cheese-oregano-maggi', 'egg-fried-maggi', 'boiled-egg-maggi'],
  },
  {
    id: 'omelette',
    title: 'Omelette',
    itemIds: ['chicken-bread-omelette', 'bun-omelette', 'chef-special-bread-omelette'],
  },
  {
    id: 'breads-buns',
    title: 'Breads & Buns',
    itemIds: ['bun-maska-amul-butter', 'cheese-stuffed-garlic-bread', 'chilli-cheese-garlic-toast', 'double-cheese-chilli-garlic-toast', 'jam-bread', 'cream-bun', 'chocolate-spread-bun'],
  },
  {
    id: 'signature-burgers',
    title: 'Signature Burgers',
    itemIds: ['signature-burger', 'signature-double-chicken-burger', 'schezwan-chicken-burger', 'chicken-cheese-burger'],
  },
  {
    id: 'craver',
    title: 'Craver',
    itemIds: ['coleslaw-cheese-craver', 'signature-paneer-cheese-craver'],
  },
  {
    id: 'maggi-bowl',
    title: 'Maggi Bowl',
    itemIds: ['soupy-maggi', 'egg-chicken-soupy-maggi'],
  },
  {
    id: 'ultimate-delight-bowls',
    title: 'Meals In Bowls - Ultimate Delight Bowls',
    itemIds: ['butter-chicken-rice-bowl', 'chicken-masala-rice-bowl', 'kadai-chicken-rice-bowl', 'mughlai-chicken-rice-bowl', 'egg-kadai-rice-bowl', 'egg-mughlai-rice-bowl', 'paneer-butter-masala-rice-bowl', 'shahi-paneer-rice-bowl', 'paneer-kadai-rice-bowl', 'mushroom-kadai-rice-bowl', 'dal-tadka-rice-bowl'],
  },
  {
    id: 'signature-combos',
    title: 'Signature Combos',
    itemIds: ['stuffed-veg-burger-combo', 'veg-maggi-paneer-bowl-combo'],
  },
  {
    id: 'cold-beverages',
    title: 'Cold Beverages',
    itemIds: ['dry-fruits-milkshake', 'oreo-thick-shake', 'chocolate-thick-shake', 'rose-milk', 'belgium-chocolate-thickshake', 'butterscotch-thickshake'],
  },
  {
    id: 'mojito',
    title: 'Mojito',
    itemIds: ['virgin-mojito', 'blue-lime-mojito', 'mint-lime-mojito'],
  },
  {
    id: 'ice-cream',
    title: 'Ice Cream - Chilled Creamy Delight',
    itemIds: ['natural-tender-coconut-ice-cream', 'green-pistachio-ice-cream', 'black-currant-berry-ice-cream', 'choco-brownie-ice-cream', 'creamy-butterscotch-ice-cream'],
  },
  {
    id: 'poha',
    title: 'Poha',
    itemIds: ['indori-poha-ratlami-sev', 'classic-plain-poha'],
  },
  {
    id: 'hot-beverages',
    title: 'Hot Beverages',
    itemIds: ['ginger-tea', 'ginger-lemon-honey-tea', 'bourn-vita-hot', 'horlicks-hot', 'boost-hot'],
  },
  {
    id: 'brownies-lava-cakes',
    title: 'Fudgy Brownies & Molten Choco Lava Cakes',
    itemIds: ['double-choco-chip-brownie', 'roasted-hazelnut-brownie', 'red-velvet-brownie'],
  },
  {
    id: 'all-day-meal-special',
    title: 'All Day - Meal Special',
    itemIds: ['indian-breads-shahi-paneer', 'indian-breads-veg-mix-gravy', 'indian-breads-butter-chicken'],
  },
];

export const spicyWicyRestaurant = {
  name: 'Spicy Wicy - Dicey',
  location: 'Koramangala',
  deliveryTime: '25–35 min',
  offers: ['20% off up to ₹100', 'Free delivery above ₹299', 'Extra 10% off with select offers'],
};
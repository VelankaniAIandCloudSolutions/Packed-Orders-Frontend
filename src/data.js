import img1 from './img1.jpg'
const str1 = `Sweet and spicy vegetable salad <br> Veg manchurian or Crispy fried chilli paneer<br> Vegetables in hot bean sauce or Stir fried asian greens<br> Honey chilli potatoes<br> Stir fried butter garlic mushroom or Golden fried babycorn<br> Burnt garlic fried rice or Vegetable hakka noodle<br> Pineapple upndown<br> Sweet chilli sauce`;

console.log(str1)
const menu = [
    {
        id: 1,
        title: 'Asian Menu Package Veg - 8 Slot',
        category: 'Veg',
        price: 600,
        img: img1,
        desc: str1,
    },
    {
        id: 2,
        title: 'Asian Menu Package Non Veg - 8 Slot',
        category: 'Non-Veg',
        price: 650,
        img: img1,
        desc: `Sweet and spicy vegetable salad
        Veg manchurian or Crispy fried 
        chilli paneer
        Vegetables in hot bean sauce or
        Stir fried asian greens
        Honey chilli potatoes
        Stir fried butter garlic mushroom 
        or Golden fried babycorn
        Burnt garlic fried rice or Vegetable 
        hakka noodle
        Pineapple upndown
        Sweet chilli sauce `,
    },
];
export default menu;
#!/usr/bin/env node
/**
 * Generates src/lib/data/seed.ts and supabase/seed.sql from real Platter Hub orders.
 * Run: node scripts/generate-real-seed.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

const BOX = {
  signature: 150,
  tease: 120,
  breakfast: 100,
  culture: 180,
}
const EXTRAS = {
  balloon: 25,
  polaroid: 15,
  heliumBalloon: 35,
  videoRequest: 0,
  pictureRequest: 0,
}

/** @type {Array<Record<string, any>>} */
const RAW = [
  {
    n: 1, by: "Busayo", recipient: "Bukola", phone: "+1 (215) 986-6991",
    address: "86 Greatfalls Blvd, Hamilton, Ontario", date: "2026-08-06",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    paid: "full",
  },
  {
    n: 2, by: "Moyin", recipient: "Joshua Ololo", phone: "+1 437 246 9234",
    address: "50 Gerrard Street East, Toronto ON, M5B 1J6", date: "2026-08-06",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Hope this makes up for all the yeye food you've been surviving on lately. 😂 Enjoy every bite, and don't forget to tell me your favorite part. ❤️ Love you, my baby. 🫶🏽 -BigMo",
    requests: "Video of package and contents before delivery",
    paid: "full",
  },
  {
    n: 3, by: "Adenike", recipient: "Adenike", phone: "+1-778-847-3543",
    address: "1227 Mulroney Heights, Milton", date: "2026-08-06",
    items: [
      { name: "Jollof Rice", variant: "medium", price: 80, menu: "mi-jollof" },
      { name: "Peppered Fish", variant: "medium", price: 160, menu: "mi-fish" },
      { name: "Peppered Turkey", variant: "medium", price: 110, menu: "mi-turkey" },
    ],
    requests: "Substitute if needed: Peppered beef (medium) + Peppered chicken (medium)",
    paid: "full",
  },
  {
    n: 4, by: "Oladunni", recipient: "Oladunni", phone: "+1 6478348111",
    address: "412 Ellerslie Avenue, North York, M2R 1C2", date: "2026-08-07",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Happy Birthday, my love. ❤️ Your first birthday as our son's daddy makes this day even more special. Thank you for being such an amazing husband and father. I pray the Lord blesses you, strengthens you, grants you wisdom, and surrounds you with His favor in this new year. May His goodness and grace follow you always. We love you so much. Happy Birthday!",
    paid: "full",
  },
  {
    n: 5, by: "Eno Attah", recipient: "Favour Soubere", phone: "+1 (437) 898-1125",
    address: "1603 Eglinton Avenue West, Toronto, Ontario M6E 0A1, Room 208",
    date: "2026-08-08", time: "9:00 AM – 11:00 AM",
    items: [{ name: "The Tease Box", price: BOX.tease, menu: "mi-tease" }],
    note: "Happy Birthday to my favorite person! Even with the miles between us, my heart is right there with you. You are my favorite thought and my greatest comfort. I hope your day is as beautiful and warm as you are. I love you.",
    requests: "Add picture to order",
    paid: "full",
  },
  {
    n: 6, by: "Dominic", recipient: "Dominic", phone: "+1 416-948-1803",
    address: "5001 Corporate Drive, Unit 607, Burlington ON", date: "2026-08-09",
    items: [
      { name: "Efo Riro", description: "2L", price: 50, menu: "mi-efo" },
      { name: "Peppered Fish", variant: "small", price: 90, menu: "mi-fish" },
      { name: "Jollof Rice", variant: "small", price: 50, menu: "mi-jollof", description: "Very mild pepper" },
    ],
    requests: "Very mild pepper on jollof",
    paid: "full",
  },
  {
    n: 7, by: "Opemititi", recipient: "Opemititi", phone: "+1 437 333 0153",
    address: "Apartment 305, 2356 Eglinton Ave E, Scarborough, ON M1K 2P1",
    date: "2026-08-09", time: "9:00 AM – 11:00 AM",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Five senses birthday note (Taste / Smell / Sight / Hearing / Touch) — include QR code after the note.",
    requests: "Picture of package and card before sending",
    paid: "full",
  },
  {
    n: 8, by: "Adenike", recipient: "Adenike", phone: "+1-778-847-3543",
    address: "1227 Mulroney Heights, Milton", date: "2026-08-13",
    items: [
      { name: "Efo Riro", description: "3L", price: 75, menu: "mi-efo" },
      { name: "Jollof Rice", variant: "medium", price: 80, menu: "mi-jollof" },
      { name: "Egusi", description: "3L", price: 75, menu: "mi-egusi" },
    ],
    paid: "full",
  },
  {
    n: 9, by: "Abisola", recipient: "Abisola", phone: "+1 587 830 5192",
    address: "2325-68 Corporate Drive, Scarborough ON M1H 3H3", date: "2026-08-13",
    items: [
      { name: "Culture Box", description: "Afang, efo, egusi, okra", price: BOX.culture, menu: "mi-culture" },
      { name: "Peppered Turkey", variant: "small", price: 80, menu: "mi-turkey" },
    ],
    paid: "full",
  },
  {
    n: 10, by: "Idara", recipient: "Idara", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-08-14", time: "11:00 AM – 12:00 PM",
    pickup: true,
    items: [
      { name: "Half Jollof + Half Fried Rice", description: "Small tray, very mild pepper", price: 60 },
    ],
    requests: "Very mild pepper",
    paid: "full",
  },
  {
    n: 11, by: "Sane", recipient: "Ella Komolafe", phone: "+1 226 246 3521",
    address: "16 Foster Crescent, Brampton", date: "2026-08-14",
    items: [{ name: "The Tease Box", price: BOX.tease, menu: "mi-tease" }],
    paid: "full",
  },
  {
    n: 12, by: "Keisha", recipient: "Keisha", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-08-14", time: "By 5:30 PM",
    pickup: true,
    items: [
      { name: "Sample Platter", description: "Fried rice, jollof, peppered turkey, peppered chicken, peppered fish, egusi, ogbono, efo, assorted buka stew", price: 90 },
    ],
    paid: "full",
  },
  {
    n: 13, by: "Shaiyee", recipient: "Toyin", phone: "+1 (437) 263-3962",
    address: "1350 Ellesmere Rd, Scarborough ON M1P 0G6", date: "2026-08-15", time: "By 11:00 AM",
    items: [
      { name: "Breakfast Box", price: BOX.breakfast, menu: "mi-breakfast" },
      { name: "Balloon", price: EXTRAS.balloon, menu: "mi-balloon" },
    ],
    note: "Long birthday appreciation note included with order.",
    paid: "full",
  },
  {
    n: 14, by: "Nofisat", recipient: "Nofisat", phone: "TBD",
    address: "Event venue — details with customer", date: "2026-08-16", time: "1:00 PM",
    type: "event_catering", guests: 40, theme: "Danny Go",
    items: [
      { name: "Kids Birthday Catering Package", description: "Rice & mains, proteins, finger foods, sides, desserts, beverages — NO RED AND BLACK", price: 1200 },
    ],
    requests: "Condition: NO RED AND BLACK",
    total: 1200, paid: 360, // 30% deposit
  },
  {
    n: 15, by: "Adiat", recipient: "Adiat", phone: "+1 647 740 2649",
    address: "20 Mississauga Valley Blvd", date: "2026-08-20",
    items: [
      { name: "Peppered Fish", variant: "small", price: 90, menu: "mi-fish" },
      { name: "Jollof Rice", variant: "small", price: 50, menu: "mi-jollof" },
      { name: "Fried Rice", variant: "small", price: 70, menu: "mi-fried-rice", description: "Replace hotdogs with liver" },
    ],
    requests: "Replace hotdogs with liver",
    paid: "full",
  },
  {
    n: 16, by: "Adenike", recipient: "Raphael Okpetu", phone: "+1 (647) 467-3118",
    address: "1117-543 Richmond Street West, Toronto Ontario M5V 0W9", date: "2026-08-20",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "To: Oluwatosin Okpetu / We love you! / From: The Attoyes",
    paid: "full",
  },
  {
    n: 17, by: "Divine_kc", recipient: "Divine_kc", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-08-21",
    pickup: true,
    items: [
      { name: "The Signature Box", description: "Swap turkey for suya wings", price: BOX.signature },
      { name: "Ofada Sauce (Red)", description: "500ml", price: 20, menu: "mi-ofada" },
    ],
    requests: "Swap turkey for suya wings",
    paid: "full",
  },
  {
    n: 18, by: "Jewel", recipient: "Jewel", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-08-23",
    pickup: true,
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    paid: "full",
  },
  {
    n: 19, by: "Laurent David", recipient: "Laurent David", phone: "+1 437-255-4279",
    address: "East Maple House, 181 Mill St, Toronto, ON M5A 1C8", date: "2026-08-25",
    items: [
      { name: "Fried Rice", variant: "small", price: 70, menu: "mi-fried-rice" },
      { name: "Jollof Rice", variant: "small", price: 50, menu: "mi-jollof" },
      { name: "Peppered Turkey", variant: "small", price: 80, menu: "mi-turkey" },
      { name: "Peppered Chicken", variant: "small", price: 60, menu: "mi-chicken" },
    ],
    paid: "full",
  },
  {
    n: 20, by: "Adaramoti", recipient: "Adaramoti", phone: "TBD",
    address: "7021 Guildhall Court, Mississauga, Ontario L5N 6Y7", date: "2026-08-26",
    items: [{ name: "Peppered Turkey", variant: "small", price: 80, menu: "mi-turkey" }],
    paid: "none",
  },
  {
    n: 21, by: "Nike", recipient: "Nike", phone: "+1-778-847-3543",
    address: "1227 Mulroney Heights, Milton", date: "2026-09-03",
    items: [
      { name: "Jollof Rice", variant: "large", price: 110, menu: "mi-jollof" },
      { name: "Peppered Fish", variant: "medium", price: 160, menu: "mi-fish" },
      { name: "Ayamase (Green)", description: "2L", price: 50, menu: "mi-ayamase-green" },
    ],
    requests: "No eggs — replace with more protein",
    paid: "full",
  },
  {
    n: 22, by: "ablegod4eva", recipient: "ablegod4eva", phone: "+1 647 769 8684",
    address: "73 Broadway Avenue, Apt 2205", date: "2026-09-04",
    items: [{ name: "The Tease Box", price: BOX.tease, menu: "mi-tease" }],
    paid: "full",
  },
  {
    n: 23, by: "my_own_world", recipient: "my_own_world", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-09-04",
    pickup: true,
    items: [
      { name: "The Tease Box", description: "Substitute pancakes for croissant sandwich turkey, no bacon", price: BOX.tease },
    ],
    requests: "Substitute pancakes for croissant sandwich turkey, no bacon",
    paid: "none",
  },
  {
    n: 24, by: "Diana Delphonso", recipient: "Emmanuel Badejo", phone: "+1 437 665 8468",
    address: "1356 Woodbine Avenue, M4C 4G5", date: "2026-09-10",
    items: [
      { name: "The Signature Box", price: BOX.signature, menu: "mi-signature" },
      { name: "30 Years Old Balloon", price: EXTRAS.balloon, menu: "mi-balloon" },
      { name: "Polaroid", price: EXTRAS.polaroid, menu: "mi-polaroid" },
    ],
    total: 200, paid: 200,
  },
  {
    n: 25, by: "Moon", recipient: "Anthonia (for Emerald)", phone: "+1 250 797 4216",
    address: "People's Church Play Place, 510 Mohawk Rd W, Hamilton, ON L9C 1X4",
    date: "2026-09-12", time: "Arrival ~9:15 AM",
    type: "event_catering", guests: 32, theme: "Zoom zoom zoom / Astronaut",
    items: [
      { name: "Jollof Rice", variant: "large", qty: 2, price: 110, menu: "mi-jollof" },
      { name: "Fried Rice", variant: "large", price: 120, menu: "mi-fried-rice" },
      { name: "Pasta", variant: "small", price: 50, menu: "mi-pasta" },
      { name: "Peppered Turkey", variant: "large", qty: 2, price: 160, menu: "mi-turkey" },
      { name: "Mini Hotdogs", qty: 2, price: 40, description: "20 pcs" },
      { name: "Mini Beef Sliders", qty: 2, price: 36, description: "20 pcs", menu: "mi-slider" },
      { name: "Mini Meat Pie", qty: 2, price: 20, description: "20 pcs", menu: "mi-meat-pie" },
      { name: "Signature Mocktails", description: "32 cups (12 for kids)", price: 192 },
    ],
    total: 1324, paid: 1324,
  },
  {
    n: 26, by: "Abidemi", recipient: "Abidemi", phone: "TBD",
    address: "Address pending from customer", date: "2026-09-26",
    type: "event_catering", guests: 30, theme: "Barbie",
    items: [
      { name: "Mini Hotdogs", qty: 3, price: 40, description: "30 pcs" },
      { name: "Mini Beef Sliders", qty: 3, price: 36, description: "30 pcs", menu: "mi-slider" },
      { name: "Spring Roll", qty: 2, price: 20, description: "20 pcs", menu: "mi-spring-roll" },
      { name: "Prawn in Mayonnaise Rolls", description: "15 pcs", price: 45 },
      { name: "Puff-Puff", qty: 1, price: 8, description: "50 pcs", menu: "mi-puff" },
      { name: "Cake Pops", description: "25 pcs", price: 30, menu: "mi-cake-pops" },
      { name: "Doughnuts", description: "20 pcs", price: 40 },
      { name: "Cake Slices", qty: 2, price: 16, description: "20 pcs", menu: "mi-cake-slice" },
      { name: "Fresh Fruit Cups", description: "15 pcs", price: 12, menu: "mi-fruit-cups" },
    ],
    requests: "No setup and styling",
    total: 640.5, paid: 640.5,
  },
  {
    n: 27, by: "Jane Keke", recipient: "Jane Keke", phone: "TBD",
    address: "329 Vanilla Trail, Thorold", date: "2026-09-26", time: "Setup by 3:00 PM",
    type: "event_catering", guests: 15, theme: "Pink, gold, white — PJ birthday",
    items: [
      { name: "PJ Birthday Catering Package", description: "Jollof, fried rice, pasta, peppered turkey, grilled chicken, wings, mini hotdogs/sliders, desserts, signature cocktails", price: 1050 },
    ],
    styling: 100, delivery: 50,
    requests: "Delivery & Pickup + Styling & Setup. Setup by 3pm.",
    total: 1200, paid: 1200,
  },
  {
    n: 28, by: "Sonia", recipient: "Sonia", phone: "+1 647-901-6615",
    address: "160 Vanderhoof Ave, M4G 0B7, Toronto (Leaside)", date: "2026-09-27",
    items: [
      { name: "The Signature Box", description: "Substitute pasta box for a second jollof box", price: BOX.signature },
      { name: "Helium Balloon", price: EXTRAS.heliumBalloon, menu: "mi-balloon" },
      { name: "Polaroid", price: EXTRAS.polaroid, menu: "mi-polaroid" },
    ],
    note: "Long 40th birthday message included with order.",
    requests: "Substitute pasta box for a second jollof box",
    paid: "full",
  },
  {
    n: 29, by: "Ubuntu", recipient: "Ubuntu", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-09-27", time: "12:00 PM",
    pickup: true,
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Enjoy your meal",
    paid: "full",
  },
  {
    n: 30, by: "Amarachukwu Ezeh", recipient: "Amarachukwu Ezeh", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-09-27",
    pickup: true,
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    requests: "Blank note",
    paid: "full",
  },
  {
    n: 31, by: "Adenike", recipient: "Adenike", phone: "+1-778-847-3543",
    address: "1227 Mulroney Heights, Milton", date: "2026-10-01",
    items: [
      { name: "Peppered Chicken", variant: "medium", price: 90, menu: "mi-chicken" },
      { name: "Efo Riro", description: "3L", price: 75, menu: "mi-efo" },
      { name: "Ayamase (Red)", description: "3L", price: 75, menu: "mi-ayamase-red" },
    ],
    paid: "full",
  },
  {
    n: 32, by: "dhami_xo", recipient: "Akanni", phone: "(506) 999-2886",
    address: "128 Grandravine Drive", date: "2026-10-03", time: "By 9:00 AM",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Long appreciation note to Akanni included with order. Contact: Opeyemi.",
    paid: "full",
  },
  {
    n: 33, by: "Franchesca", recipient: "Son", phone: "+1 437 661 8059",
    address: "Bayhampton Crescent, Thornhill, ON L4J 7G9", date: "2026-10-04", time: "12:30 PM",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Happy 17th Birthday Son❤️ We pray that your new age will bring you joy, fulfillment, favour, wisdom and amazing opportunities. Love from dad, mum and sis.",
    requests: "Originally marked pickup; deliver at 12:30",
    paid: "full",
  },
  {
    n: 34, by: "Melissa", recipient: "Josiah", phone: "+1 (416) 456-0698",
    address: "2910-159 Wellesley Street East, Toronto, M4Y 0H5", date: "2026-10-15",
    items: [{ name: "The Tease Box", price: BOX.tease, menu: "mi-tease" }],
    requests: "Date to be confirmed — tentatively Thursday 15 Oct",
    paid: "full",
  },
  {
    n: 35, by: "Mikazzi", recipient: "Felix", phone: "+1 (437) 556-8263",
    address: "410 - 3250 Carding Mill Trail, Oakville, Ontario L6M 5T3", date: "2026-10-15",
    items: [{ name: "The Tease Box", price: BOX.tease, menu: "mi-tease" }],
    note: "Just a little treat for my favourite person …love from Oma",
    paid: "full",
  },
  {
    n: 36, by: "Adenike", recipient: "Adenike", phone: "+1-778-847-3543",
    address: "1227 Mulroney Heights, Milton", date: "2026-10-15",
    items: [
      { name: "Efo Riro", description: "4L", price: 100, menu: "mi-efo" },
      { name: "Peppered Beef", variant: "small", price: 150, menu: "mi-beef" },
      { name: "Peppered Turkey", variant: "small", price: 80, menu: "mi-turkey" },
    ],
    paid: "full",
  },
  {
    n: 37, by: "latre_exclusivefashion", recipient: "Calvin", phone: "+1 (226) 637-2859",
    address: "5191 Dundas Street West, Unit 1105", date: "2026-10-16",
    items: [
      { name: "The Tease Box", price: BOX.tease, menu: "mi-tease" },
      { name: "Polaroid", price: EXTRAS.polaroid, menu: "mi-polaroid" },
      { name: "Birthday Balloon", price: EXTRAS.balloon, menu: "mi-balloon" },
    ],
    note: "Calvin @ 40! God bless you as you step unto the 4th floor!🙏🏼 Gmama & Oyin! 🤍🥳",
    requests: "Polaroid picture + birthday balloon; include emojis on note",
    paid: "full",
  },
  {
    n: 38, by: "Big_mo", recipient: "Joshua Ololo", phone: "+1 437 246 9234",
    address: "50 Gerrard Street East, Toronto ON, M5B 1J6", date: "2026-10-17",
    items: [
      { name: "The Tease Box", description: "Replace pancakes with small chops", price: BOX.tease },
    ],
    requests: "Replace pancakes with small chops",
    paid: "none",
  },
  {
    n: 39, by: "Dolly", recipient: "Dolly", phone: "TBD",
    address: "65 Broadway Avenue, Toronto", date: "2026-10-17",
    items: [{ name: "Peppered Chicken", variant: "medium", price: 90, menu: "mi-chicken" }],
    paid: "full",
  },
  {
    n: 40, by: "athomewuthdunni_daily", recipient: "Alex Adeoba", phone: "TBD",
    address: "81 Irwin Road, Unit 17, Etobicoke, Ontario M9W 5W1",
    date: "2026-10-22", time: "2:00 PM – 2:45 PM",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Happy birthday to you daddy. We love you so much.",
    paid: "full",
  },
  {
    n: 41, by: "Adenike", recipient: "Adenike", phone: "+1-778-847-3543",
    address: "1227 Mulroney Heights, Milton", date: "2026-10-22",
    items: [
      { name: "Efo Riro", description: "4L", price: 100, menu: "mi-efo" },
      { name: "Peppered Beef", variant: "medium", price: 240, menu: "mi-beef" },
    ],
    paid: "full",
  },
  {
    n: 42, by: "Obiyinka Yetunde", recipient: "Obiyinka Yetunde", phone: "TBD",
    address: "990 Gainsborough Rd, London, ON N6H 5L4", date: "2026-10-23",
    items: [
      { name: "The Signature Box", description: "Customised box — Best hubby ❤️", price: BOX.signature },
      { name: "Polaroid", price: EXTRAS.polaroid, menu: "mi-polaroid" },
    ],
    requests: "Customised box text: Best hubby ❤️",
    paid: "full",
  },
  {
    n: 43, by: "Jessy", recipient: "Jessy", phone: "+1 (437) 473-7570",
    address: "19 Marta Ave, Side door, Scarborough", date: "2026-10-23",
    items: [
      { name: "The Signature Box", price: BOX.signature, menu: "mi-signature" },
      { name: "Polaroid", price: EXTRAS.polaroid, menu: "mi-polaroid" },
      { name: "Birthday Balloon", price: EXTRAS.balloon, menu: "mi-balloon" },
      { name: "Cheesecake Shooters", variant: "small", price: 15, menu: "mi-cheesecake" },
    ],
    note: "Long long-distance birthday note included. Alt phone: +234 903 150 1350",
    requests: "Polaroid + birthday balloon + cheesecake",
    paid: "full",
  },
  {
    n: 44, by: "Idara", recipient: "Idara", phone: "Pickup",
    address: "Pickup — customer to collect", date: "2026-10-25", time: "By 11:00 AM",
    pickup: true,
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    requests: "Blank note",
    paid: "full",
  },
  {
    n: 45, by: "latre_exclusivefashion", recipient: "latre_exclusivefashion", phone: "TBD",
    address: "9 Valhalla Inn Road, Etobicoke", date: "2026-10-25",
    items: [
      { name: "Fried Rice", variant: "large", price: 120, menu: "mi-fried-rice" },
      { name: "Jollof Rice", variant: "large", qty: 2, price: 110, menu: "mi-jollof" },
      { name: "Peppered Fish", variant: "medium", price: 160, menu: "mi-fish" },
      { name: "Peppered Chicken", variant: "large", price: 130, menu: "mi-chicken" },
    ],
    total: 649, paid: 350,
  },
  {
    n: 46, by: "Ohenemaa Titi", recipient: "Isaac Darko", phone: "+1 (437) 999-8157",
    address: "20 Huronia Crt, Brampton, ON L6S 2C7", date: "2026-11-07",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    paid: "full",
  },
  {
    n: 47, by: "Zikky of Lagos", recipient: "Zikky of Lagos", phone: "+353 899 568066",
    address: "2847 Lake Shore Blvd W, Toronto, ON M8V 1H8", date: "2026-11-07", time: "By 6:00 PM",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    paid: "full",
  },
  {
    n: 48, by: "Ellah", recipient: "Godwin", phone: "+1 (416) 746-5600",
    address: "5 Mabelle Ave, Etobicoke", date: "2026-11-13",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Happy Birthday Itams / Thank you for being a super friend / God bless you immensely",
    paid: "full",
  },
  {
    n: 49, by: "W", recipient: "Husna", phone: "+1 (437) 605-2547",
    address: "263 Dixon Road, Apt 812", date: "2026-11-19",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "I hope you eat so much till your stomach explodes idiot / Happy Birthday Husna",
    paid: "full",
  },
  {
    n: 50, by: "Rita E.A", recipient: "Rita E.A", phone: "+1 (437) 505-3468",
    address: "22 John Street, York M9N 0B1", date: "2026-11-19",
    items: [{ name: "The Signature Box", price: BOX.signature, menu: "mi-signature" }],
    note: "Happy birthday mummy's heart 🤣🤣 / Love you dear brother / Welcome to the 30”s club / Enjoy Grace / Love from Julie",
    paid: "full",
  },
]

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function customerId(name, index) {
  return `cu-${slug(name)}-${index}`
}

function build() {
  const customersMap = new Map()
  const customers = []
  const orders = []

  for (const raw of RAW) {
    const key = `${raw.by}|${raw.phone || ""}`
    let customer = customersMap.get(key)
    if (!customer) {
      const id = customerId(raw.by, customers.length + 1)
      customer = {
        id,
        name: raw.by,
        phone: raw.phone && raw.phone !== "Pickup" && raw.phone !== "TBD" ? raw.phone : "Not provided",
        address: raw.address?.startsWith("Pickup") ? null : raw.address || null,
        created_at: `${raw.date}T12:00:00.000Z`,
        updated_at: `${raw.date}T12:00:00.000Z`,
      }
      customersMap.set(key, customer)
      customers.push(customer)
    }

    const lineItems = (raw.items || []).map((item, i) => {
      const qty = item.qty || 1
      const unit = item.price ?? 0
      return {
        id: `li-${raw.n}-${i + 1}`,
        order_id: `ord-${raw.n}`,
        menu_item_id: item.menu || null,
        name: item.name,
        description: item.description || null,
        variant: item.variant || null,
        quantity: qty,
        unit_price: unit,
        total_price: qty * unit,
      }
    })

    const productFee = lineItems.reduce((s, l) => s + l.total_price, 0)
    const deliveryFee = raw.delivery || 0
    const stylingFee = raw.styling || 0
    const total = raw.total != null ? raw.total : productFee + deliveryFee + stylingFee
    let amountPaid = 0
    let paymentStatus = "pending"
    if (raw.paid === "full") {
      amountPaid = total
      paymentStatus = "paid"
    } else if (raw.paid === "none") {
      amountPaid = 0
      paymentStatus = "pending"
    } else if (typeof raw.paid === "number") {
      amountPaid = raw.paid
      paymentStatus = amountPaid >= total ? "paid" : amountPaid > 0 ? "partial" : "pending"
    }

    const orderType = raw.type || "food_delivery"
    const status =
      raw.date < "2026-11-20" ? "completed" : amountPaid > 0 ? "confirmed" : "pending"

    orders.push({
      id: `ord-${raw.n}`,
      order_number: `ORD-${2000 + raw.n}`,
      order_type: orderType,
      customer_id: customer.id,
      customer_name: raw.by,
      phone: customer.phone,
      address: raw.address || "Address pending",
      event_date: raw.date,
      event_time: raw.time || null,
      recipient: raw.recipient || raw.by,
      special_requests: raw.requests || null,
      guest_count: raw.guests || null,
      theme: raw.theme || null,
      table_organisation: false,
      table_style: null,
      table_count: null,
      seating_notes: null,
      styling_fee: stylingFee,
      delivery_fee: deliveryFee,
      product_fee: productFee,
      total_price: total,
      amount_paid: amountPaid,
      payment_status: paymentStatus,
      status,
      notes: raw.note || (raw.pickup ? "Pickup order" : null),
      created_at: `${raw.date}T10:00:00.000Z`,
      updated_at: `${raw.date}T10:00:00.000Z`,
      line_items: lineItems,
    })
  }

  return { customers, orders }
}

const CATEGORIES = [
  ["cat-boxes", "Signature Boxes", "Curated gift and meal boxes", 0],
  ["cat-rice", "Rice & Pasta", "Signature rice dishes and pasta trays", 1],
  ["cat-proteins", "Proteins", "Peppered and grilled proteins", 2],
  ["cat-soups", "Soups & Sauces", "Soups by the litre and specialty sauces", 3],
  ["cat-finger", "Finger Foods", "Passed bites and party favourites", 4],
  ["cat-desserts", "Desserts", "Sweet finishes for any gathering", 5],
  ["cat-fruits", "Fresh Fruits", "Cups, skewers, and platters", 6],
  ["cat-extras", "Extras", "Balloons, polaroids, and add-ons", 7],
]

const MENU = [
  ["mi-signature", "cat-boxes", "The Signature Box", "Curated signature gift meal box", 150, null, null, "per box", 1],
  ["mi-tease", "cat-boxes", "The Tease Box", "Breakfast / tease gift box", 120, null, null, "per box", 2],
  ["mi-breakfast", "cat-boxes", "Breakfast Box", "Breakfast assortment box", 100, null, null, "per box", 3],
  ["mi-culture", "cat-boxes", "Culture Box", "Afang, efo, egusi, okra culture box", 180, null, null, "per box", 4],
  ["mi-jollof", "cat-rice", "Jollof Rice", "Party-style jollof, smoky and richly seasoned", 50, 80, 110, null, 1],
  ["mi-fried-rice", "cat-rice", "Fried Rice", "Vegetable fried rice with aromatic spices", 70, 100, 120, null, 2],
  ["mi-native-rice", "cat-rice", "Native Rice", "Palm oil native rice with local spices", 80, 120, 150, null, 3],
  ["mi-pasta", "cat-rice", "Pasta", "Creamy or tomato-based pasta trays", 50, null, null, null, 4],
  ["mi-chicken", "cat-proteins", "Peppered Chicken", "Spicy peppered chicken pieces", 60, 90, 130, null, 1],
  ["mi-turkey", "cat-proteins", "Peppered Turkey", "Tender peppered turkey", 80, 110, 160, null, 2],
  ["mi-fish", "cat-proteins", "Peppered Fish", "Fresh fish in pepper sauce", 90, 160, 250, null, 3],
  ["mi-beef", "cat-proteins", "Peppered Beef", "Slow-cooked peppered beef", 150, 240, 350, null, 4],
  ["mi-efo", "cat-soups", "Efo Riro", "Vegetable soup priced per litre tray", 25, 50, 75, "per litre tier", 1],
  ["mi-egusi", "cat-soups", "Egusi", "Melon-seed soup priced per litre tray", 25, 50, 75, "per litre tier", 2],
  ["mi-ogbono", "cat-soups", "Ogbono", "Draw soup priced per litre tray", 25, 50, 75, "per litre tier", 3],
  ["mi-afang", "cat-soups", "Afang", "Afang soup priced per litre tray", 25, 50, 75, "per litre tier", 4],
  ["mi-okra", "cat-soups", "Okra", "Okra soup priced per litre tray", 25, 50, 75, "per litre tier", 5],
  ["mi-ayamase-green", "cat-soups", "Ayamase (Green)", "Green ayamase sauce", 25, 50, 75, "per litre tier", 6],
  ["mi-ayamase-red", "cat-soups", "Ayamase (Red)", "Red ayamase / ofada-style sauce", 25, 50, 75, "per litre tier", 7],
  ["mi-ofada", "cat-soups", "Ofada Sauce (Red)", "500ml ofada sauce", 20, null, null, "500ml", 8],
  ["mi-meat-pie", "cat-finger", "Mini Meat Pie", "Flaky mini meat pies", 6, 10, 14, "per 10 pcs", 1],
  ["mi-spring-roll", "cat-finger", "Spring Roll", "Crispy vegetable spring rolls", 6, 10, 14, "per 10 pcs", 2],
  ["mi-samosa", "cat-finger", "Samosa", "Golden mini samosas", 6, 10, 14, "per 10 pcs", 3],
  ["mi-slider", "cat-finger", "Mini Beef Slider", "Bite-sized beef sliders", 12, 18, 24, "per 10 pcs", 4],
  ["mi-puff", "cat-finger", "Puff-Puff", "Soft fried dough balls", 8, null, null, "50 pieces", 5],
  ["mi-hotdog", "cat-finger", "Mini Hotdogs", "Mini hotdogs", 8, 12, 16, "per 10 pcs", 6],
  ["mi-cheesecake", "cat-desserts", "Cheesecake Shooters", "Individual cheesecake shooters", 15, 25, 35, "per 10 pcs", 1],
  ["mi-cake-pops", "cat-desserts", "Cake Pops", "Decorated cake pops", 12, 20, 28, "per 10 pcs", 2],
  ["mi-cake-slice", "cat-desserts", "Cake Slices", "Assorted cake slices", 8, 14, 20, "per 10 pcs", 3],
  ["mi-doughnuts", "cat-desserts", "Doughnuts", "Assorted doughnuts", 10, 16, 22, "per 10 pcs", 4],
  ["mi-fruit-cups", "cat-fruits", "Fresh Fruit Cups", "Seasonal fruit cups", 5, 8, 12, "per 10 pcs", 1],
  ["mi-fruit-skewers", "cat-fruits", "Fresh Fruit Skewers", "Colourful fruit skewers", 6, 10, 14, "per 10 pcs", 2],
  ["mi-fruit-platter", "cat-fruits", "Fresh Fruit Platter", "Large mixed fruit platter", 25, 40, 60, null, 3],
  ["mi-balloon", "cat-extras", "Balloon", "Helium / birthday balloon", 25, null, null, "each", 1],
  ["mi-polaroid", "cat-extras", "Polaroid", "Polaroid photo add-on", 15, null, null, "each", 2],
]

function tsSerialize(value, indent = 0) {
  const pad = "  ".repeat(indent)
  if (value === null) return "null"
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    return `[\n${value.map((v) => pad + "  " + tsSerialize(v, indent + 1)).join(",\n")}\n${pad}]`
  }
  const entries = Object.entries(value)
  return `{\n${entries.map(([k, v]) => `${pad}  ${k}: ${tsSerialize(v, indent + 1)}`).join(",\n")}\n${pad}}`
}

function writeSeedTs({ customers, orders }) {
  const catBlock = CATEGORIES.map(
    ([id, name, description, sort]) =>
      `  {\n    id: ${JSON.stringify(id)},\n    name: ${JSON.stringify(name)},\n    description: ${JSON.stringify(description)},\n    sort_order: ${sort},\n  }`
  ).join(",\n")

  const menuBlock = MENU.map(
    ([id, cat, name, description, s, m, l, unit, sort]) =>
      `  {\n    id: ${JSON.stringify(id)},\n    category_id: ${JSON.stringify(cat)},\n    name: ${JSON.stringify(name)},\n    description: ${JSON.stringify(description)},\n    price_small: ${s},\n    price_medium: ${m},\n    price_large: ${l},\n    unit_label: ${unit == null ? "null" : JSON.stringify(unit)},\n    is_active: true,\n    sort_order: ${sort},\n  }`
  ).join(",\n")

  const content = `import type { Customer, MenuCategory, MenuItem, Order } from "@/lib/types"

/**
 * Real Platter Hub seed data (CAD).
 * Regenerated by: node scripts/generate-real-seed.mjs
 */

export const seedCategories: MenuCategory[] = [
${catBlock},
]

export const seedMenuItems: MenuItem[] = [
${menuBlock},
]

export const seedCustomers: Customer[] = ${tsSerialize(customers)}

export const seedOrders: Order[] = ${tsSerialize(orders)}
`

  fs.writeFileSync(path.join(root, "src/lib/data/seed.ts"), content)
}

function uuidFromId(prefix, id) {
  // Deterministic fake UUIDs for SQL seed based on string ids
  const hex = Buffer.from(id).toString("hex").padEnd(32, "0").slice(0, 32)
  return `${prefix}${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

function writeSql({ customers, orders }) {
  const lines = []
  lines.push(`-- Real Platter Hub seed (CAD). Generated by scripts/generate-real-seed.mjs`)
  lines.push(`-- Run AFTER supabase/schema.sql. Safe to re-run only on empty tables.`)
  lines.push(`begin;`)
  lines.push(`truncate table public.order_line_items, public.orders, public.customers, public.menu_items, public.menu_categories restart identity cascade;`)

  lines.push(`\ninsert into public.menu_categories (id, name, description, sort_order) values`)
  lines.push(
    CATEGORIES.map(([id, name, description, sort], i) => {
      const uid = uuidFromId("a", id)
      return `  ('${uid}', ${sqlStr(name)}, ${sqlStr(description)}, ${sort})${i === CATEGORIES.length - 1 ? ";" : ","}`
    }).join("\n")
  )

  const catUuid = Object.fromEntries(CATEGORIES.map(([id]) => [id, uuidFromId("a", id)]))
  const menuUuid = Object.fromEntries(MENU.map(([id]) => [id, uuidFromId("b", id)]))

  lines.push(`\ninsert into public.menu_items (id, category_id, name, description, price_small, price_medium, price_large, unit_label, sort_order) values`)
  lines.push(
    MENU.map(([id, cat, name, description, s, m, l, unit, sort], i) => {
      return `  ('${menuUuid[id]}', '${catUuid[cat]}', ${sqlStr(name)}, ${sqlStr(description)}, ${num(s)}, ${num(m)}, ${num(l)}, ${unit == null ? "null" : sqlStr(unit)}, ${sort})${i === MENU.length - 1 ? ";" : ","}`
    }).join("\n")
  )

  const custUuid = Object.fromEntries(customers.map((c) => [c.id, uuidFromId("c", c.id)]))
  lines.push(`\ninsert into public.customers (id, name, phone, address, created_at, updated_at) values`)
  lines.push(
    customers
      .map((c, i) => {
        return `  ('${custUuid[c.id]}', ${sqlStr(c.name)}, ${sqlStr(c.phone)}, ${c.address ? sqlStr(c.address) : "null"}, '${c.created_at}', '${c.updated_at}')${i === customers.length - 1 ? ";" : ","}`
      })
      .join("\n")
  )

  const orderUuid = Object.fromEntries(orders.map((o) => [o.id, uuidFromId("d", o.id)]))
  lines.push(`\ninsert into public.orders (
  id, order_number, order_type, customer_id, customer_name, phone, address,
  event_date, event_time, recipient, special_requests, guest_count, theme,
  table_organisation, styling_fee, delivery_fee, product_fee, total_price,
  amount_paid, payment_status, status, notes, created_at, updated_at
) values`)
  lines.push(
    orders
      .map((o, i) => {
        return `  ('${orderUuid[o.id]}', ${sqlStr(o.order_number)}, '${o.order_type}', '${custUuid[o.customer_id]}', ${sqlStr(o.customer_name)}, ${sqlStr(o.phone)}, ${sqlStr(o.address)}, '${o.event_date}', ${o.event_time ? sqlStr(o.event_time) : "null"}, ${o.recipient ? sqlStr(o.recipient) : "null"}, ${o.special_requests ? sqlStr(o.special_requests) : "null"}, ${o.guest_count ?? "null"}, ${o.theme ? sqlStr(o.theme) : "null"}, false, ${o.styling_fee}, ${o.delivery_fee}, ${o.product_fee}, ${o.total_price}, ${o.amount_paid}, '${o.payment_status}', '${o.status}', ${o.notes ? sqlStr(o.notes) : "null"}, '${o.created_at}', '${o.updated_at}')${i === orders.length - 1 ? ";" : ","}`
      })
      .join("\n")
  )

  const allLines = orders.flatMap((o) => o.line_items)
  lines.push(`\ninsert into public.order_line_items (
  id, order_id, menu_item_id, name, description, variant, quantity, unit_price, total_price
) values`)
  lines.push(
    allLines
      .map((li, i) => {
        const mid = li.menu_item_id && menuUuid[li.menu_item_id] ? `'${menuUuid[li.menu_item_id]}'` : "null"
        const variant = li.variant ? `'${li.variant}'` : "null"
        return `  ('${uuidFromId("e", li.id)}', '${orderUuid[li.order_id]}', ${mid}, ${sqlStr(li.name)}, ${li.description ? sqlStr(li.description) : "null"}, ${variant}, ${li.quantity}, ${li.unit_price}, ${li.total_price})${i === allLines.length - 1 ? ";" : ","}`
      })
      .join("\n")
  )

  lines.push(`commit;`)
  fs.writeFileSync(path.join(root, "supabase/seed.sql"), lines.join("\n") + "\n")
  fs.writeFileSync(path.join(root, "supabase/seed-real.sql"), lines.join("\n") + "\n")
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`
}
function num(n) {
  return n == null ? "null" : String(n)
}

const built = build()
writeSeedTs(built)
writeSql(built)

console.log(`Generated ${built.customers.length} customers and ${built.orders.length} orders.`)
console.log("Wrote src/lib/data/seed.ts")
console.log("Wrote supabase/seed.sql and supabase/seed-real.sql")

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Dummy data only — swap imageUrl/description for real product photos and
// copy from your father once the layout is settled. Prices in paise (INR).
async function main() {
  await db.product.deleteMany();

  await db.product.createMany({
    data: [
      {
        name: "Heritage Canvas Tote",
        slug: "heritage-canvas-tote",
        stock: 14,
        description:
          "Sturdy canvas tote with leather trim, built for daily carry.",
        price: 79900,
        originalPrice: 99900,
        imageUrl: "/placeholder-tote.jpg",
        category: "Tote",
      },
      {
        name: "Everyday Leather Sling",
        slug: "everyday-leather-sling",
        stock: 8,
        description: "Compact cross-body sling in full-grain leather.",
        price: 149900,
        imageUrl: "/placeholder-sling.jpg",
        category: "Sling",
      },
      {
        name: "Weekender Duffel",
        slug: "weekender-duffel",
        stock: 5,
        description:
          "Roomy duffel for short trips, reinforced base and straps.",
        price: 219900,
        originalPrice: 259900,
        imageUrl: "/placeholder-duffel.jpg",
        category: "Travel",
      },
      {
        name: "Office Laptop Satchel",
        slug: "office-laptop-satchel",
        stock: 10,
        description:
          "Padded 15-inch laptop compartment, structured silhouette.",
        price: 189900,
        imageUrl: "/placeholder-satchel.jpg",
        category: "Work",
      },
      {
        name: "Mini Crossbody",
        slug: "mini-crossbody",
        stock: 20,
        description: "Everyday essentials only — phone, cards, keys.",
        price: 59900,
        originalPrice: 74900,
        imageUrl: "/placeholder-mini.jpg",
        category: "Sling",
      },
      {
        name: "Market Jute Bag",
        slug: "market-jute-bag",
        stock: 30,
        description: "Woven jute, foldable, made for daily errands.",
        price: 34900,
        imageUrl: "/placeholder-jute.jpg",
        category: "Tote",
      },
      {
        name: "Rugged Backpack",
        slug: "rugged-backpack",
        stock: 6,
        description: "Two-compartment backpack with water-resistant canvas.",
        price: 169900,
        imageUrl: "/placeholder-backpack.jpg",
        category: "Work",
      },
      {
        name: "Travel Duffel — Large",
        slug: "travel-duffel-large",
        stock: 4,
        description: "Extra capacity duffel for longer trips.",
        price: 249900,
        originalPrice: 299900,
        imageUrl: "/placeholder-duffel-large.jpg",
        category: "Travel",
      },
    ],
  });
}

main().finally(() => db.$disconnect());

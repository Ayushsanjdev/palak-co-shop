// Structure here is boilerplate -- add new keys as you build more UI.
// The Hindi strings ARE NOT final -- they're a plain-Hindi first draft.
// You live in Barh; you'll know far better than I do whether these read
// naturally for your actual customers, or whether something closer to
// how people actually speak there (vs. textbook Hindi) would land better.
// Rewrite freely -- this file has no logic, only content.

export const dictionary = {
  en: {
    tagline: "Good bags, picked for Barh.",
    subtitle:
      "A trusted local shop for canvas, leather, and jute bags — quality picked, priced fair.",
    onSale: "On sale",
    allBags: "All bags",
    addToCart: "Add to cart",
    login: "Log in",
    cart: "Cart",
    home: "Home",
    deliveryNote: "Free delivery in Barh",
  },
  hi: {
    tagline: "अच्छे बैग, Barh के लिए चुने हुए।",
    subtitle:
      "कैनवास, लेदर और जूट बैग की भरोसेमंद लोकल दुकान — क्वालिटी देखकर चुनी गई, सही दाम में।",
    onSale: "सेल पर",
    allBags: "सारे बैग",
    addToCart: "कार्ट में डालें",
    login: "लॉग इन करें",
    cart: "कार्ट",
    home: "होम",
    deliveryNote: "Barh में फ्री डिलीवरी",
  },
} as const;

export type Language = keyof typeof dictionary;
export type DictionaryKey = keyof typeof dictionary.en;

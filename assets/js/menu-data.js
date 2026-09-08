/* Menu content for ANDRES Rooftop Smokehouse and Grill.
   Single source of truth — the on-page menu and the downloadable PDF are
   both generated from this, so the two can never drift apart.
   Swap these entries for the client's real menu when it arrives. */

window.MENU = {
  courses: [
    { id: "smokehouse", name: "From the Smokehouse", note: "Post oak, low and slow. Sold by the pound until it runs out." },
    { id: "grill",      name: "Off the Grill",       note: "Cooked to order over live fire." },
    { id: "starters",   name: "To Start",            note: "Small plates for the table while the coals settle." },
    { id: "sides",      name: "Sides",               note: "Everything made in house, every morning." },
    { id: "desserts",   name: "Something Sweet",     note: "Ask your server what the pastry section is running." },
    { id: "bar",        name: "Bar & Zero-Proof",    note: "Full list available on the terrace." }
  ],

  items: [
    /* Smokehouse */
    { course: "smokehouse", name: "Brisket, Half Pound", price: 26, tags: ["gf"],
      desc: "Fourteen hours over post oak, salt and pepper bark, sliced to order. Moist or lean." },
    { course: "smokehouse", name: "Baby Back Ribs", price: 29, tags: ["gf"],
      desc: "Glazed and finished hot so the edges catch. Half rack." },
    { course: "smokehouse", name: "Smoked Beef Rib", price: 38, tags: ["gf"],
      desc: "One enormous bone. Enough for two people who are serious about it." },
    { course: "smokehouse", name: "Pulled Pork Shoulder", price: 22, tags: ["gf"],
      desc: "Twelve hours, pulled at the pass, vinegar slaw on the side." },
    { course: "smokehouse", name: "The Pitmaster Board", price: 68, tags: [],
      desc: "Brisket, ribs, sausage, pulled pork, two sides and cornbread. Built for the table." },
    { course: "smokehouse", name: "Hot Link Sausage", price: 16, tags: ["gf"],
      desc: "Made in house, coarse ground, plenty of black pepper.", soldOut: true },

    /* Grill */
    { course: "grill", name: "Bone-In Ribeye", price: 54, tags: ["gf"],
      desc: "Sixteen ounces over open flame, rested in beef fat, flaked salt." },
    { course: "grill", name: "Cedar Plank Redfish", price: 34, tags: ["gf"],
      desc: "Gulf caught, cooked on cedar until the edges crisp. Herb butter, charred lemon." },
    { course: "grill", name: "Gulf Shrimp Skewers", price: 24, tags: ["gf"],
      desc: "Head-on, grilled hard and fast, chili butter and lime." },
    { course: "grill", name: "Half Chicken", price: 27, tags: ["gf"],
      desc: "Brined overnight, finished skin-side down over the coals. Salsa verde." },
    { course: "grill", name: "Charred Cauliflower Steak", price: 21, tags: ["v", "gf"],
      desc: "Cut thick, roasted whole, smoked garlic butter and toasted pecan." },
    { course: "grill", name: "Bourbon-Glazed Pork Belly", price: 28, tags: ["gf"],
      desc: "Slow-cooked, pressed overnight, lacquered in bourbon glaze. Celeriac purée, pickled onion." },

    /* Starters */
    { course: "starters", name: "Smoked Queso", price: 14, tags: ["v"],
      desc: "Smoked over oak, brisket burnt ends folded through, warm tortilla chips." },
    { course: "starters", name: "Burnt Ends", price: 18, tags: ["gf"],
      desc: "The caramelised corners of yesterday's brisket. Limited every evening." },
    { course: "starters", name: "Blistered Shishitos", price: 11, tags: ["v", "gf"],
      desc: "Straight off the flat-top with sea salt and citrus. One in ten bites back." },
    { course: "starters", name: "Deviled Eggs", price: 10, tags: ["gf"],
      desc: "Smoked paprika, pickled mustard seed, crisp shallot." },
    { course: "starters", name: "Grilled Chanterelles", price: 19, tags: ["v", "gf"],
      desc: "Wild mushrooms straight onto the grate, shaved parmesan, thyme, garlic cream to dip." },
    { course: "starters", name: "Skillet Cornbread", price: 10, tags: ["v"],
      desc: "Brown butter, honey, jalapeño and sharp cheddar. Served in the pan." },

    /* Sides */
    { course: "sides", name: "Ember Potatoes", price: 10, tags: ["v", "gf"],
      desc: "Buried in the coals, split and dressed with smoked crème and chive." },
    { course: "sides", name: "Mac and Cheese", price: 11, tags: ["v"],
      desc: "Three cheeses, baked until the top goes brown at the edges." },
    { course: "sides", name: "Vinegar Slaw", price: 8, tags: ["v", "gf"],
      desc: "Sharp, cold and crunchy. The thing that cuts through everything else." },
    { course: "sides", name: "Charred Green Beans", price: 9, tags: ["v", "gf"],
      desc: "Blistered hard and fast, chili crisp, toasted sesame." },
    { course: "sides", name: "Pit Beans", price: 9, tags: ["gf"],
      desc: "Slow cooked under the brisket all day, exactly as they should be." },

    /* Desserts */
    { course: "desserts", name: "Banana Pudding", price: 11, tags: ["v"],
      desc: "Vanilla wafers, thick cream, made fresh each morning." },
    { course: "desserts", name: "Smoked Chocolate Pot", price: 12, tags: ["v", "gf"],
      desc: "Dark chocolate infused with oak smoke, sea salt, olive oil." },
    { course: "desserts", name: "Grilled Peach Cobbler", price: 12, tags: ["v"],
      desc: "Whatever stone fruit is at its peak, over the coals, vanilla ice cream." },

    /* Bar */
    { course: "bar", name: "Smoked Old Fashioned", price: 17, tags: [],
      desc: "Rye, demerara, oak smoke trapped under glass and released at the table." },
    { course: "bar", name: "Rooftop Spritz", price: 15, tags: ["v"],
      desc: "Aperitivo, grapefruit, prosecco, rosemary ash rim." },
    { course: "bar", name: "Barrel-Rested Negroni", price: 16, tags: [],
      desc: "Rested six weeks upstairs. Orange oil, one big cube." },
    { course: "bar", name: "Texas Iced Tea", price: 6, tags: ["v", "gf"],
      desc: "Fresh lemon, lightly sweetened. Free refills, as it should be." },
    { course: "bar", name: "Blackberry Smash", price: 12, tags: ["v", "gf"],
      desc: "Muddled blackberry, mint and lime over crushed ice. Zero proof." }
  ],

  tagNames: { v: "Vegetarian", gf: "Gluten free" }
};

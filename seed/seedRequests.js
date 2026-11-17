// helpRequests seed — owned by Heta Vimaleshkumar Patel
import { faker } from "@faker-js/faker";
import { AREAS, URGENCY_RANK, URGENCIES } from "../utils/constants.js";

const TEMPLATES = {
  Groceries: [
    ["Milk, eggs, and bread this week", "I'm sick and can't get to the store. A small list, I'll pay you back right away."],
    ["Pick up a few groceries", "Need rice, lentils, and vegetables from the market. Happy to Venmo in advance."],
    ["Help carrying a big grocery order", "I don't have a car and need to bring back a heavy load of water and staples."],
  ],
  "Package pickup": [
    ["Grab my package from the mailroom", "I'm away until the weekend and my package will be returned if nobody picks it up."],
    ["Pick up a parcel at the post office", "The slip is in my name and I can send an authorization note."],
    ["Receive a delivery for me", "A desk is arriving while I'm in class. Need someone to sign for it."],
  ],
  "Borrow an item": [
    ["Borrow a vacuum for an hour", "Moving-out inspection tomorrow and I don't own one."],
    ["Need a drill for one shelf", "Just need to mount one shelf, will return it the same day."],
    ["Borrow a winter coat for a trip", "Going somewhere cold for three days and only have a light jacket."],
  ],
  Rides: [
    ["Ride to the airport early morning", "Flight leaves at 7am and transit doesn't run that early. Will pay for gas."],
    ["Ride to a doctor's appointment", "Short drive, about 20 minutes each way."],
    ["Lift to the hardware store", "Need to buy a few heavy items for my apartment."],
  ],
  Meals: [
    ["Home-cooked meal while I recover", "Had a small surgery and can't cook for a few days. Vegetarian please."],
    ["Soup during a bad cold", "Anything warm would mean a lot. I can pay for ingredients."],
    ["Lunch on exam day", "Back-to-back exams and no time to eat. Would love a packed lunch."],
  ],
  "Moving help": [
    ["Two hands to move a couch", "Moving one couch down two flights of stairs. Should take 30 minutes."],
    ["Help packing my room", "Moving next week, need help boxing books and kitchen things."],
    ["Carry boxes to a new apartment", "Only six boxes, new place is a short walk away."],
  ],
  "Tech help": [
    ["Set up my new laptop", "Need help installing software for my classes."],
    ["Fix my printer connection", "Printer won't connect to Wi-Fi and I have an assignment due."],
    ["Recover files from a USB stick", "My drive stopped showing up and it has my project files."],
  ],
  Other: [
    ["Walk my dog for two days", "I'll be at a conference. She's friendly and small."],
    ["Water plants while I travel", "Five plants, need watering twice over a week."],
    ["Proofread a cover letter", "One page, applying for an on-campus job."],
  ],
};

const CONTACT_NOTES = [
  "Email me at my campus address.",
  "Message me on the class Discord.",
  "Text me, I'll share my number once you confirm.",
  "Find me on Teams under my full name.",
];

const THANK_YOU_NOTES = [
  "Thank you so much, this made my week easier.",
  "Super kind and on time. Really appreciated it.",
  "You saved me a long trip. Thank you!",
  "Very friendly and helpful.",
  "",
];

export async function seedRequests(db, users, count = 1200) {
  const collection = db.collection("helpRequests");
  await collection.deleteMany({});

  const categories = Object.keys(TEMPLATES);
  const docs = [];

  for (let i = 0; i < count; i += 1) {
    const requester = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);
    const [title, description] = faker.helpers.arrayElement(TEMPLATES[category]);
    const urgency = faker.helpers.arrayElement(URGENCIES);
    const createdAt = faker.date.recent({ days: 45 });
    const status = faker.helpers.weightedArrayElement([
      { weight: 6, value: "open" },
      { weight: 2, value: "in progress" },
      { weight: 2, value: "completed" },
    ]);

    let helper = null;
    let rating = null;
    if (status !== "open") {
      const candidate = faker.helpers.arrayElement(
        users.filter((u) => !u._id.equals(requester._id)),
      );
      helper = { _id: candidate._id, displayName: candidate.displayName };
    }
    if (status === "completed" && faker.datatype.boolean(0.7)) {
      rating = {
        stars: faker.number.int({ min: 3, max: 5 }),
        note: faker.helpers.arrayElement(THANK_YOU_NOTES),
        createdAt: faker.date.between({ from: createdAt, to: new Date() }),
      };
    }

    const neededBy = faker.date.soon({ days: 21 });
    neededBy.setUTCHours(12, 0, 0, 0);

    docs.push({
      title,
      description,
      category,
      urgency,
      urgencyRank: URGENCY_RANK[urgency],
      area: faker.helpers.arrayElement(AREAS),
      neededBy,
      contactNote: faker.helpers.arrayElement(CONTACT_NOTES),
      status,
      requester: { _id: requester._id, displayName: requester.displayName },
      helper,
      rating,
      createdAt,
      updatedAt: createdAt,
    });
  }

  await collection.insertMany(docs);
  await collection.createIndex({ status: 1, urgencyRank: -1, neededBy: 1 });
  await collection.createIndex({ "requester._id": 1 });
  await collection.createIndex({ "helper._id": 1 });
  return docs.length;
}

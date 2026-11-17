// helpOffers seed — owned by Trupal Jageshkumar Patel
import { faker } from "@faker-js/faker";
import { AREAS } from "../utils/constants.js";

const TEMPLATES = {
  Groceries: [
    [
      "Grocery run, can shop for 2 people",
      "Going to the big supermarket. Send me your list the day before.",
    ],
    [
      "Heading to the Indian grocery store",
      "Can pick up spices, rice, and snacks for a few people.",
    ],
    [
      "Costco trip with space in the car",
      "Room for a couple of people to come along or I can shop for you.",
    ],
  ],
  "Package pickup": [
    [
      "Mailroom runs this week",
      "I'm at the mailroom every afternoon, happy to grab packages.",
    ],
    ["Post office trip", "Can drop off returns or pick up held mail."],
  ],
  "Borrow an item": [
    [
      "Lending a vacuum and mop",
      "Available to borrow for a day, just bring it back clean.",
    ],
    [
      "Toolkit available to borrow",
      "Drill, screwdrivers, and a level. Pick up from my building.",
    ],
    ["Spare air mattress for guests", "Good for a weekend visitor."],
  ],
  Rides: [
    [
      "Driving to the airport, room for 2",
      "Leaving campus in the morning, can fit two people with luggage.",
    ],
    [
      "Weekly ride to the mall",
      "I go every Sunday afternoon and have three free seats.",
    ],
    [
      "Driving home for break, can take 1",
      "Heading out of town and can drop someone along the highway.",
    ],
  ],
  Meals: [
    [
      "Cooking a big batch of dal",
      "Making extra this weekend, can share a few portions.",
    ],
    [
      "Extra lunch boxes on Mondays",
      "I meal prep and always have a couple of extra portions.",
    ],
  ],
  "Moving help": [
    [
      "Free Saturday to help with moves",
      "Strong back and free afternoon. Small moves only.",
    ],
    ["Have a hand truck, can help move", "Good for boxes and small furniture."],
  ],
  "Tech help": [
    [
      "Laptop setup and troubleshooting",
      "CS student, happy to help install software or fix Wi-Fi issues.",
    ],
    [
      "Help with resumes in Word or Docs",
      "Can help format resumes and cover letters.",
    ],
  ],
  Other: [
    [
      "Pet sitting over the weekend",
      "Love animals and will be around all weekend.",
    ],
    [
      "Plant watering while you travel",
      "Live nearby and can stop by every few days.",
    ],
  ],
};

const AVAILABILITY = [
  "9am to 12pm",
  "10am to 1pm",
  "1pm to 4pm",
  "After 5pm",
  "All afternoon",
  "Morning only",
];

const CONTACT_NOTES = [
  "Email me at my campus address after you claim.",
  "Message me on the class Discord.",
  "I'll text you, share your number in a message.",
  "Find me on Teams under my full name.",
];

const COMMENTS = [
  "Very reliable, thank you!",
  "Made my week so much easier.",
  "Kind and on time.",
  "Would happily claim a spot again.",
  "",
];

export async function seedOffers(db, users, count = 1200) {
  const collection = db.collection("helpOffers");
  await collection.deleteMany({});

  const categories = Object.keys(TEMPLATES);
  const docs = [];

  for (let i = 0; i < count; i += 1) {
    const offerer = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);
    const [title, description] = faker.helpers.arrayElement(
      TEMPLATES[category],
    );
    const spots = faker.number.int({ min: 1, max: 4 });
    const createdAt = faker.date.recent({ days: 45 });
    const isPast = faker.datatype.boolean(0.25);

    const date = isPast
      ? faker.date.between({ from: createdAt, to: new Date() })
      : faker.date.soon({ days: 21 });
    date.setUTCHours(12, 0, 0, 0);

    const others = users.filter((u) => !u._id.equals(offerer._id));
    const claimCount = faker.number.int({ min: 0, max: spots });
    const claimers = faker.helpers.arrayElements(others, claimCount);
    const claims = claimers.map((u) => ({
      userId: u._id,
      displayName: u.displayName,
      claimedAt: faker.date.between({ from: createdAt, to: new Date() }),
    }));

    let status = claims.length >= spots ? "full" : "active";
    let feedback = [];
    if (isPast) {
      status = "completed";
      feedback = claimers
        .filter(() => faker.datatype.boolean(0.6))
        .map((u) => ({
          userId: u._id,
          displayName: u.displayName,
          stars: faker.number.int({ min: 3, max: 5 }),
          comment: faker.helpers.arrayElement(COMMENTS),
          createdAt: date,
        }));
    }

    docs.push({
      title,
      description,
      category,
      area: faker.helpers.arrayElement(AREAS),
      date,
      availability: faker.helpers.arrayElement(AVAILABILITY),
      spots,
      contactNote: faker.helpers.arrayElement(CONTACT_NOTES),
      status,
      offerer: { _id: offerer._id, displayName: offerer.displayName },
      claims,
      feedback,
      createdAt,
      updatedAt: createdAt,
    });
  }

  await collection.insertMany(docs);
  await collection.createIndex({ status: 1, date: 1 });
  await collection.createIndex({ "offerer._id": 1 });
  await collection.createIndex({ "claims.userId": 1 });
  return docs.length;
}

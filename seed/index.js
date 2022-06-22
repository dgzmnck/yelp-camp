const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const newCamp = new Campground({
      author: "62afcb3df1d7e6e3ec9792bf",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: "https://res.cloudinary.com/tempdgzmnck/image/upload/v1655789204/YelpCamp/y83okromkviq6okrewhl.png",
          filename: "YelpCamp/y83okromkviq6okrewhl",
        },
        {
          url: "https://res.cloudinary.com/tempdgzmnck/image/upload/v1655789204/YelpCamp/o0rn2idxmsc8oopccmbu.png",
          filename: "YelpCamp/o0rn2idxmsc8oopccmbu",
        },
        {
          url: "https://res.cloudinary.com/tempdgzmnck/image/upload/v1655789204/YelpCamp/oxheas9jj6f5f8dnqejl.png",
          filename: "YelpCamp/oxheas9jj6f5f8dnqejl",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere suscipit quae error ratione, veniam velit iure, consectetur tempore, maxime est ducimus! Architecto sequi eius sapiente? Velit a sint vero, hic quia, et minima, eveniet nam magni libero tempore quisquam eos necessitatibus sunt ipsum quod. Dolores, distinctio nam culpa error aut, soluta voluptates magni, ut rem pariatur eum dolor illo sequi aperiam qui similique necessitatibus reprehenderit! Itaque cumque exercitationem earum ullam, eum laborum dolor blanditiis aut.",
      price: price,
      geometry: { type: "Point", coordinates: [121.1, 15.56] },
    });
    await newCamp.save();
  }
};

seedDB().then(() => {
  db.close();
});

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

import React from "react";
import {
  araku,
  charminar,
  lepakshi,
  shimla,
  tirupathi,
  vizag,
  kasi,
  tajmahal,
  unknown,
  charminar_photo,
  kasi_image,
  lepakshi_photo,
  tajmahal_photo,
  tiruplathi_photo,
} from "../PLACES";
import { Tabs, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useState } from "react";
import { data, useNavigate } from "react-router-dom";

const Landing = () => {
  const cards = [
    {
      id: 1,
      price: "araku",
      topic:
        "Explore lush coffee plantations and scenic valleys wrapped in morning mist",
      image: araku,
      circleText: "I think this Your Option",
    },
    {
      id: 2,
      price: "charminar",
      topic:
        "Discover Hyderabad’s iconic monument bustling with heritage, markets, and flavours.",
      image: charminar,
      circleText: "Your Best Choice",
    },
    {
      id: 5,
      price: "lepakshi",
      topic:
        "Witness ancient sculptures, hanging pillar wonders, and timeless temple art",
      image: lepakshi,
      circleText: "Pick This One",
    },
    {
      id: 6,
      price: "shimla",
      topic:
        "Relax in pine-scented hills with breathtaking colonial charm and cool breeze",
      image: shimla,
      circleText: "You’ll Love This",
    },
    {
      id: 7,
      price: "tirupathi",
      topic:
        "Seek Lord Venkateswara’s blessings at the world’s richest sacred temple.",
      image: tirupathi,
      circleText: "Great Daily Pick",
    },
    {
      id: 8,
      price: "vizag",
      topic: "Unwind by serene beaches and rolling hills meeting the vast sea.",
      image: vizag,
      circleText: "Worth Your Time",
    },
    {
      id: 9,
      price: "kasi",
      topic: "Feel spiritual awakening on Ganga’s ghats with chants and diyas.",
      image: kasi,
      circleText: "Top Rated Choice",
    },
    {
      id: 10,
      price: "tajmahal",
      topic:
        "Experience India’s symbol of love in pristine white marble splendour.",
      image: tajmahal,
      circleText: "Your Smart Option",
    },
  ];

  const cards_news = [
    {
      id: 1,
      text: "The photographer captured my photo so beautifully with Charminar; these pictures truly reflect Hyderabad’s charm and culture.",
      topic:
        "Capture memories at Charminar – where every stone whispers stories of Hyderabad’s rich heritage",
      image: charminar_photo,
    },
    {
      id: 2,
      text: "The photographer beautifully captured my moment on the ghats; these photos truly reflect Kasi’s spiritual vibes.",
      topic:
        "Capture your moment in Kasi, where every ghat reflects centuries of divine blessings. ",
      image: kasi_image,
    },
    {
      id: 3,
      text: "Loved how the photographer framed the temple carvings with my portrait; these pictures feel historic and artistic.",
      topic:
        "Pose with Lepakshi’s timeless sculptures that narrate ancient legends through stone art",
      image: lepakshi_photo,
    },
    {
      id: 4,
      text: "Amazing photography skills capturing Taj Mahal’s beauty with my best angles; these photos look like dreams.",
      topic:
        "Your photo here seals a memory beside the world’s greatest symbol of love.",
      image: tajmahal_photo,
    },
    {
      id: 5,
      text: "Thank you for capturing my peaceful moments after darshan so perfectly; your photos radiate divine blessings.",
      topic:
        "Keep this blessed photo close, taken at the sacred abode of Lord Venkateswara.",
      image: tiruplathi_photo,
    },
    {
      id: 6,
      text: "Loved how the photographer framed the temple carvings with my portrait; these pictures feel historic and artistic.",
      topic:
        "Pose with Lepakshi’s timeless sculptures that narrate ancient legends through stone art",
      image: lepakshi_photo,
    },
    {
      id: 7,
      text: "Amazing photography skills capturing Taj Mahal’s beauty with my best angles; these photos look like dreams.",
      topic:
        "Your photo here seals a memory beside the world’s greatest symbol of love.",
      image: tajmahal_photo,
    },
    {
      id: 8,
      text: "The photographer captured my photo so beautifully with Charminar; these pictures truly reflect Hyderabad’s charm and culture.",
      topic:
        "Capture memories at Charminar – where every stone whispers stories of Hyderabad’s rich heritage",
      image: charminar_photo,
    },
  ];

  const NewsCard = ({ text, name }) => (
    <div className="w-[320px] px-4 py-6 bg-white rounded-md news_card_shadow">
      <p className="text-[#5B6469] font-bold text-[15px]">{text}</p>
      <p className="text-right">-- {name}</p>
    </div>
  );

  const SectionTitle = ({ title, classes }) => (
    <h1
      className={`md:text-[40px] text-[30px] font-bold uppercase ${
        classes && classes
      }`}
    >
      {title}
    </h1>
  );

  const Container = ({ children }) => (
    <div className="md:w-11/12 w-full md:px-0 px-3 mx-auto">{children}</div>
  );
  const navigate = useNavigate();
  const [searchBar, setSearchBar] = useState(false);
  const [typedplace, settypedplace] = useState("");
  const isLoggedIn = !!localStorage.getItem("username");
  const handletypedplalce = () => {
    if (typedplace.length === 0) {
      alert("enter place you want to visit");
      return;
    }
    if (typedplace.length > 0 && !isLoggedIn) {
      navigate("/login");
    } else if (typedplace.length > 0 && isLoggedIn) {
      navigate("/photographers", { state: { data: typedplace } });
    }
  };

  const handleselectedplace = (place) => {
    if (isLoggedIn) {
      navigate("/photographers", { state: { data: place } });
    } else {
      navigate("/login");
    }
  };
  return (
    <div>
      <section className="z-10">
        <div className="sm:w-11/12 mx-auto">
          <div
            className={`py-8 sm:rounded-3xl relative w-full h-[620px] bg-homefrontbg bg-cover lg:bg-center bg-no-repeat bg-left`}
          >
            <div className="absolute bottom-[24%] sm:left-[6%] left-[5%] flex items-center flex-wrap gap-4">
              {searchBar && (
                <form className="flex items-end gap-4 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search by Place,Location"
                    className="bg-white bg-opacity-50 focus:bg-opacity-100 border-[1px] border-white outline-none px-4 py-2 rounded-md sm:w-[500px] w-[300px] placeholder-white"
                    onChange={(e) => settypedplace(e.target.value)}
                  />
                  <button
                    className="bg-white px-2 py-3 w-24 font-bold uppercase text-sm text-black hover:text-white hover:bg-black hover:bg-opacity-50 rounded-md"
                    onClick={() => handletypedplalce()}
                  >
                    Find
                  </button>
                </form>
              )}

              {!searchBar && (
                <button
                  onClick={() => setSearchBar(!searchBar)}
                  className="sm:text-[20px] text-white sm:px-10 px-3 py-3 rounded-md border-[1px] border-white capitalize sm:w-auto w-full font-bold"
                >
                  Find Photogrpahers
                </button>
              )}
            </div>
            <article className="lg:flex hidden items-end absolute top-[30%] right-0 w-[30%] border-l-2 h-1/2 px-2 border-l-white">
              <div className="text-white text-[26px] w-[80%]">
                Find the right Photogrpher change your memories
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="stats_box py-10 grid place-items-center lg:grid-cols-4 grid-cols-2 gap-4 sm:w-9/12 w-11/12 mx-auto -mt-8 px-4">
        <div>
          <h1 className="md:text-[40px] text-[25px] font-bold">320+</h1>
          <p>Number of Photograhaers</p>
        </div>
        <div>
          <h1 className="md:text-[40px] text-[25px] font-bold">2k</h1>
          <p>Users</p>
        </div>
        <div>
          <h1 className="md:text-[40px] text-[25px] font-bold">0</h1>
          <p>Money in funds</p>
        </div>
        <div>
          <h1 className="md:text-[40px] text-[25px] font-bold">7+</h1>
          <p>Avg Photographers in Each Location</p>
        </div>
      </section>
      <section className="my-14 md:w-11/12 w-full md:px-0 px-3 mx-auto">
        <Tabs className="sm:mt-0 mt-14">
          <TabPanel>
            <article className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 place-items-center lg:gap-14 gap-4">
              {cards.map((card) => (
                <div className="h-[550px] w-[320px]" key={card.id}>
                  <div className="relative rounded-xl overflow-hidden w-96 h-60 object-cover">
                    <img
                      src={card.image}
                      alt={card.topic}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 uppercase right-4 leading-tight font-bold w-[70px] h-[70px] flex items-center justify-center bg-white text-black rounded-full text-[10px] text-center">
                      {card.circleText}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 my-4 px-2">
                    <button
                      className="bg-[#5c807162] px-3 py-1 rounded-md text-[#6D9886] text-[17px] font-medium justify-center"
                      onClick={() => handleselectedplace(card.price)}
                    >
                      {card.price}
                    </button>
                  </div>
                  <h2 className="font-bold text-[17px] px-2 hover:text-[#6D9886] transition-colors cursor-pointer">
                    {card.topic}
                  </h2>
                </div>
              ))}
            </article>
          </TabPanel>
        </Tabs>
      </section>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6">
        <div class="flex items-center bg-white rounded-lg p-4 shadow-md">
          <div class="w-1/2">
            <h2 class="text-2xl font-bold text-blue-600 mb-2">
              Creative Designer
            </h2>
            <p class="text-gray-600 text-sm mb-4">
              I create digital experiences that inspire and engage. With a
              passion for clean design and innovative solutions, I transform
              ideas into beautiful, functional realities.
            </p>
            <div class="flex space-x-4 text-center text-sm text-gray-700 mb-4">
              <div>
                <p class="font-bold text-blue-600">80</p>
                <p>Projects</p>
              </div>
              <div>
                <p class="font-bold text-blue-600">3</p>
                <p>Years</p>
              </div>
              <div>
                <p class="font-bold text-blue-600">52</p>
                <p>Clients</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                View My Work
              </button>
              <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm">
                Get In Touch
              </button>
            </div>
          </div>
          <div class="w-1/2 relative">
            <img
              src={unknown}
              alt="Person"
              class="rounded-lg object-cover w-full h-auto shadow"
            />
            <span class="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
              UI/UX Design
            </span>
            <span class="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
              Creative Ideas
            </span>
            <span class="absolute top-1/2 right-2 bg-white px-2 py-1 text-xs rounded shadow transform -translate-y-1/2">
              Development
            </span>
          </div>
        </div>

        <div class="flex items-center bg-white rounded-lg p-4 shadow-md">
          <div class="w-1/2">
            <h2 class="text-2xl font-bold text-blue-600 mb-2">
              Creative Designer
            </h2>
            <p class="text-gray-600 text-sm mb-4">
              I create digital experiences that inspire and engage. With a
              passion for clean design and innovative solutions, I transform
              ideas into beautiful, functional realities.
            </p>
            <div class="flex space-x-4 text-center text-sm text-gray-700 mb-4">
              <div>
                <p class="font-bold text-blue-600">80</p>
                <p>Projects</p>
              </div>
              <div>
                <p class="font-bold text-blue-600">3</p>
                <p>Years</p>
              </div>
              <div>
                <p class="font-bold text-blue-600">52</p>
                <p>Clients</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                View My Work
              </button>
              <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm">
                Get In Touch
              </button>
            </div>
          </div>
          <div class="w-1/2 relative">
            <img
              src={unknown}
              alt="Person"
              class="rounded-lg object-cover w-full h-auto shadow"
            />
            <span class="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
              UI/UX Design
            </span>
            <span class="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
              Creative Ideas
            </span>
            <span class="absolute top-1/2 right-2 bg-white px-2 py-1 text-xs rounded shadow transform -translate-y-1/2">
              Development
            </span>
          </div>
        </div>

        <div class="flex items-center bg-white rounded-lg p-4 shadow-md">
          <div class="w-1/2">
            <h2 class="text-2xl font-bold text-blue-600 mb-2">
              Creative Designer
            </h2>
            <p class="text-gray-600 text-sm mb-4">
              I create digital experiences that inspire and engage. With a
              passion for clean design and innovative solutions, I transform
              ideas into beautiful, functional realities.
            </p>
            <div class="flex space-x-4 text-center text-sm text-gray-700 mb-4">
              <div>
                <p class="font-bold text-blue-600">80</p>
                <p>Projects</p>
              </div>
              <div>
                <p class="font-bold text-blue-600">3</p>
                <p>Years</p>
              </div>
              <div>
                <p class="font-bold text-blue-600">52</p>
                <p>Clients</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                View My Work
              </button>
              <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm">
                Get In Touch
              </button>
            </div>
          </div>
          <div class="w-1/2 relative">
            <img
              src={unknown}
              alt="Person"
              class="rounded-lg object-cover w-full h-auto shadow"
            />
            <span class="absolute top-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
              UI/UX Design
            </span>
            <span class="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs rounded shadow">
              Creative Ideas
            </span>
            <span class="absolute top-1/2 right-2 bg-white px-2 py-1 text-xs rounded shadow transform -translate-y-1/2">
              Development
            </span>
          </div>
        </div>
      </div>
      <section className="my-14">
        <div className="md:w-11/12 w-full md:px-0 px-3 mx-auto">
          <h1 className="md:text-[40px] text-[30px] font-bold uppercase text-center">
            Latest Photographs
          </h1>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-start gap-4 mt-8">
            {cards_news.map((card) => (
              <div
                className="h-auto w-96 mx-auto px-2 pt-2 pb-4 rounded-md border-2 border-gray-200 relative z-10"
                key={card.id}
              >
                <div className="relative rounded-xl overflow-hidden w-92 h-60 object-cover">
                  <img
                    src={card.image}
                    alt={card.topic}
                    className="w-full h-full object-cover"
                  />
                </div>
                <article className="px-2">
                  <h2 className="font-bold text-[25px] hover:text-[#6D9886] transition-colors cursor-pointer my-4">
                    {card.topic}
                  </h2>
                  <p className="font-light text-[14px]">{card.text}</p>
                  <button className="block mx-auto text-[#6D9886] mt-6">
                    Read more
                  </button>
                </article>
              </div>
            ))}
          </div>
          <div className="text-xl text-center more_news_gradient h-44 w-full text-black font-bold uppercase py-4 flex items-end justify-center relative z-20">
            <a className="cursor-pointer">More news</a>
          </div>
        </div>
      </section>
      <section className="my-14">
        <Container>
          <div className="pt-14 pb-4 h-[700px] overflow-auto bg-[#F7F7F7] flex items-center lg:flex-nowrap flex-wrap gap-1">
            <article className="lg:w-1/2 w-full lg:pb-0 pb-4 flex flex-col lg:items-start items-center lg:ml-14 lg:mt-52">
              <SectionTitle title="success stories" />
              <p className="text-[#5B6469]">
                Let's see what people say about us
              </p>
            </article>

            <div className="flex gap-4 sm:flex-nowrap flex-wrap lg:w-1/2 mx-auto">
              <div className="rounded-md w-full flex flex-col gap-3 items-center">
                <NewsCard
                  text="The photographer captured my candid moments so perfectly with Taj Mahal’s beauty; these pictures feel like movie scenes."
                  name="user1"
                />
                <NewsCard
                  text="Loved how the photographer clicked my photos creatively at Charminar; now I have real Hyderabadi vibes saved forever."
                  name="user2"
                />
                <NewsCard
                  text="The photographer made me feel comfortable on the ghats; these Kasi photos radiate spiritual peace and memories."
                  name="user3"
                />
              </div>

              <div className="rounded-md w-full flex flex-col gap-3 items-center">
                <NewsCard
                  text="The photographer captured my smiles with snow peaks in Shimla beautifully; these photos are my lifetime treasures."
                  name="user4"
                />
                <NewsCard
                  text="Thank you for clicking such peaceful photos after darshan; photographer’s patience and edits made them divine."
                  name="user5"
                />
                <NewsCard
                  text="The photographer clicked my photos in coffee plantations so beautifully; these green scenic memories feel so refreshing."
                  name="user6"
                />
              </div>

              <div className="rounded-md w-full flex flex-col gap-3 items-center">
                <NewsCard
                  text="I loved how the photographer captured me with temple carvings; every photo looks like a historic painting."
                  name="user7"
                />
                <NewsCard
                  text="Photographer took stunning beachside photos in Vizag; these pictures truly capture my peaceful moments by the sea."
                  name="user8"
                />
                <NewsCard
                  text="Such amazing photography at Taj Mahal; every picture radiates love and looks straight out of a Bollywood movie."
                  name="user9"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Landing;

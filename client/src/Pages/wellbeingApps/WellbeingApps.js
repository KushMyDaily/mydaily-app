import { GridItem, SimpleGrid } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import PageHeader from "../../comps/PageHeader";
import WellbeingCard from "../../comps/WellbeingCard";
import headspace from "./../../assets/headspace.svg";
import caliber from "./../../assets/caliber.svg";
import cronometer from "./../../assets/cronometer.svg";
import calm from "./../../assets/calm.svg";
import opal from "./../../assets/opal.svg";
import petit from "./../../assets/petit.svg";
import kwit from "./../../assets/kwit.svg";
import betterHelp from "./../../assets/betterHelp.svg";
function WellbeingApps() {
  const names = [
    {
      name: "Headspace",
      description:
        "Headspace is meditation for every experience level and lifestyle",
      tags: [
        {
          name: "sleep",
          color: "green",
        },
        {
          name: "stress",
          color: "orange",
        },
        {
          name: "focus",
          color: "lime",
        },
      ],
      image: headspace,
    },
    {
      name: "Caliber",
      description: "Science-based workouts & plans",
      tags: [
        {
          name: "exercise",
          color: "green",
        },
      ],
      image: caliber,
    },
    {
      name: "Cronometer",
      description:
        "A nutrition tracker that helps you reach you health goals, fast",
      tags: [
        {
          name: "nutrition",
          color: "green",
        },
      ],
      image: cronometer,
    },
    {
      name: "BetterHelp",
      description:
        "Convenient way to get professional help from licenses therapists.",
      tags: [
        {
          name: "therapy",
          color: "orange",
        },
      ],
      image: betterHelp,
    },
    {
      name: "Calm",
      description: "Practice mindfulness and learn the skill of meditation",
      tags: [
        {
          name: "sleep",
          color: "green",
        },
        {
          name: "stress",
          color: "orange",
        },
        {
          name: "meditation",
          color: "midGreen",
        },
      ],
      image: calm,
    },
    {
      name: "Opal",
      description: "Helps you focus so you can make the most out of every day",
      tags: [
        {
          name: "focus",
          color: "lime",
        },
      ],
      image: opal,
    },
    {
      name: "Petit BamBou",
      description: "Let your thoughts go and relax",
      tags: [
        {
          name: "sleep",
          color: "green",
        },
        {
          name: "anxiety",
          color: "orange",
        },
        {
          name: "meditation",
          color: "midGreen",
        },
      ],
      image: petit,
    },
    {
      name: "Kwit",
      description: "The app you need to quit smoking",
      tags: [
        {
          name: "health",
          color: "orange",
        },
      ],
      image: kwit,
    },
  ];
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(names);
  const [filterData, setFilterData] = useState([]);
  const [selectedTag, setSelectedTag] = useState();

  useEffect(() => {
    let filteredArray = data?.filter((item) => {
      let isTagAvailable = false;
      item.tags.forEach((itemtag) => {
        if (itemtag.name === selectedTag) {
          isTagAvailable = true;
        }
      });
      return isTagAvailable;
    });
    setFilterData(filteredArray);
  }, [selectedTag, data]);

  return (
    <>
      <PageHeader
        title="Wellbeing Apps"
        subTitle="Here is the MyDaily selection of partners"
        filterOption={true}
        data={data}
        setFilterData={setFilterData}
        setSelectedTag={setSelectedTag}
        toolTipContent="Welcome to the wellbeing apps page! <br/><br/> Browse through our partner apps and filter them by topic, language, and platform to find the best ones for you. We'll suggest apps periodically based on your usage habits and wellbeing needs.<br/><br/> Investing in your wellbeing is important, and we're here to help. Note that this is a testing version and expense options will be available in the future. <br/><br/> If you have any questions or feedback, please reach out to us."
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8} mt={6}>
        {filterData?.length ? (
          filterData?.map((item, idx) => {
            // if (!setFilterData || item.tags.name.includes(setFilterData)) {
            return (
              <GridItem key={idx} mb={2}>
                <WellbeingCard
                  title={item?.name}
                  tags={item?.tags}
                  description={item?.description}
                  image={item?.image}
                  //tags - ashish we can pass an array of tags here
                />
              </GridItem>
            );
            // }
          })
        ) : data?.length ? (
          data?.map((item, idx) => {
            return (
              <GridItem key={idx} mb={2}>
                <WellbeingCard
                  title={item?.name}
                  tags={item?.tags}
                  description={item?.description}
                  image={item?.image}
                />
              </GridItem>
            );
            // }
          })
        ) : (
          <div>No Record Found.</div>
        )}
      </SimpleGrid>
    </>
  );
}

export default WellbeingApps;

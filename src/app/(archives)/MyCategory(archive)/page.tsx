import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ModalCategories from "../ModalCategories";
import ModalTags from "../ModalTags";
import { PostDataType } from "data/types";
import { DEMO_CATEGORIES, DEMO_TAGS } from "data/taxonomies";
import { DEMO_AUTHORS } from "data/authors";
import Pagination from "components/Pagination/Pagination";
import ButtonPrimary from "components/Button/ButtonPrimary";
import ArchiveFilterListBox from "components/ArchiveFilterListBox/ArchiveFilterListBox";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import Card11 from "components/Card11/MyCard11";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionGridCategoryBox from "components/SectionGridCategoryBox/SectionGridCategoryBox";
import ButtonSecondary from "components/Button/ButtonSecondary";
import SectionSliderNewAuthors from "components/SectionSliderNewAthors/SectionSliderNewAuthors";
import { fetchPostsByCategorySlug } from "utils/api";
import qs from "qs";
import Image from "components/Image/Image";

const FILTERS = [
  { name: "Most Recent" },
  { name: "Curated by Admin" },
  { name: "Most Appreciated" },
  { name: "Most Discussed" },
  { name: "Most Viewed" },
];

const PageSportsCategory = () => {
  const [posts, setPosts] = useState<PostDataType[]>([]);

  let location = useLocation();

  useEffect(() => {
    // Загрузка данных с API
    const fetchPosts = async () => {
      try {
        //recieve last segment of url
        const lastSegment = location.pathname.split("/").filter(Boolean).pop();

        if (lastSegment === undefined) {
          return "last segment is undefined";
        }

        //this is API*
        const query = qs.stringify(
          {
            filters: {
              categories: {
                slug: { $eq: lastSegment },
              },
            },
            populate: {
              featuredImage: {
                fields: ["url"],
              },
              galleryImgs: {
                fields: ["url"],
              },
              categories: {
                fields: ["slug", "name"],
                populate: {
                  cover_image: {
                    fields: ["url"],
                  },
                },
              },
              author: {
                fields: ["firstName", "lastName", "displayName", "slug"],
                populate: {
                  avatar: {
                    fields: ["url"],
                  },
                },
              },
            },
            sort: ["date:desc"],
          },
          { encodeValuesOnly: true }
        );

        const response = await fetchPostsByCategorySlug("/articles?", query);

        const articleUpdate = response.data.map((article: any) => {
          const updatedCategories = article.categories.map((cat: any) => ({
            ...cat,
            href: `/category/${cat.slug}`,
            thumbnail: `${process.env.REACT_APP_STRAPI_HOST_URL}${cat.cover_image?.url}`,
          }));

          return {
            ...article,
            categories: updatedCategories,
            href: `/article-1/${article.slug}`,
          };
        });

        const limitedPosts = articleUpdate.slice(0, 8);
        setPosts(limitedPosts);
      } catch (error) {
        console.error("Error when load posts:", error);
      }
    };

    fetchPosts();
  }, [location.pathname]);

  return (
    <div className={`nc-PageArchive`}>
      {/* HEADER */}
      <div className="w-full px-2 xl:max-w-screen-2xl mx-auto">
        <div className="relative aspect-w-16 aspect-h-13 sm:aspect-h-9 lg:aspect-h-8 xl:aspect-h-5 rounded-3xl md:rounded-[40px] overflow-hidden z-0">
          <Image src={posts[0]?.categories[0]?.thumbnail} />

          <div className="absolute inset-0 bg-black text-white bg-opacity-30 flex flex-col items-center justify-center">
            <h2 className="inline-block align-middle text-5xl font-semibold md:text-7xl ">
              {posts[0]?.categories[0]?.name}
            </h2>
            <span className="block mt-4 text-neutral-300">
              {posts.length} {posts.length === 1 ? "Article" : "Articles"}
            </span>
          </div>
        </div>
      </div>
      {/* ====================== END HEADER ====================== */}

      <div className="container pt-10 pb-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <div>
          <div className="flex flex-col sm:justify-between sm:flex-row">
            <div className="flex space-x-2.5">
              <ModalCategories categories={DEMO_CATEGORIES} />
              <ModalTags tags={DEMO_TAGS} />
            </div>
            <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
            <div className="flex justify-end">
              <ArchiveFilterListBox lists={FILTERS} />
            </div>
          </div>

          {/* List of articles*/}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-8 lg:mt-10">
            {posts.map((posts) => (
              <Card11 key={posts.id} post={posts} />
            ))}
          </div>

          {/* PAGINATIONS */}
          <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div>
        </div>

        {/* MORE SECTIONS */}
        {/* === SECTION 5 === */}
        <div className="relative py-16">
          <BackgroundSection />
          <SectionGridCategoryBox
            categories={DEMO_CATEGORIES.filter((_, i) => i < 10)}
          />
          <div className="text-center mx-auto mt-10 md:mt-16">
            <ButtonSecondary loading>Show me more</ButtonSecondary>
          </div>
        </div>

        {/* === SECTION 5 === */}
        <SectionSliderNewAuthors
          heading="Top elite authors"
          subHeading="Discover our elite writers"
          authors={DEMO_AUTHORS.filter((_, i) => i < 10)}
        />

        {/* SUBCRIBES */}
        <SectionSubscribe2 />
      </div>
    </div>
  );
};

export default PageSportsCategory;

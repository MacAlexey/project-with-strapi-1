import React, { FC } from "react";
import Avatar from "components/Avatar/Avatar";
import { PostDataType, PostAuthorFlexible } from "data/types";
import Link from "components/Link";

export interface PostCardMetaProps {
  className?: string;

  meta: Pick<PostDataType, "date"> & { author: PostAuthorFlexible };
  hiddenAvatar?: boolean;
  avatarSize?: string;
}

const PostCardMeta: FC<PostCardMetaProps> = ({
  className = "leading-none text-xs",
  meta,
  hiddenAvatar = false,
  avatarSize = "h-7 w-7 text-sm",
}) => {
  const { date, author } = meta;

  // это моя запись, здесь поставил as url, чтобы ts понимал и не было ошибок
  const avatarUrl =
    typeof author.avatar === "object" &&
    author.avatar !== null &&
    "url" in author.avatar
      ? (author.avatar as { url: string }).url.startsWith("/uploads")
        ? `${process.env.REACT_APP_STRAPI_HOST_URL}${
            (author.avatar as { url: string }).url
          }`
        : (author.avatar as { url: string }).url
      : typeof author.avatar === "string" &&
          author.avatar.startsWith("/uploads")
        ? `${process.env.REACT_APP_STRAPI_HOST_URL}${author.avatar}`
        : "no image here"; //default image

  return (
    <div
      className={`nc-PostCardMeta inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 ${className}`}
    >
      {/*added `/author-1/ this make path is correct*/}
      <Link
        href={author.id ? `/author-1/${author.slug}` : "/"}
        className="relative flex items-center space-x-2"
      >
        {author && avatarUrl != "no image here" ? (
          <Avatar
            radius="rounded-full"
            sizeClass={avatarSize}
            imgUrl={avatarUrl}
            userName={author.displayName}
          />
        ) : (
          <div>Loading...</div>
        )}
        <span className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
          {author.displayName}
        </span>
      </Link>
      <>
        <span className="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
          ·
        </span>
        <span className="text-neutral-500 dark:text-neutral-400 font-normal">
          {date}
        </span>
      </>
    </div>
  );
};

export default PostCardMeta;

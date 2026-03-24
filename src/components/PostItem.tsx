import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  return (
    <div className="group">
      <div className="border border-neutral-200 bg-white overflow-hidden transition">

        {/* Image */}
        <div className="w-full aspect-[16/11] overflow-hidden bg-neutral-100">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>

        {/* Content */}
        <Link to="/post" className="block">
          <div className="p-4 flex flex-col gap-2.5">

            {/* Title + Avatar (merged) */}
            <div className="flex items-center gap-2.5">

              <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                {post.title?.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-2">
                {post.title}
              </h3>

            </div>

            {/* Description */}
            <p className="text-[13px] text-neutral-600 leading-relaxed line-clamp-2">
              {post.content}
            </p>

            {/* Meta */}
            <div>
              <span className="text-xs text-neutral-400">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

          </div>
        </Link>

      </div>
    </div>
  );
};

export default PostItem;
import React, { useState } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";
import { RiMessage2Line } from "react-icons/ri";
import { BsFillSendFill } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);

  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };
  return (
    <div className="Post">
      {data.image && (
        <img
          src={
            data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""
          }
          alt=""
        />
      )}

      <div className="postReact">
        {liked ? (
          <GoHeartFill
            style={{
              color: "var(--location)",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={handleLike}
          />
        ) : (
          <GoHeart
            style={{ color: "white", fontSize: "20px", cursor: "pointer" }}
            onClick={handleLike}
          />
        )}
        <RiMessage2Line
          style={{ color: "white", fontSize: "20px", cursor: "pointer" }}
        />
        <BsFillSendFill
          style={{ color: "white", fontSize: "20px", cursor: "pointer" }}
        />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div className="detail">
        <span>
          <b>{data.name} </b>
        </span>
        <span>{data.desc}</span>
      </div>
    </div>
  );
};

export default Post;

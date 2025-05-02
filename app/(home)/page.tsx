"use client";
import CreatePostModal from "@/components/CreatePost";
import NavItem from "@/components/NavItem";
import Post from "@/components/Post";
import SuggestedAccount from "@/components/SuggestedAccount";
import { GlobalContext } from "@/services/context/context";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { logout } from "@/services/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";
import { useRouter } from "next/navigation";
import { AlertDialogLogout } from "@/components/LogoutDialog";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { fetchPosts, reset } from "@/services/redux/slices/postSlice";
import { fetchUser } from "@/services/redux/slices/user";
const cookies = new Cookies(null, { path: "/" });
// In a real implementation, import proper icons or SVGs

export const dynamic = "force-dynamic"; // remove cache

const Page = () => {
  const navItems = [
    { icon: "🏠", label: "Home" },
    { icon: "🔍", label: "Search" },
    { icon: "➕", label: "Create" },
    { icon: "❤️", label: "Likes" },
    { icon: "👤", label: "Profile" },
  ];
  const { state } = useContext(GlobalContext);
  const dispatch = useAppDispatch();
  const [userLogout, setUserLogout] = useState(false);

  const postState = useAppSelector((state) => state.posts);
  const userState = useAppSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const handleNavItemClick = (item: string) => {
    console.log("test");
    switch (item) {
      case "Home":
        console.log("Home");
        break;
      case "Search":
        console.log("Search");
        break;
      case "Create":
        setShowModal(true);
        console.log("Create");
        break;
      case "Likes":
        console.log("Likes");
        break;
      case "Profile":
        console.log("Profile");
        break;

      default:
        console.log("Default");
        break;
    }
  };

  useEffect(() => {
    if (userLogout) {
      dispatch(logout());
      toast.success("Logout successful. Redirecting...");
      setTimeout(() => router.push("/login"), 1000);
    }
  }, [userLogout]);

  useEffect(() => {
    if (cookies.get("AUTH") === undefined) {
      router.push("/login");
    }
  });

  useEffect(() => {
    const baseNumberOfPosts = 1;
    if (
      cookies.get("AUTH") &&
      postState.posts_meta.posts.length === baseNumberOfPosts
    ) {
      dispatch(fetchPosts(cookies.get("AUTH")));
    }
    if (postState.status === "succeeded") {
      dispatch(reset());
    }
  }, [dispatch, postState.posts_meta.posts.length, postState.status]);

  useEffect(() => {
    if (cookies.get("AUTH")) {
      const [, token_sub] = cookies.get("AUTH").split(".");
      const user_meta = JSON.parse(atob(token_sub));
      dispatch(
        fetchUser({ token: cookies.get("AUTH"), id: user_meta?.userId })
      );
    }
  }, [dispatch]);

  console.log(postState.posts_meta.posts);
  console.log(userState.user);
  console.log(userState.users);

  return (
    <>
      <div className="bg-white min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-16 md:w-20 lg:w-60 border-r border-gray-200 px-2 lg:px-5 py-4 lg:py-8 fixed md:sticky top-0  h-16 md:h-auto bottom-0 left-0 z-20 bg-white max-h-screen">
          <div className="mb-10 hidden lg:block">
            <Image
              src="/assets/insta_ulster_logo.svg"
              width={165}
              height={41}
              alt="insta ultser logo"
            />
          </div>
          <nav className="flex flex-col gap-4 items-center lg:items-stretch">
            {navItems.map((item, i) => (
              <button
                key={i + 1}
                onClick={() => handleNavItemClick(item.label)}
              >
                <NavItem key={i} icon={item.icon} label={item.label} />{" "}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-4 hidden lg:block">
            <AlertDialogLogout setUserLogout={setUserLogout}>
              <NavItem icon="🚪" label="Logout" />
            </AlertDialogLogout>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-16 lg:ml-[clamp(100px,10vw,300px)] max-w-[1100px] px-4 md:pr-20">
          <div className="max-w-[630px] mx-auto">
            {/* Stories */}
            <div className="flex px-2 md:px-4 pt-4 pb-3 gap-3 md:gap-4 overflow-x-auto border-b border-gray-200">
              {[
                "omid__ha...",
                "nathaniel...",
                "wizkhaya",
                "cuppymu...",
                "fireboy...",
                "teknom...",
                "anniedbia1",
                "charles_...",
              ].map((name, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[60px]"
                >
                  <div className="rounded-full bg-gradient-to-tr from-yellow-500 to-pink-500 p-[2px]">
                    <div className="bg-white rounded-full p-[2px]">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 overflow-hidden"></div>
                    </div>
                  </div>
                  <span className="text-xs mt-1 truncate w-14 text-center">
                    {name}
                  </span>
                </div>
              ))}
            </div>
            {/* Posts */}
            <div className="pb-8 max-w-[470px] mx-auto">
              {postState.posts_meta.posts.map((post) => (
                <Post
                  userId={post._id}
                  key={post._id}
                  username={post.user?.username ?? userState.user?.username}
                  verified={false}
                  timeAgo={formatDistanceToNow(new Date(post.createdAt || ""))}
                  likes={
                    (post.likes?.length || 0) + state.likes_state.likes.length
                  }
                  caption={post.content}
                  commentCount={post.comments?.length}
                  mediaUrl={post.img_url + `?${postState.posts_meta.sas_token}`}
                  postId={post._id}
                />
              ))}
              {postState.posts_meta.posts.length === 0 && (
                <>
                  <Post
                    userId="122334"
                    username="nathanielblow"
                    verified
                    timeAgo="1 d"
                    likes={state.likes_state.likes.length}
                    caption="Don't miss out !"
                    commentCount={316}
                    postId="2323"
                  />
                  <Post
                    userId="122322334"
                    username="instablog9ja"
                    verified
                    timeAgo="3 h"
                    likes={state.likes_state.likes.length}
                    caption="test"
                    commentCount={316}
                    postId="232w33"
                  />
                </>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden sticky top-0 max-h-screen w-[340px] pt-8 pl-4 pr-10 xl:block">
          {/* Current User */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-11 w-11 rounded-full bg-gray-200">
                <Image
                  src={`https://ui-avatars.com/api/?name=${
                    userState.user.username ?? "username"
                  }&background=random`}
                  width={40}
                  height={40}
                  alt="user profile"
                  className="rounded-full"
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-sm">
                  {userState.user.username ?? "username"}
                </p>
                {/* <p className="text-gray-500 text-sm">leye</p> */}
              </div>
            </div>
            <button className="text-blue-500 text-xs font-semibold">
              Switch
            </button>
          </div>
          {/* Suggestions */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500 font-semibold text-sm">
              Suggested for you
            </span>
            <span className="text-xs font-semibold">See All</span>
          </div>
          {[
            { user: "_haadjamshidi", info: "Followed by omid__hashemzade..." },
            { user: "joel.aboderin", info: "Suggested for you" },
            { user: "benabu2003", info: "Suggested for you" },
            { user: "iam_vickvibez", info: "Suggested for you" },
            { user: "olajideishola", info: "Followed by yemisi.o" },
          ].map((suggestion, i) => (
            <SuggestedAccount
              key={i}
              username={suggestion.user}
              info={suggestion.info}
            />
          ))}
          {/* Footer */}
          <div className="mt-8 text-xs text-gray-400">
            <div className="flex flex-wrap gap-x-1">
              <span>About</span>
              <span>•</span>
              <span>Help</span>
              <span>•</span>
              <span>Press</span>
              <span>•</span>
              <span>API</span>
              <span>•</span>
              <span>Jobs</span>
              <span>•</span>
              <span>Privacy</span>
              <span>•</span>
              <span>Terms</span>
            </div>
            <div className="flex flex-wrap gap-x-1 mt-1">
              <span>Locations</span>
              <span>•</span>
              <span>Language</span>
              <span>•</span>
              <span>Meta Verified</span>
            </div>
            <div className="mt-4">© 2025 INSTAGRAM FROM META</div>
          </div>
        </aside>

        {/* Bottom Navigation for Mobile */}
        <nav className="fixed pt-2 md:hidden bottom-0 left-0 w-full h-14 bg-white border-t border-gray-200 flex justify-around items-center z-30">
          {navItems.map((item, i) => (
            <button
              key={i + 1}
              className="flex flex-col items-center text-xl focus:outline-none"
              aria-label={item.label}
              onClick={() => handleNavItemClick(item.label)}
            >
              <span>{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {showModal && (
        <CreatePostModal
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default Page;

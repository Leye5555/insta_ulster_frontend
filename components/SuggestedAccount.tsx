import Image from "next/image";

const SuggestedAccount = ({
  username,
  info,
  url,
}: {
  username: string;
  url: string;
  info: string;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center">
      <div className="w-8 max-w-8 h-8 max-h-8 overflow-hidden rounded-full min-w-8 min-h-8 bg-gray-200">
        <Image
          src={url}
          width={100}
          height={100}
          alt="user profile"
          className="rounded-full min-w-[100%] min-h-[100%] object-cover"
        />
      </div>
      <div className="ml-3">
        <p className="text-sm font-semibold">{username}</p>
        <p className="text-xs text-gray-500">{info}</p>
      </div>
    </div>
    <button className="text-blue-500 text-xs font-semibold">Follow</button>
  </div>
);

export default SuggestedAccount;

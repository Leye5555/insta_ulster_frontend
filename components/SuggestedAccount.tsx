const SuggestedAccount = ({
  username,
  info,
}: {
  username: string;
  info: string;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full min-w-8 min-h-8 bg-gray-200"></div>
      <div className="ml-3">
        <p className="text-sm font-semibold">{username}</p>
        <p className="text-xs text-gray-500">{info}</p>
      </div>
    </div>
    <button className="text-blue-500 text-xs font-semibold">Follow</button>
  </div>
);

export default SuggestedAccount;

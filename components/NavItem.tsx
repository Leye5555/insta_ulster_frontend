// Navigation Item Component
const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
      active ? "font-bold" : ""
    }`}
  >
    <span className="mr-0 lg:mr-3 text-xl">{icon}</span>
    <span className="hidden lg:inline">{label}</span>
  </div>
);

export default NavItem;

import CurrencyCard from "./_components/currency-card";
import PasswordCard from "./_components/password-card";
import ProfileCard from "./_components/profile-card";

export default function Profile() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProfileCard />
        <PasswordCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CurrencyCard />
      </div>
    </div>
  )
}

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import ProfileSidebar from "../components/ProfileSideBar";
import ProfileInfo from "../components/ProfileInfo";
import ScrapList from "../components/ScrapList";
import MyPostsList from "../components/MyPostsList";

const ProfilePage: React.FC = observer(() => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col sm:flex-row p-4 sm:p-6">
      <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 bg-white shadow-md rounded-lg p-6 ml-0 sm:ml-6 w-full max-w-3xl">
        {activeTab === "profile" && <ProfileInfo />}
        {activeTab === "scrap" && <ScrapList />}
        {activeTab === "myposts" && <MyPostsList />}
      </main>
    </div>
  );
});

export default ProfilePage;

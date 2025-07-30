"use client";
import { useState, useEffect } from "react";
import AnnouncementIcon from "@/assets/icons/announcement.svg";
import Image from "next/image";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "@/app/graphql/projectMutation";
import { CREATE_ANNOUNCEMENT } from "@/app/graphql/AnnouncementMutation";
import SotetelLogo from "@/assets/images/sotetel_loading_logo.svg";
import { jwtDecode } from "jwt-decode";

interface token {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function Announcement() {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [senderId, setSenderId] = useState<string | null>(null);

  // 🔄 Apollo Hooks
  const { data, loading, error } = useQuery(GET_USERS);
  const [createAnnouncement, { loading: submitting }] = useMutation(CREATE_ANNOUNCEMENT);

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user: User) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Assuming the token is stored in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<token>(token);
        setSenderId(decodedToken.id); // Set sender ID from the token
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderId) {
      console.error("❌ No sender ID found");
      return;
    }

    try {
      const response = await createAnnouncement({
        variables: {
          input: {
            title: announcementTitle,
            content: announcementText,
            senderId: senderId, // 🔑 Using dynamic sender ID from token
            visibility: selectedVisibility,
            visibleTo: selectedVisibility === "specific" ? teamMemberIds : [],
          },
        },
      });

      console.log("✅ Announcement created:", response.data.createAnnouncement);
    } catch (err) {
      console.error("❌ Error creating announcement:", err);
    }

    (document.getElementById("my_modal_3") as HTMLDialogElement).close();

    // Reset form
    setAnnouncementTitle("");
    setAnnouncementText("");
    setSelectedVisibility("all");
    setTeamMemberIds([]);
    setSearchTerm("");
  };

  if (loading) return null;
  if (error) return <p className="text-red-500">فشل تحميل المستخدمين</p>;

  return (
    <>
      <button
        className="fixed border-none right-4 bottom-4 btn bg-[#fff] z-50 outline-none"
        onClick={() =>
          (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()
        }
      >
        <Image src={AnnouncementIcon} alt="Announcement" width={24} height={24} className="w-6 h-6" />
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box p-6 space-y-4 rounded-r-none rounded-l-xl select-none">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
            onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).close()}
          >
            ✕
          </button>

          <div>
            <Image
              src={SotetelLogo}
              alt="شعار سوتيتل"
              width={100}
              height={100}
              draggable="false"
              className="w-20 h-20 mx-auto"
            />
            <h3 className="text-lg font-semibold text-center">
              إنشاء <span className="text-green-900">إعلان</span>
            </h3>
            <p className="text-sm text-center text-gray-600">
              شارك التحديثات الهامة مع فريقك.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="announcementTitle" className="block font-medium text-gray-700">
                عنوان الإعلان:
              </label>
              <input
                id="announcementTitle"
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="أدخل العنوان هنا..."
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="announcementText" className="block font-medium text-gray-700">
                نص الإعلان:
              </label>
              <textarea
                id="announcementText"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="اكتب إعلانك هنا..."
                className="textarea textarea-bordered w-full h-32"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                الرؤية:
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="visibility"
                  value="all"
                  checked={selectedVisibility === "all"}
                  onChange={(e) => setSelectedVisibility(e.target.value)}
                  className="radio radio-success"
                />
                <label htmlFor="all" className="ml-2">الجميع</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="specific"
                  name="visibility"
                  value="specific"
                  checked={selectedVisibility === "specific"}
                  onChange={(e) => setSelectedVisibility(e.target.value)}
                  className="radio radio-success"
                />
                <label htmlFor="specific" className="ml-2">مستخدمون محددون</label>
              </div>
            </div>

            {selectedVisibility === "specific" && (
              <div>
                <h4 className="text-sm font-semibold mb-2">اختر الأعضاء</h4>
                <input
                  type="text"
                  placeholder="ابحث عن الأعضاء..."
                  className="input input-bordered w-full mb-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {filteredUsers.map((user: User) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
                      <input
                        type="checkbox"
                        value={user.id}
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={teamMemberIds.includes(user.id)}
                        onChange={() =>
                          setTeamMemberIds((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          )
                        }
                      />
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                        alt={user.firstName}
                        className="w-10 h-10 rounded-full border"
                      />
                      <p className="font-medium">
                        {user.firstName} {user.lastName} <br />
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </p>
                      <span className="badge badge-outline badge-sm">{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-action">
              <button
                type="submit"
                className="btn text-white bg-green-950 duration-150 hover:bg-black"
                disabled={submitting}
              >
                {submitting ? "جاري الإرسال..." : "إرسال الإعلان"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

import LoadingShow from "@/components/LoadingShow";
import Updateuserget from "./Updateuserget";


const UpdateUser = async ({ params, }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;
  if (!id) {
    const error_msg = "User ID not found.";
    return (
      <>
        <LoadingShow msg={error_msg} />
      </>
    );
  }

  

  return (
    <>
      <Updateuserget id={id} />
    </>
  )
};

export default UpdateUser;
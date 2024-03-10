import { RxCross2 } from "react-icons/rx";

const ProfileModel = ({ setViewDetail, viewUser }) => {
  return (
    <div className="z-10 absolute h-screen w-screen top-0 right-0 flex justify-center items-center backdrop-blur-sm">
      <div className="flex flex-col w-screen h-screen sm:w-[310px] sm:min-h-[380px] sm:h-max p-2 border-2 rounded-md bg-neutral-800">
        {/* heading */}
        <section className="relative pt-2 pb-6">
          <h3 className="text-xl text-center">Profile Detail</h3>
          <button
            className="absolute top-[-4px] right-[-4px] text-red-700 text-xl border-2 border-stone-700 hover:border-stone-600"
            onClick={() => setViewDetail(false)}
          >
            <RxCross2 />
          </button>
        </section>

        {/* show image and name */}
        <img
          src={viewUser?.pic}
          className="w-[80%] h-auto mx-auto rounded-full border-2 border-neutral-600"
          alt="Profile image"
        />
        <p className="mt-2 text-neutral-300 text-2xl text-center">
          {viewUser?.name}
        </p>
        <p className="text-neutral-400 text-md text-center">
          {viewUser?.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileModel;

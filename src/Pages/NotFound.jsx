import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-red-400 text-3xl font-serif ">Page Not Found</h1>
        <p
          className="text-lg cursor-pointer underline hover:text-green-300"
          onClick={() => {
            navigate(-1);
          }}
        >
          Click to go back
        </p>
      </div>
    </div>
  );
};

export default NotFound;

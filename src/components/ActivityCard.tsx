export const ActivityCard = ({
  name,
  description,
  price,
  duration,
  image,
}: {
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}) => {
  return (
    <div
      className={`bg-gray-900 rounded-lg shadow-lg p-4 sm:max-w-xs sm:min-w-xs md:max-w-sm md:min-w-sm lg:max-w-md lg:min-w-md xl:max-w-lg xl:min-w-lg card w-80 sm:w-72 animate-fade-up`}
    >
      {/* <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover mb-4 rounded-lg"
      /> */}
      <p>{image}</p>
      <h2 className="text-white text-xl font-bold mb-2">{name}</h2>
      <p className="text-blue-400 mb-2">{description}</p>
      <p className="text-blue-400 mb-2">Price: {price}</p>
      <p className="text-blue-400 mb-2">Duration: {duration}</p>
    </div>
  );
};
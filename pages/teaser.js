import Image from "next/image";

const Teaser = () => {
  return (
    <div className="flex flex-col container p-10">
      <h2 className="text-center">
        <span className="text-xs">Updated on 14th October, 2022</span>
      </h2>

      <div className="text-center flex flex-row space-x-6 w-full justify-center my-6">
        <div>
          <Image
            src={"/e4teaser.jpg"}
            alt="E4 Teaser"
            width={1379}
            height={1800}
          />
        </div>
      </div>
    </div>
  );
};

export default Teaser;

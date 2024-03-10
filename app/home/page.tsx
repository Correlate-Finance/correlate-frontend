'use client';

import Image from 'next/image';

const HomePage = () => {
  return (
    <div>
      <div className="p-5">
        <h1 className="text-3xl font-bold leading-none tracking-tight mb-4 text-center w-[75%] mx-auto">
          Gain an edge in minutes, powered by alt-data
        </h1>
        <p className="text-opacity-80 text-center">
          Thousands of datasets, instant corelations, custom indexes, and direct
          excel integration.
        </p>
        <div className="flex justify-center items-center">
          <button className="bg-blue-800 p-2 rounded-md text-white mt-2">
            Contact us
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-center items-center bg-gray-200">
          <Image
            src="/about-us3.jpg"
            alt="About us 3"
            width={200}
            height={150}
          />
        </div>
        <p className="text-opacity-80 text-center">
          Trusted by individuals and teams at the world&apos;s best companies
        </p>
      </div>

      <div className="p-5 md:w-[60%] m-auto shadow rounded w-[90%]">
        <div className="w-full">
          <h2 className="text-3xl font-bold leading-none tracking-tight mb-4 w-[75%]">
            Introducing correlate
          </h2>
          <div className="flex justify-between">
            <div>
              <p>Join our community and experience the benefits today!</p>
              <button className="bg-blue-800 p-2 rounded-md text-white mt-2">
                Try for free
              </button>
            </div>
            <div className="flex justify-center bg-gray-200">
              <Image
                src="/about-us3.jpg"
                alt="About us 3"
                width={200}
                height={150}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 md:w-1/2 md:m-auto">
        <div className="flex gap-5 my-10">
          <div className="flex justify-center bg-gray-200">
            <Image
              src="/about-us3.jpg"
              alt="About us 3"
              width={200}
              height={150}
            />
          </div>
          <div>
            <p className="text-opacity-80 text-gray-500">ROBUST DATA</p>
            <h3 className="text-2xl font-bold leading-none tracking-tight my-5">
              Thousands of datasets and growing
            </h3>
            <p className="text-gray-500">XYZ</p>
            <button className="p-2 rounded-md mt-2 border-2">Try now</button>
          </div>
        </div>

        <div className="flex gap-5 my-10 justify-end">
          <div>
            <p className="text-opacity-80 text-gray-500">GET YOUR EDGE</p>
            <h3 className="text-2xl font-bold leading-none tracking-tight my-5">
              Get insights within minutes
            </h3>
            <p className="text-gray-500">XYZ</p>
            <button className="p-2 rounded-md mt-2 border-2">Try now</button>
          </div>
          <div className="flex justify-center bg-gray-200">
            <Image
              src="/about-us3.jpg"
              alt="About us 3"
              width={200}
              height={150}
            />
          </div>
        </div>

        <div className="flex gap-5 my-10">
          <div className="flex justify-center bg-gray-200">
            <Image
              src="/about-us3.jpg"
              alt="About us 3"
              width={200}
              height={150}
            />
          </div>
          <div>
            <p className="text-opacity-80 text-gray-500">DIRECT AND SIMPLE</p>
            <h3 className="text-2xl font-bold leading-none tracking-tight my-5">
              Web app and excel plug in
            </h3>
            <p className="text-gray-500">XYZ</p>
            <button className="p-2 rounded-md mt-2 border-2">Try now</button>
          </div>
        </div>
      </div>

      <div className="p-5 md:w-[60%] m-auto shadow rounded w-[90%]">
        <div className="flex justify-center bg-gray-200">
          <Image
            src="/about-us3.jpg"
            alt="About us 3"
            width={200}
            height={150}
          />
        </div>
        <div className="w-full">
          <h2 className="text-3xl font-bold leading-none tracking-tight my-4 w-[75%]">
            How to sign up
          </h2>
          <p>Just 3 simple steps to optimize your company operations</p>
          <button className="bg-blue-800 p-2 rounded-md text-white mt-2">
            Try for free
          </button>
          <div>
            <h3 className="text-2xl font-bold leading-none tracking-tight my-4">
              Step 1
            </h3>
            <p>
              Reach out to one of our specialists, and have short introduction
              session.
            </p>
            <hr />
          </div>
          <div>
            <h3 className="text-2xl font-bold leading-none tracking-tight my-4">
              Step 2
            </h3>
            <p>
              Our specalist will prepare personalized package suitable for your
              needs.
            </p>
            <hr />
          </div>
          <div>
            <h3 className="text-2xl font-bold leading-none tracking-tight my-4">
              Step 3
            </h3>
            <p>Proof! You are ready to work smart with optimized operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

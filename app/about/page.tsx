'use client';

import Image from 'next/image';

const people = [
  {
    name: 'Brian Lau',
    role: 'CEO',
    picture: '/brian-lau.jpg',
  },
  {
    name: 'Ryan Hendrickson',
    role: 'Bio',
    picture: '/ryan-hendrickson.jpg',
  },
  {
    name: 'Shashank Goyal',
    role: 'Bio',
    picture: '/shashank-goyal.jpg',
  },
  {
    name: 'Jonah Kaplan',
    role: 'Bio',
    picture: '/jonah-kaplan.jpg',
  },
];

const AboutPage = () => {
  return (
    <div>
      <div className="p-5">
        <h1 className="text-4xl font-bold leading-none tracking-tight mb-4 text-center">
          About us
        </h1>
        <p className="text-opacity-80 text-center">
          We offer revolutionary solutions to industry problems. Join Correlate
          and experience the benefits of company optimization today!
        </p>
        <div className="bg-gray-200 my-4 mx-auto md:w-1/2">
          <Image src="/about-us.jpg" alt="About us" width={500} height={250} />
        </div>
      </div>

      <hr />

      <div>
        <div className="flex gap-2 items-center p-4 justify-center">
          <h3>Let&apos;s start working more efficienlty today!</h3>
          <div className="flex justify-center bg-gray-200">
            <Image
              src="/about-us2.jpg"
              alt="About us 2"
              width={200}
              height={200}
            />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-none tracking-tight mb-4 text-center">
            Team
          </h1>
          <p className="text-opacity-80 text-center">
            Meet the people behind oru magical product
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {people.map((person) => (
            <div key={person.name} className="flex flex-col items-center my-4">
              <div className="bg-gray-200 rounded-full overflow-hidden">
                <Image
                  src={person.picture}
                  alt={person.name}
                  width={100}
                  height={100}
                />
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </div>
          ))}
        </div>

        <hr />

        <div className="p-4 md:w-[60%] md:m-auto">
          <div className="w-full">
            <h1 className="text-4xl font-bold leading-none tracking-tight mb-4 w-[75%]">
              Get started with Lando today
            </h1>
            <div className="flex justify-between">
              <div>
                <p>
                  Here you can explain why peope should definitely use your
                  product right now
                </p>
                <button className="bg-blue-800 p-2 rounded-md text-white mt-2">
                  Sign up now
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
      </div>
    </div>
  );
};

export default AboutPage;
